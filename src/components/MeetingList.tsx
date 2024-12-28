const formatDate = (dateString: string) => {
  try {
    // 确保输入的日期字符串是有效的
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '无效日期';
    }
    // 使用 toLocaleString 格式化日期，指定具体的格式选项
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '无效日期';
  }
};

// 在渲染部分使用
会议时间：{formatDate(task.meetingTime)} 