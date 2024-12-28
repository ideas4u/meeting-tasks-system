// 生成唯一ID的辅助函数
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// 从 localStorage 获取数据的辅助函数
const getStoredTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

// 将数据保存到 localStorage 的辅助函数
const storeTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const taskService = {
  // 创建新会议任务
  createTask: (taskData) => {
    const tasks = getStoredTasks();
    const newTask = {
      id: generateId(),
      ...taskData,
      status: 'pending', // pending, confirmed
      specialtyConfirmations: taskData.specialties.map(specialty => ({
        specialty,
        specialist: taskData.specialists[specialty],
        status: 'pending', // pending, confirmed
        opinion: null,
        confirmedAt: null
      })),
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    storeTasks(tasks);
    return newTask;
  },

  // 获取所有会议任务
  getAllTasks: () => {
    return getStoredTasks();
  },

  // 获取单个会议任务
  getTaskById: (taskId) => {
    const tasks = getStoredTasks();
    return tasks.find(task => task.id === taskId);
  },

  // 提交专业确认意见
  submitConfirmation: (taskId, specialty, confirmerName, opinion) => {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;

    const task = tasks[taskIndex];
    const confirmationIndex = task.specialtyConfirmations.findIndex(
      conf => conf.specialty === specialty
    );

    if (confirmationIndex === -1) return null;

    task.specialtyConfirmations[confirmationIndex] = {
      ...task.specialtyConfirmations[confirmationIndex],
      status: 'confirmed',
      specialist: confirmerName,
      opinion,
      confirmedAt: new Date().toISOString()
    };

    // 检查是否所有专业都已确认
    const allConfirmed = task.specialtyConfirmations.every(
      conf => conf.status === 'confirmed'
    );
    if (allConfirmed) {
      task.status = 'confirmed';
    }

    tasks[taskIndex] = task;
    storeTasks(tasks);
    return task;
  }
}; 