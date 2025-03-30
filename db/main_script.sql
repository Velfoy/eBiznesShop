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

-- Set the database context
psql -d FashFlow_DB -U postgres -p hfge0406

-- Create the users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND schemaname = 'public') THEN
        CREATE TABLE users (
            UserID SERIAL PRIMARY KEY,
            UserName VARCHAR(255) NOT NULL,
            PasswordHash VARCHAR(255) NOT NULL,
            Email VARCHAR(255) NOT NULL,
            Country VARCHAR(100),
            City VARCHAR(100),
            Street VARCHAR(255),
            PostalCode VARCHAR(20),
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            Language VARCHAR(10),
            Currency VARCHAR(3),
            BonusPoints INTEGER DEFAULT 0,
            Wallet MONEY DEFAULT 0.00,
            RowGuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
            ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Optional: Create an index on email for faster lookups
        --CREATE UNIQUE INDEX idx_users_email ON users(Email);
        
        RAISE NOTICE 'Table users created successfully';
    ELSE
        RAISE NOTICE 'Table users already exists';
    END IF;
END $$;

SELECT current_database();