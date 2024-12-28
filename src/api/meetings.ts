import express from 'express';
import { meetingsApi } from './meetings.impl.js';

const router = express.Router();

router.post('/meetings', async (req, res) => {
  try {
    const meetingId = await meetingsApi.createMeeting(req.body);
    res.json({ id: meetingId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// ... 其他路由保持不变

export default router; 