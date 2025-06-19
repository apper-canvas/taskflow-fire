import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/molecules/TaskItem';
import EmptyState from '@/components/molecules/EmptyState';

const TaskList = ({ 
  tasks = [], 
  categories = [], 
  onTaskUpdate, 
  onTaskDelete,
  emptyStateProps = {}
}) => {
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
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;