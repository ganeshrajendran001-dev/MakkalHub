CREATE DATABASE IF NOT EXISTS ration_shop;
USE ration_shop;

-- Admin Login
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Areas
CREATE TABLE areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL UNIQUE
);

-- Shop Status
CREATE TABLE shop_schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_date DATE NOT NULL,
    shop_status ENUM('Open', 'Closed', 'Holiday') NOT NULL,
    in_time TIME,
    out_time TIME,
    admin_status ENUM('Available', 'Leave') DEFAULT 'Available',
    leave_reason VARCHAR(255),
    next_available_date DATE
);

-- Items
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Daily Items & Prices
CREATE TABLE daily_items (
    daily_item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_date DATE NOT NULL,
    item_id INT NOT NULL,
    quantity DECIMAL(10,2),
    price DECIMAL(10,2),
    availability ENUM('Available', 'Not Available') DEFAULT 'Available',
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

-- Area Distribution Schedule
CREATE TABLE distribution (
    distribution_id INT AUTO_INCREMENT PRIMARY KEY,
    distribution_date DATE NOT NULL,
    area_id INT NOT NULL,
    start_time TIME,
    end_time TIME,
    status ENUM('Available', 'Upcoming', 'Not Available') DEFAULT 'Upcoming',
    notes TEXT,
    FOREIGN KEY (area_id) REFERENCES areas(area_id)
);

-- Special Government Issue
CREATE TABLE special_issue (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    issue_month VARCHAR(30) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2),
    unit VARCHAR(30),
    issue_date DATE,
    eligible_area VARCHAR(100),
    description TEXT
);

-- Public Members
CREATE TABLE public_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    area_id INT NOT NULL,
    FOREIGN KEY (area_id) REFERENCES areas(area_id)
);

-- SMS History
CREATE TABLE sms_logs (
    sms_id INT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL,
    message TEXT NOT NULL,
    sent_date DATE NOT NULL,
    sent_time TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'Prepared'
);

-- Default Areas
INSERT INTO areas (area_name) VALUES
('Killinjikuppam'),
('Killinjikuppam PT'),
('Puthu Poonjolaikuppam');

-- Default Items
INSERT INTO items (item_name, description) VALUES
('Rice', 'Rice'),
('Sugar', 'Sugar'),
('Wheat', 'Wheat'),
('Oil', 'Cooking Oil'),
('Dal', 'Dal');

-- Temporary Admin
-- Replace this with secure hashed password during final development
INSERT INTO admin (username, password)
VALUES ('admin', 'admin123');