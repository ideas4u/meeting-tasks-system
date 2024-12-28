import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Box,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const allTasks = await taskService.getAllTasks();
        console.log('获取到的会议列表:', allTasks);
        setTasks(allTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        // TODO: 添加错误提示
      }
    };
    loadTasks();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        会议事项列表
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem 
            key={task.id}
            sx={{ 
              border: '1px solid #ddd',
              borderRadius: 1,
              mb: 2,
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            <ListItemText
              primary={task.title}
              secondary={
                <>
                  <Typography variant="body2" component="span" display="block">
                    会议时间：{task.meeting_time ? new Date(task.meeting_time).toLocaleString() : '未设置'}
                  </Typography>
                  <Typography variant="body2" component="span" display="block">
                    会议区域：{task.area}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {task.specialtyConfirmations?.map((conf) => (
                      <Chip
                        key={conf.specialty}
                        label={`${conf.specialty}: ${conf.status === 'confirmed' ? '已确认' : '待确认'}`}
                        color={conf.status === 'confirmed' ? 'success' : 'warning'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              }
            />
            <Box sx={{ alignSelf: 'flex-end', mt: 1 }}>
              <Button
                component={Link}
                to={`/confirm/${task.id}`}
                color="primary"
                variant="contained"
                size="small"
              >
                查看详情
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
} 