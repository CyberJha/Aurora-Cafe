-- ================================================
-- Aurora Cafe - Database Schema
-- Run this SQL in your MySQL client to set up the database
-- ================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS cafe_orders
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Step 2: Switch to the database
USE cafe_orders;

-- Step 3: Create the orders table
CREATE TABLE IF NOT EXISTS orders (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone_number  VARCHAR(20)  NOT NULL,
    item_name     VARCHAR(150) NOT NULL,
    quantity      INT          NOT NULL CHECK (quantity > 0),
    special_notes TEXT,
    order_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- (Optional) Verify the table structure
-- DESCRIBE orders;
