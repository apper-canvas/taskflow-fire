import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(task => task.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(400);
    const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      completed: false,
      categoryId: taskData.categoryId || 1,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      order: this.tasks.length
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tasks.findIndex(task => task.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...updates,
      Id: this.tasks[index].Id // Prevent Id modification
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(250);
    const index = this.tasks.findIndex(task => task.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async getByCategory(categoryId) {
    await delay(200);
    return this.tasks.filter(task => task.categoryId === parseInt(categoryId, 10));
  }

  async getToday() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(today)
    );
  }

  async getUpcoming() {
    await delay(200);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= tomorrow;
    });
  }

  async getCompleted() {
    await delay(200);
    return this.tasks.filter(task => task.completed);
  }

  async toggleComplete(id) {
    await delay(200);
    const task = this.tasks.find(task => task.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.completed = !task.completed;
    return { ...task };
  }

  async reorder(taskIds) {
    await delay(300);
    taskIds.forEach((id, index) => {
      const task = this.tasks.find(t => t.Id === parseInt(id, 10));
      if (task) {
        task.order = index;
      }
    });
    return [...this.tasks];
  }
}

export default new TaskService();