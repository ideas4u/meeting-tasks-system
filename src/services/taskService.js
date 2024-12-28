import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const taskService = {
  // 创建新会议任务
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/meetings`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  // 获取所有会议任务
  getAllTasks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/meetings`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  // 获取单个会议任务
  getTaskById: async (taskId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/meetings/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch task:', error);
      throw error;
    }
  },

  // 提交专业确认意见
  submitConfirmation: async (taskId, specialty, confirmerName, opinion) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/meetings/${taskId}/confirm`, {
        specialty,
        specialist: confirmerName,
        opinion
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit confirmation:', error);
      throw error;
    }
  }
}; 