import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';

export default function TaskConfirmation() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [confirmerName, setConfirmerName] = useState('');
  const [opinion, setOpinion] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskData = await taskService.getTaskById(taskId);
        if (taskData) {
          console.log('获取到的会议详情:', taskData); // 添加日志
          setTask(taskData);
        }
      } catch (error) {
        console.error('Failed to load task:', error);
        // TODO: 添加错误提示
      }
    };
    loadTask();
  }, [taskId]);

  const handleSpecialtyChange = (event) => {
    const specialty = event.target.value;
    setSelectedSpecialty(specialty);
    // 预填确认人姓名（如果已经设置）
    const confirmation = task.specialtyConfirmations?.find(
      conf => conf.specialty === specialty
    );
    if (confirmation) {
      setConfirmerName(confirmation.specialist || '');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedTask = await taskService.submitConfirmation(
        taskId,
        selectedSpecialty,
        confirmerName,
        opinion
      );
      if (updatedTask) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to submit confirmation:', error);
      // TODO: 添加错误提示
    }
  };

  if (!task) {
    return <Typography>加载中...</Typography>;
  }

  const pendingConfirmations = task.specialtyConfirmations?.filter(
    conf => conf.status === 'pending'
  ) || [];

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '未设置';
    try {
      return new Date(dateStr).toLocaleString();
    } catch (error) {
      console.error('日期格式化错误:', error);
      return dateStr;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          会议事项确认
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">会议议题</Typography>
          <Typography>{task.title}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">会议时间</Typography>
          <Typography>{formatDateTime(task.meeting_time)}</Typography>
        </Box>

        {pendingConfirmations.length === 0 ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            所有专业已完成确认
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>选择待确认专业</InputLabel>
              <Select
                value={selectedSpecialty}
                onChange={handleSpecialtyChange}
                label="选择待确认专业"
              >
                {pendingConfirmations.map((conf) => (
                  <MenuItem key={conf.specialty} value={conf.specialty}>
                    {conf.specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedSpecialty && (
              <>
                <TextField
                  fullWidth
                  label="确认人姓名"
                  value={confirmerName}
                  onChange={(e) => setConfirmerName(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="专业确认意见"
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  提交确认意见
                </Button>
              </>
            )}
          </form>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            确认状态
          </Typography>
          {task.specialtyConfirmations?.map((conf) => (
            <Box key={conf.specialty} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {conf.specialty}：{conf.status === 'confirmed' ? '已确认' : '待确认'}
              </Typography>
              {conf.status === 'confirmed' && (
                <>
                  <Typography variant="body2">确认人：{conf.specialist}</Typography>
                  <Typography variant="body2">确认意见：{conf.opinion}</Typography>
                  <Typography variant="body2">
                    确认时间：{formatDateTime(conf.confirmed_at)}
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
} 