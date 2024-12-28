import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import NewTask from './components/NewTask';
import TaskList from './components/TaskList';
import TaskConfirmation from './components/TaskConfirmation';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            事项列表
          </Button>
          <Button color="inherit" component={Link} to="/new">
            新建事项
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/new" element={<NewTask />} />
          <Route path="/confirm/:taskId" element={<TaskConfirmation />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 