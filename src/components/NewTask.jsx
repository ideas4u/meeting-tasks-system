import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';

const AREAS = [
  '天河', '越秀', '海珠', '荔湾', '白云北', '白云南',
  '黄埔', '番禺', '花都', '南沙', '从化', '增城'
];

const SPECIALTIES = ['管线', '宽带', '无线', '交付'];

export default function NewTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    meetingTime: null,
    area: '',
    attendees: '',
    specialties: [],
    specialists: {}
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyChange = (event) => {
    const specialty = event.target.name;
    const isChecked = event.target.checked;
    
    setFormData(prev => ({
      ...prev,
      specialties: isChecked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty),
      specialists: isChecked
        ? { ...prev.specialists, [specialty]: '' }
        : Object.fromEntries(
            Object.entries(prev.specialists).filter(([key]) => key !== specialty)
          )
    }));
  };

  const handleSpecialistChange = (specialty, value) => {
    setFormData(prev => ({
      ...prev,
      specialists: {
        ...prev.specialists,
        [specialty]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const task = await taskService.createTask(formData);
      console.log('Created task:', task);
      navigate('/');
    } catch (error) {
      console.error('Failed to create task:', error);
      // TODO: 添加错误提示
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          创建新会议记录
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="会议议题"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="会议时间"
              value={formData.meetingTime}
              onChange={(newValue) => {
                setFormData(prev => ({ ...prev, meetingTime: newValue }));
              }}
              slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
            />
          </LocalizationProvider>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>会议区域</InputLabel>
            <Select
              name="area"
              value={formData.area}
              onChange={handleChange}
              label="会议区域"
            >
              {AREAS.map(area => (
                <MenuItem key={area} value={area}>{area}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="区县参会人员"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            涉及专业及确认人
          </Typography>
          <FormGroup>
            {SPECIALTIES.map(specialty => (
              <Box key={specialty} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.specialties.includes(specialty)}
                      onChange={handleSpecialtyChange}
                      name={specialty}
                    />
                  }
                  label={specialty}
                />
                {formData.specialties.includes(specialty) && (
                  <TextField
                    label={`${specialty}确认人`}
                    value={formData.specialists[specialty] || ''}
                    onChange={(e) => handleSpecialistChange(specialty, e.target.value)}
                    sx={{ ml: 4, width: 'calc(100% - 32px)' }}
                    required
                  />
                )}
              </Box>
            ))}
          </FormGroup>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            fullWidth
          >
            创建会议事项
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 