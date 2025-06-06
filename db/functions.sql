------------------------------ register/log in

-- Create extension for cryptographic functions if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to check if user exists (by email or username)
CREATE OR REPLACE FUNCTION user_exists(
    p_username VARCHAR(100),
    p_email VARCHAR(255)
RETURNS BOOLEAN AS $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count
    FROM Users
    WHERE (UserName = p_username OR Email = p_email)
    AND DeletionFlag = false;
    
    RETURN user_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to register a new user with password hashing
CREATE OR REPLACE FUNCTION register_user(
    p_username VARCHAR(100),
    p_password VARCHAR(255),
    p_email VARCHAR(255),
    p_country INTEGER,
    p_city INTEGER,
    p_street VARCHAR(255),
    p_postalcode VARCHAR(15),
    p_language VARCHAR(10) DEFAULT 'eng',
    p_currency VARCHAR(3),
    p_provider VARCHAR(20) DEFAULT 'email',
    p_provider_id VARCHAR(255) DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
    v_salt BYTEA;
    v_password_hash BYTEA;
    v_user_id INTEGER;
BEGIN
    -- Check if user already exists
    IF user_exists(p_username, p_email) THEN
        RAISE EXCEPTION 'User with this username or email already exists';
    END IF;
    
    -- Generate random salt
    v_salt := gen_random_bytes(32);
    
    -- Hash password with salt (SHA-512)
    v_password_hash := digest(v_salt || p_password::BYTEA, 'sha512');
    
    -- Insert new user
    INSERT INTO Users (
        UserName,
        PasswordHash,
        Salt,
        Email,
        Country,
        City,
        Street,
        PostalCode,
        Language,
        Currency,
        Provider,
        Provider_id
    ) VALUES (
        p_username,
        v_password_hash,
        v_salt,
        p_email,
        p_country,
        p_city,
        p_street,
        p_postalcode,
        p_language,
        p_currency,
        p_provider,
        p_provider_id
    ) RETURNING UserID INTO v_user_id;
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to authenticate user
CREATE OR REPLACE FUNCTION authenticate_user(
    p_username VARCHAR(100),
    p_password VARCHAR(255))
RETURNS INTEGER AS $$
DECLARE
    v_user_id INTEGER;
    v_salt BYTEA;
    v_stored_hash BYTEA;
    v_computed_hash BYTEA;
BEGIN
    -- Get user's salt and stored hash
    SELECT UserID, Salt, PasswordHash INTO v_user_id, v_salt, v_stored_hash
    FROM Users
    WHERE (UserName = p_username OR Email = p_username)
    AND DeletionFlag = false;
    
    -- If user not found
    IF v_user_id IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Compute hash with provided password
    v_computed_hash := digest(v_salt || p_password::BYTEA, 'sha512');
    
    -- Compare hashes
    IF v_computed_hash = v_stored_hash THEN
        RETURN v_user_id;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update user password
CREATE OR REPLACE FUNCTION update_user_password(
    p_user_id INTEGER,
    p_new_password VARCHAR(255))
RETURNS VOID AS $$
DECLARE
    v_salt BYTEA;
    v_password_hash BYTEA;
BEGIN
    -- Generate new random salt
    v_salt := gen_random_bytes(32);
    
    -- Hash new password with salt
    v_password_hash := digest(v_salt || p_new_password::BYTEA, 'sha512');
    
    -- Update user record
    UPDATE Users
    SET 
        PasswordHash = v_password_hash,
        Salt = v_salt,
        ModifiedAt = CURRENT_TIMESTAMP
    WHERE UserID = p_user_id;
END;
$$ LANGUAGE plpgsql;

---------------------------- products getting

CREATE OR REPLACE FUNCTION get_products_with_categories(
    p_include_deleted BOOLEAN DEFAULT FALSE,
    p_seller_id INTEGER DEFAULT NULL,
    p_category_id INTEGER DEFAULT NULL,
    p_limit INTEGER DEFAULT NULL,
    p_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    product_id INTEGER,
    seller_id INTEGER,
    product_name VARCHAR(100),
    description TEXT,
    in_stock INTEGER,
    price MONEY,
    main_photo VARCHAR(512),
    sku VARCHAR(50),
    deletion_flag BOOLEAN,
    row_guid UUID,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    category_ids INTEGER[],
    category_names VARCHAR(100)[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.ProductID,
        p.SellerID,
        p.ProductName,
        p.Description,
        p.InStock,
        p.Price,
        p.MainPhoto,
        p.SKU,
        p.DeletionFlag,
        p.RowGuid,
        p.CreatedAt,
        p.ModifiedAt,
        -- Aggregate category IDs into an array
        ARRAY_AGG(c.CategoryID) FILTER (WHERE c.CategoryID IS NOT NULL) AS category_ids,
        -- Aggregate category names into an array
        ARRAY_AGG(c.CategoryName) FILTER (WHERE c.CategoryName IS NOT NULL) AS category_names
    FROM 
        Products p
    LEFT JOIN 
        Product_Categories pc ON p.ProductID = pc.ProductID AND 
                               (p_include_deleted OR NOT pc.DeletionFlag)
    LEFT JOIN 
        Categories c ON pc.CategoryID = c.CategoryID AND 
                      (p_include_deleted OR NOT c.DeletionFlag)
    WHERE 
        (p_include_deleted OR NOT p.DeletionFlag) AND
        (p_seller_id IS NULL OR p.SellerID = p_seller_id) AND
        (p_category_id IS NULL OR c.CategoryID = p_category_id)
    GROUP BY 
        p.ProductID
    ORDER BY 
        p.ProductName
    LIMIT 
        CASE WHEN p_limit IS NULL THEN NULL ELSE p_limit END
    OFFSET 
        p_offset;
END;
$$ LANGUAGE plpgsql;



--------------------------------- cart management

-- Create CartItems table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'CartItems' AND schemaname = 'public') THEN
        CREATE TABLE CartItems (
            CartItemID SERIAL PRIMARY KEY,
            CartID INTEGER NOT NULL REFERENCES Carts(CartID)
                ON DELETE CASCADE  
                ON UPDATE CASCADE,
            ProductID INTEGER NOT NULL REFERENCES Products(ProductID)
                ON DELETE CASCADE  
                ON UPDATE CASCADE,
            Quantity INTEGER NOT NULL CHECK (Quantity > 0),
            AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT UniqueCartProduct UNIQUE (CartID, ProductID)
        );
        RAISE NOTICE 'Table CartItems created successfully';
    ELSE
        RAISE NOTICE 'Table CartItems already exists';
    END IF;
END $$;

-- Function to get or create a cart for a user
CREATE OR REPLACE FUNCTION get_or_create_cart(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_cart_id INTEGER;
BEGIN
    -- Try to find existing active cart
    SELECT CartID INTO v_cart_id
    FROM Carts
    WHERE UserID = p_user_id
    ORDER BY CreatedAt DESC
    LIMIT 1;
    
    -- If no cart exists, create one
    IF v_cart_id IS NULL THEN
        INSERT INTO Carts (UserID)
        VALUES (p_user_id)
        RETURNING CartID INTO v_cart_id;
    END IF;
    
    RETURN v_cart_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add product to cart
CREATE OR REPLACE FUNCTION add_to_cart(
    p_user_id INTEGER,
    p_product_id INTEGER,
    p_quantity INTEGER DEFAULT 1)
RETURNS VOID AS $$
DECLARE
    v_cart_id INTEGER;
    v_current_quantity INTEGER;
    v_in_stock INTEGER;
BEGIN
    -- Validate quantity
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than 0';
    END IF;
    
    -- Check product availability
    SELECT InStock INTO v_in_stock
    FROM Products
    WHERE ProductID = p_product_id AND DeletionFlag = false;
    
    IF v_in_stock IS NULL THEN
        RAISE EXCEPTION 'Product not found or deleted';
    END IF;
    
    IF v_in_stock < p_quantity THEN
        RAISE EXCEPTION 'Not enough stock available';
    END IF;
    
    -- Get or create cart
    v_cart_id := get_or_create_cart(p_user_id);
    
    -- Check if product already in cart
    SELECT Quantity INTO v_current_quantity
    FROM CartItems
    WHERE CartID = v_cart_id AND ProductID = p_product_id;
    
    IF v_current_quantity IS NOT NULL THEN
        -- Update existing cart item
        UPDATE CartItems
        SET Quantity = v_current_quantity + p_quantity,
            ModifiedAt = CURRENT_TIMESTAMP
        WHERE CartID = v_cart_id AND ProductID = p_product_id;
    ELSE
        -- Add new cart item
        INSERT INTO CartItems (CartID, ProductID, Quantity)
        VALUES (v_cart_id, p_product_id, p_quantity);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get cart contents
CREATE OR REPLACE FUNCTION get_cart_contents(p_user_id INTEGER)
RETURNS TABLE (
    cart_item_id INTEGER,
    product_id INTEGER,
    product_name VARCHAR(100),
    price MONEY,
    quantity INTEGER,
    subtotal MONEY,
    main_photo VARCHAR(512),
    in_stock INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.CartItemID,
        p.ProductID,
        p.ProductName,
        p.Price,
        ci.Quantity,
        (p.Price * ci.Quantity) AS Subtotal,
        p.MainPhoto,
        p.InStock
    FROM 
        Carts c
    JOIN 
        CartItems ci ON c.CartID = ci.CartID
    JOIN 
        Products p ON ci.ProductID = p.ProductID
    WHERE 
        c.UserID = p_user_id AND
        p.DeletionFlag = false
    ORDER BY 
        ci.AddedAt DESC;
END;
$$ LANGUAGE plpgsql;

--------------------------------- order management

-- Create OrderItems table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'OrderItems' AND schemaname = 'public') THEN
        CREATE TABLE OrderItems (
            OrderItemID SERIAL PRIMARY KEY,
            OrderID INTEGER NOT NULL REFERENCES Orders(OrderID)
                ON DELETE CASCADE  
                ON UPDATE CASCADE,
            ProductID INTEGER NOT NULL REFERENCES Products(ProductID)
                ON DELETE CASCADE  
                ON UPDATE CASCADE,
            Quantity INTEGER NOT NULL CHECK (Quantity > 0),
            PriceAtPurchase MONEY NOT NULL,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        RAISE NOTICE 'Table OrderItems created successfully';
    ELSE
        RAISE NOTICE 'Table OrderItems already exists';
    END IF;
END $$;

-- Function to create order from cart
CREATE OR REPLACE FUNCTION create_order_from_cart(
    p_user_id INTEGER,
    p_use_bonus_points BOOLEAN DEFAULT FALSE)
RETURNS INTEGER AS $$
DECLARE
    v_cart_id INTEGER;
    v_order_id INTEGER;
    v_total_amount MONEY;
    v_bonus_points_used INTEGER;
    v_bonus_points_value MONEY;
    v_wallet_balance MONEY;
    v_product RECORD;
BEGIN
    -- Get user's cart
    SELECT CartID INTO v_cart_id
    FROM Carts
    WHERE UserID = p_user_id
    ORDER BY CreatedAt DESC
    LIMIT 1;
    
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'No cart found for this user';
    END IF;
    
    -- Calculate total amount and validate stock
    SELECT COALESCE(SUM(p.Price * ci.Quantity), 0::MONEY) INTO v_total_amount
    FROM CartItems ci
    JOIN Products p ON ci.ProductID = p.ProductID
    WHERE ci.CartID = v_cart_id AND p.DeletionFlag = false;
    
    IF v_total_amount <= 0::MONEY THEN
        RAISE EXCEPTION 'Cart is empty or contains only deleted products';
    END IF;
    
    -- Check stock availability for all items
    FOR v_product IN 
        SELECT ci.ProductID, ci.Quantity, p.InStock, p.ProductName
        FROM CartItems ci
        JOIN Products p ON ci.ProductID = p.ProductID
        WHERE ci.CartID = v_cart_id AND p.DeletionFlag = false
    LOOP
        IF v_product.InStock < v_product.Quantity THEN
            RAISE EXCEPTION 'Not enough stock for product: % (Available: %, Requested: %)', 
                v_product.ProductName, v_product.InStock, v_product.Quantity;
        END IF;
    END LOOP;
    
    -- Handle bonus points if requested
    IF p_use_bonus_points THEN
        SELECT BonusPoints, (BonusPoints * 0.01)::MONEY  -- Assuming 1 point = $0.01
        INTO v_bonus_points_used, v_bonus_points_value
        FROM Users
        WHERE UserID = p_user_id;
        
        IF v_bonus_points_value > 0 THEN
            v_total_amount := GREATEST(v_total_amount - v_bonus_points_value, 0::MONEY);
        END IF;
    END IF;
    
    -- Check wallet balance if total is not covered by bonus points
    IF v_total_amount > 0 THEN
        SELECT Wallet INTO v_wallet_balance
        FROM Users
        WHERE UserID = p_user_id;
        
        IF v_wallet_balance < v_total_amount THEN
            RAISE EXCEPTION 'Insufficient wallet balance';
        END IF;
    END IF;
    
    -- Start transaction
    BEGIN
        -- Create the order
        INSERT INTO Orders (UserID, TotalAmount, Status)
        VALUES (p_user_id, v_total_amount, 'pending')
        RETURNING OrderID INTO v_order_id;
        
        -- Add order items
        INSERT INTO OrderItems (OrderID, ProductID, Quantity, PriceAtPurchase)
        SELECT 
            v_order_id, 
            p.ProductID, 
            ci.Quantity, 
            p.Price
        FROM 
            CartItems ci
        JOIN 
            Products p ON ci.ProductID = p.ProductID
        WHERE 
            ci.CartID = v_cart_id AND 
            p.DeletionFlag = false;
        
        -- Update product stock
        UPDATE Products p
        SET InStock = p.InStock - ci.Quantity,
            ModifiedAt = CURRENT_TIMESTAMP
        FROM CartItems ci
        WHERE 
            p.ProductID = ci.ProductID AND
            ci.CartID = v_cart_id;
        
        -- Update user's wallet and bonus points if used
        UPDATE Users
        SET 
            Wallet = CASE 
                        WHEN p_use_bonus_points AND v_total_amount > 0 THEN Wallet - v_total_amount
                        WHEN p_use_bonus_points THEN Wallet
                        ELSE Wallet - v_total_amount
                      END,
            BonusPoints = CASE 
                            WHEN p_use_bonus_points THEN 0
                            ELSE BonusPoints
                          END,
            ModifiedAt = CURRENT_TIMESTAMP
        WHERE UserID = p_user_id;
        
        -- Clear the cart
        DELETE FROM CartItems WHERE CartID = v_cart_id;
        
        -- Commit transaction
        RETURN v_order_id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Order creation failed: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to get order details
CREATE OR REPLACE FUNCTION get_order_details(p_order_id INTEGER)
RETURNS TABLE (
    order_id INTEGER,
    user_id INTEGER,
    order_date TIMESTAMP,
    total_amount MONEY,
    status VARCHAR(20),
    product_id INTEGER,
    product_name VARCHAR(100),
    quantity INTEGER,
    price_at_purchase MONEY,
    subtotal MONEY,
    main_photo VARCHAR(512)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.OrderID,
        o.UserID,
        o.OrderDate,
        o.TotalAmount,
        o.Status,
        p.ProductID,
        p.ProductName,
        oi.Quantity,
        oi.PriceAtPurchase,
        (oi.PriceAtPurchase * oi.Quantity) AS Subtotal,
        p.MainPhoto
    FROM 
        Orders o
    JOIN 
        OrderItems oi ON o.OrderID = oi.OrderID
    JOIN 
        Products p ON oi.ProductID = p.ProductID
    WHERE 
        o.OrderID = p_order_id
    ORDER BY 
        p.ProductName;
END;
$$ LANGUAGE plpgsql;