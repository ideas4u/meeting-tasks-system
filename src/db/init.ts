import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  try {
    console.log('Connecting to MySQL with config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      // 不要打印密码
    });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      multipleStatements: true
    });

    console.log('Successfully connected to MySQL');

    const sqlFile = join(__dirname, 'init.sql');
    console.log('Reading SQL file from:', sqlFile);
    const sql = readFileSync(sqlFile, 'utf8');

    console.log('Executing SQL statements...');
    await connection.query(sql);
    console.log('Database initialized successfully');

    await connection.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error(`
        无法连接到 MySQL 服务器。请确保：
        1. MySQL 服务器已启动
        2. MySQL 服务器正在监听端口 ${process.env.DB_PORT}
        3. 主机名 ${process.env.DB_HOST} 是正确的
        4. 防火墙设置允许连接
      `);
    }
    process.exit(1);
  }
}

// 检查环境变量是否已正确加载
console.log('Environment variables loaded:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME
});

initDatabase(); 