import express from 'express';
import { meetingsApi } from './meetings.impl.js';

const router = express.Router();

// 创建新会议
router.post('/meetings', async (req, res) => {
  try {
    const result = await meetingsApi.createMeeting(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// 获取所有会议
router.get('/meetings', async (req, res) => {
  try {
    const meetings = await meetingsApi.getAllMeetings();
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// 获取单个会议
router.get('/meetings/:id', async (req, res) => {
  try {
    const meeting = await meetingsApi.getMeetingById(req.params.id);
    if (!meeting) {
      res.status(404).json({ error: 'Meeting not found' });
      return;
    }
    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ error: 'Failed to fetch meeting' });
  }
});

// 提交专业确认
router.post('/meetings/:id/confirm', async (req, res) => {
  try {
    const meeting = await meetingsApi.submitConfirmation(req.params.id, req.body);
    res.json(meeting);
  } catch (error) {
    console.error('Error submitting confirmation:', error);
    res.status(500).json({ error: 'Failed to submit confirmation' });
  }
});

export default router; 