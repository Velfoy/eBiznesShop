/*
 * FILE STRUCTURE
 * 
 * A: DB AND TABLES CREATION
 * 
 * 
 */

/* *************************************************************************************************************************** */
-- create db if not exist, replace user and password values
/* *************************************************************************************************************************** */
CREATE EXTENSION dblink;

DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database
      WHERE datname = 'FashFlow_DB'
   ) THEN
      PERFORM dblink_exec('dbname=postgres user=postgres password=hfge0406', 'CREATE DATABASE FashFlow_DB');
   END IF;
END
$$;

-- Create table Countries if it doesn't exist
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Countries' AND schemaname = 'public') THEN
		CREATE TABLE Countries(
			CountryID SERIAL PRIMARY KEY,
			CountryName VARCHAR(100) NOT NULL,
			CountryCode CHAR(2) NOT NULL UNIQUE,  -- ISO 3166-1 alpha-2 code (e.g., 'US', 'GB')
    		Continent VARCHAR(50),
    		PhoneCode VARCHAR(10),
    		CurrencyCode CHAR(3),   			   -- ISO 4217 currency code
    		CurrencyName VARCHAR(50),
			PostalCode VARCHAR(15),
			DeletionFlag BOOLEAN DEFAULT false,
			RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    		CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	RAISE NOTICE 'Table Countries created successfully';
    ELSE
        RAISE NOTICE 'Table Countries already exists';
    END IF;
END $$;

-- Create table Cities
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Cities' AND schemaname = 'public') THEN
		CREATE TABLE Cities (
    		CityID SERIAL PRIMARY KEY,
    		CountryID INTEGER NOT NULL REFERENCES Countries(CountryID) 
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		CityName VARCHAR(100) NOT NULL,
			DeletionFlag BOOLEAN DEFAULT false,
    		RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		RAISE NOTICE 'Table Cities created successfully';
    ELSE
        RAISE NOTICE 'Table Cities already exists';
    END IF;
END $$;

-- Create the users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Users' AND schemaname = 'public') THEN
        CREATE TABLE Users (
            UserID SERIAL PRIMARY KEY,
            UserName VARCHAR(100) NOT NULL,
            PasswordHash BYTEA NOT NULL CHECK (LENGTH(PasswordHash) = 64), -- 64 bytes for SHA-512 hash
			Salt BYTEA NOT NULL CHECK (LENGTH(Salt) = 32), 				-- random salt
			Provider VARCHAR(20),        									-- 'email', 'google', 'facebook'
			Provider_id VARCHAR(255),    									-- unique ID for user from provider
			Email_verified BOOLEAN UNIQUE DEFAULT false;
            Email VARCHAR(255),
            Country INTEGER NOT NULL REFERENCES Countries(CountryID)
        		ON DELETE CASCADE  
        		ON UPDATE CASCADE,
            City INTEGER NOT NULL REFERENCES Cities(CityID)
        		ON DELETE CASCADE  
        		ON UPDATE CASCADE,
            Street VARCHAR(255) NOT NULL,
            PostalCode VARCHAR(15) NOT NULL,
            Language VARCHAR(10) NOT NULL DEFAULT 'eng',
            Currency VARCHAR(3) NOT NULL,
            BonusPoints INTEGER DEFAULT 0,
            Wallet MONEY DEFAULT 0.00 NOT NULL,
			DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Optional: Create an index on email for faster lookups
        --CREATE UNIQUE INDEX idx_users_email ON users(Email);
        
        RAISE NOTICE 'Table Users created successfully';
    ELSE
        RAISE NOTICE 'Table Users already exists';
    END IF;
END $$;



------------------------------------------------------------------------------------------------------------------------

-- Create table Sellers
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Sellers' AND schemaname = 'public') THEN
		CREATE TABLE Sellers (
    		SellerID SERIAL PRIMARY KEY,
    		SellerName VARCHAR(100) NOT NULL,
    		OverallRating FLOAT DEFAULT 0.0,
    		Description VARCHAR(100),
    		TotalSales INTEGER DEFAULT 0,
			TotalSalesRevenue MONEY DEFAULT 0.00,
			Active BOOLEAN DEFAULT true,
			CONSTRAINT valid_rating CHECK (OverallRating BETWEEN 0 AND 5),
			DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		RAISE NOTICE 'Table Sellers created successfully';
    ELSE
        RAISE NOTICE 'Table Sellers already exists';
    END IF;
END $$;

-- Create table Products
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Products' AND schemaname = 'public') THEN
		CREATE TABLE Products (
    		ProductID SERIAL PRIMARY KEY,
    		SellerID INTEGER NOT NULL REFERENCES Sellers(SellerID)
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		ProductName VARCHAR(100) NOT NULL,
    		Description TEXT,
    		InStock INTEGER NOT NULL DEFAULT 0 CHECK (InStock >= 0),
    		Price MONEY NOT NULL CHECK (Price >= 0::MONEY),
    		MainPhoto VARCHAR(512),  -- path to image
    		SKU VARCHAR(50) UNIQUE  -- Stock Keeping Unit
			DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		RAISE NOTICE 'Table Products created successfully';
    ELSE
        RAISE NOTICE 'Table Products already exists';
    END IF;
END $$;


-- Create table Reviews
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Reviews' AND schemaname = 'public') THEN
		CREATE TABLE Reviews (
    		ReviewID SERIAL PRIMARY KEY,
    		ProductID INTEGER NOT NULL REFERENCES Products(ProductID)
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		UserID INTEGER NOT NULL REFERENCES Users(UserID),
    		Rating FLOAT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    		Comment TEXT,
    		Photo VARCHAR(512),  -- URL or path to review image
    		CONSTRAINT OneReviewPerUserPerProduct UNIQUE (ProductID, UserID)
			DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
		RAISE NOTICE 'Table Reviews created successfully';
    ELSE
        RAISE NOTICE 'Table Reviews already exists';
    END IF;
END $$;


-- Create table User_Interactions
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'User_Interactions' AND schemaname = 'public') THEN
		CREATE TABLE User_Interactions (
    		InteractionID SERIAL PRIMARY KEY,
    		UserID INTEGER NOT NULL REFERENCES Users(UserID)
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		ProductID INTEGER NOT NULL REFERENCES Products(ProductID)
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		EventType VARCHAR(50) NOT NULL CHECK (
        		EventType IN ('viewed', 'purchased', 'wishlisted', 'shared', 'searched', 'rated')
    		),
    		InteractionTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    		DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
		RAISE NOTICE 'Table User_Interactions created successfully';
    ELSE
        RAISE NOTICE 'Table User_Interactions already exists';
    END IF;
END $$;


-- Create table Categories 
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Categories' AND schemaname = 'public') THEN
		CREATE TABLE Categories (
    		CategoryID SERIAL PRIMARY KEY,
    		CategoryName VARCHAR(100) NOT NULL UNIQUE,
    		ParentCategoryID INTEGER REFERENCES Categories(CategoryID)
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,  -- for hierarchical categories
    		Description VARCHAR(100),
    		DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
		RAISE NOTICE 'Table Categories created successfully';
    ELSE
        RAISE NOTICE 'Table Categories already exists';
    END IF;
END $$;


-- Create table Product_Categories 
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Product_Categories' AND schemaname = 'public') THEN
		CREATE TABLE Product_Categories (
 			ProductCategoryID SERIAL PRIMARY KEY,
    		ProductID INTEGER NOT NULL REFERENCES Products(ProductID) 
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		CategoryID INTEGER NOT NULL REFERENCES Categories(CategoryID)
				ON DELETE CASCADE  
        		ON UPDATE CASCADE,
    		CONSTRAINT UniqueProductCategory UNIQUE (ProductID, CategoryID)
    		DeletionFlag BOOLEAN DEFAULT false,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
			CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ModifiedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
		RAISE NOTICE 'Table Product_Categories created successfully';
    ELSE
        RAISE NOTICE 'Table Product_Categories already exists';
    END IF;
END $$;