import express from 'express';
import { pool } from '../db';

const router = express.Router();

// 创建会议
router.post('/meetings', async (req, res) => {
  const { title, meetingTime, area, attendees, professionals } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 插入会议基本信息
      const [result] = await connection.execute(
        'INSERT INTO meetings (id, title, meeting_time, area, attendees) VALUES (UUID(), ?, ?, ?, ?)',
        [title, meetingTime, area, attendees]
      );
      
      const meetingId = result.insertId;
      
      // 插入涉及专业信息
      for (const prof of professionals) {
        await connection.execute(
          'INSERT INTO meeting_professionals (id, meeting_id, professional_type) VALUES (UUID(), ?, ?)',
          [meetingId, prof]
        );
      }
      
      await connection.commit();
      res.json({ id: meetingId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: '创建会议失败' });
  }
});

// 专业确认
router.post('/meetings/:id/confirmations', async (req, res) => {
  const { id } = req.params;
  const { type, confirmer, comment } = req.body;
  
  try {
    await pool.execute(
      `UPDATE meeting_professionals 
       SET status = '已确认', 
           confirmer_name = ?, 
           comment = ?,
           confirmed_at = CURRENT_TIMESTAMP
       WHERE meeting_id = ? AND professional_type = ?`,
      [confirmer, comment, id, type]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '确认失败' });
  }
});

// 获取会议列表
router.get('/meetings', async (req, res) => {
  try {
    const [meetings] = await pool.execute(`
      SELECT m.*, 
             GROUP_CONCAT(mp.professional_type) as professionals,
             COUNT(CASE WHEN mp.status = '已确认' THEN 1 END) as confirmed_count,
             COUNT(mp.id) as total_count
      FROM meetings m
      LEFT JOIN meeting_professionals mp ON m.id = mp.meeting_id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: '获取会议列表失败' });
  }
}); 