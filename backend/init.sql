-- Initialize the riddler_db database with quiz table
USE riddler_db;

CREATE TABLE IF NOT EXISTS quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_url VARCHAR(2048) NOT NULL,
    summary TEXT,
    quiz_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_created_at ON quiz(created_at);

-- Display table structure
DESCRIBE quiz;
