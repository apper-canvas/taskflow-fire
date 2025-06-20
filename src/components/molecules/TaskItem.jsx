import { motion } from 'framer-motion';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Checkbox from '@/components/atoms/Checkbox';
import { taskService, categoryService } from '@/services';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const TaskItem = ({ task, onUpdate, onDelete, onTaskClick, categories = [] }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [taskCategory, setTaskCategory] = useState(null);

  useEffect(() => {
    const category = categories.find(cat => cat.Id === task.categoryId);
    setTaskCategory(category);
  }, [task.categoryId, categories]);

  const handleToggleComplete = async (checked) => {
    setIsCompleting(true);
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      onUpdate(updatedTask);
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.delete(task.Id);
      onDelete(task.Id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    if (isPast(dueDate) && !isToday(dueDate)) {
      return {
        text: `Overdue (${format(dueDate, 'MMM d')})`,
        className: 'text-error bg-error/10'
      };
    }
    
    if (isToday(dueDate)) {
      return {
        text: `Today (${format(dueDate, 'h:mm a')})`,
        className: 'text-warning bg-warning/10'
      };
    }
    
    if (isThisWeek(dueDate)) {
      return {
        text: format(dueDate, 'EEE, MMM d'),
        className: 'text-info bg-info/10'
      };
    }
    
    return {
      text: format(dueDate, 'MMM d, yyyy'),
      className: 'text-gray-600 bg-gray-100'
    };
  };

const dueDateInfo = getDueDateInfo();

  const handleTaskClick = (e) => {
    // Prevent opening modal when clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
        task.completed ? 'opacity-60' : ''
      }`}
      onClick={handleTaskClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              
              {/* Task Meta */}
              <div className="flex items-center gap-2 mt-2">
                {/* Priority Badge */}
                <Badge variant={task.priority} size="xs">
                  {task.priority}
                </Badge>
                
                {/* Category Badge */}
                {taskCategory && (
                  <Badge 
                    variant="default" 
                    size="xs"
                    icon={taskCategory.icon}
                    className="text-gray-600"
                    style={{ backgroundColor: `${taskCategory.color}20`, color: taskCategory.color }}
                  >
                    {taskCategory.name}
                  </Badge>
                )}
                
                {/* Due Date */}
                {dueDateInfo && (
                  <span className={`text-xs px-2 py-1 rounded-full ${dueDateInfo.className}`}>
                    {dueDateInfo.text}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-error transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Ripple Effect */}
      {isCompleting && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-success rounded-lg pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        />
      )}
    </motion.div>
  );
};

export default TaskItem;