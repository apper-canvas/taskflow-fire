import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/molecules/TaskItem';
import TaskDetailModal from '@/components/molecules/TaskDetailModal';
import EmptyState from '@/components/molecules/EmptyState';

const TaskList = ({ 
  tasks = [], 
  categories = [], 
  onTaskUpdate, 
  onTaskDelete,
  emptyStateProps = {}
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
visible: { opacity: 1, y: 0 }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask) => {
    onTaskUpdate(updatedTask);
    setSelectedTask(updatedTask);
  };

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyStateProps.title || "No tasks yet"}
        description={emptyStateProps.description || "Create your first task to get started"}
        icon={emptyStateProps.icon || "CheckSquare"}
        actionLabel={emptyStateProps.actionLabel}
        onAction={emptyStateProps.onAction}
      />
    );
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          >
<TaskItem
              task={task}
              categories={categories}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              onTaskClick={handleTaskClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleTaskUpdate}
        categories={categories}
      />
    </motion.div>
  );
};

export default TaskList;