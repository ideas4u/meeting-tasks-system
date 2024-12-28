import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Meeting {
  id: string;
  title: string;
  meetingTime: Date;
  area: string;
  attendees: string;
  status: 'pending' | 'confirmed';
}

interface SpecialtyConfirmation {
  id: string;
  meetingId: string;
  specialty: string;
  specialist: string;
  status: 'pending' | 'confirmed';
  opinion: string | null;
  confirmedAt: Date | null;
}

export const meetingsApi = {
  async createMeeting(data: any) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const meetingId = uuidv4();
      
      // 转换日期格式
      const meetingTime = new Date(data.meetingTime);
      const formattedMeetingTime = meetingTime.toISOString().slice(0, 19).replace('T', ' ');

      // 创建会议记录
      await connection.execute(
        `INSERT INTO meetings (id, title, meeting_time, area, attendees, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [meetingId, data.title, formattedMeetingTime, data.area, data.attendees]
      );

      // 创建专业确认记录
      for (const specialty of data.specialties) {
        await connection.execute(
          `INSERT INTO specialty_confirmations (id, meeting_id, specialty, specialist, status)
           VALUES (?, ?, ?, ?, 'pending')`,
          [uuidv4(), meetingId, specialty, data.specialists[specialty]]
        );
      }

      await connection.commit();
      return { id: meetingId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getAllMeetings() {
    const [meetings] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM meetings ORDER BY created_at DESC`
    );

    const result = [];
    for (const meeting of meetings) {
      const [confirmations] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM specialty_confirmations WHERE meeting_id = ?`,
        [meeting.id]
      );
      result.push({
        ...meeting,
        specialtyConfirmations: confirmations
      });
    }
    return result;
  },

  async getMeetingById(id: string) {
    const [meetings] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM meetings WHERE id = ?`,
      [id]
    );
    if (meetings.length === 0) return null;

    const [confirmations] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM specialty_confirmations WHERE meeting_id = ?`,
      [id]
    );

    return {
      ...meetings[0],
      specialtyConfirmations: confirmations
    };
  },

  async submitConfirmation(meetingId: string, data: any) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 更新专业确认状态
      await connection.execute(
        `UPDATE specialty_confirmations 
         SET status = 'confirmed', 
             specialist = ?,
             opinion = ?,
             confirmed_at = NOW()
         WHERE meeting_id = ? AND specialty = ?`,
        [data.specialist, data.opinion, meetingId, data.specialty]
      );

      // 检查是否所有专业都已确认
      const [confirmations] = await connection.query<RowDataPacket[]>(
        `SELECT status FROM specialty_confirmations WHERE meeting_id = ?`,
        [meetingId]
      );

      const allConfirmed = confirmations.every(conf => conf.status === 'confirmed');
      if (allConfirmed) {
        await connection.execute(
          `UPDATE meetings SET status = 'confirmed' WHERE id = ?`,
          [meetingId]
        );
      }

      await connection.commit();
      return await this.getMeetingById(meetingId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}; 