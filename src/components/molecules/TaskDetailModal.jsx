import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import { taskService } from '@/services';
import { toast } from 'react-toastify';

// Initialize markdown parser with attributes plugin for styling
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItAttrs);

const TaskDetailModal = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate, 
  categories = [] 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task || {});
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        description: task.description || '',
        notes: task.notes || ''
      });
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsEditing(false);
    setIsMarkdownPreview(true);
    onClose();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedTask = await taskService.update(task.Id, editedTask);
      onUpdate(updatedTask);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
    setIsMarkdownPreview(true);
  };

  const renderMarkdown = (content) => {
    if (!content) return '<p class="text-gray-500 italic">No description provided</p>';
    
    try {
      return md.render(content);
    } catch (error) {
      return `<p class="text-error">Error rendering markdown: ${error.message}</p>`;
    }
  };

  const taskCategory = categories.find(cat => cat.Id === task?.categoryId);

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ApperIcon name="FileText" size={20} className="text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Edit" size={16} />
                  Edit
                </Button>
              )}
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Task Title */}
            <div className="mb-6">
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  placeholder="Task title"
                  className="text-lg font-medium"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              )}
            </div>

            {/* Task Meta */}
            <div className="flex items-center gap-3 mb-6">
              <Badge variant={task.priority} size="sm">
                {task.priority}
              </Badge>
              
              {taskCategory && (
                <Badge 
                  variant="default" 
                  size="sm"
                  icon={taskCategory.icon}
                  style={{ backgroundColor: `${taskCategory.color}20`, color: taskCategory.color }}
                >
                  {taskCategory.name}
                </Badge>
              )}
              
              {task.dueDate && (
                <span className="text-sm text-gray-600">
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              )}
            </div>

            {/* Description/Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Description & Notes</h3>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        isMarkdownPreview 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'bg-primary text-white'
                      }`}
                    >
                      {isMarkdownPreview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  {isMarkdownPreview ? (
                    <div className="min-h-[200px] p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(editedTask.description)
                        }}
                      />
                    </div>
                  ) : (
                    <textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      placeholder="Write your task description using markdown...&#10;&#10;**Bold text**&#10;*Italic text*&#10;# Heading&#10;- List item&#10;[Link](https://example.com)"
                      className="w-full h-48 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                    />
                  )}
                  
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <ApperIcon name="Info" size={12} />
                    Supports markdown formatting: **bold**, *italic*, # headings, - lists, [links](url)
                  </div>
                </div>
              ) : (
                <div className="min-h-[100px] p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(task.description)
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={isSaving}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Save" size={16} />
                Save Changes
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;