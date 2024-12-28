-- 创建数据库
CREATE DATABASE IF NOT EXISTS meeting_tasks
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE meeting_tasks;

-- 创建会议表
CREATE TABLE IF NOT EXISTS meetings (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  meeting_time DATETIME NOT NULL,
  area VARCHAR(50) NOT NULL,
  attendees TEXT,
  status ENUM('pending', 'confirmed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建专业确认表
CREATE TABLE IF NOT EXISTS specialty_confirmations (
  id VARCHAR(36) PRIMARY KEY,
  meeting_id VARCHAR(36) NOT NULL,
  specialty VARCHAR(50) NOT NULL,
  specialist VARCHAR(100),
  status ENUM('pending', 'confirmed') DEFAULT 'pending',
  opinion TEXT,
  confirmed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  INDEX idx_meeting_specialty (meeting_id, specialty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 