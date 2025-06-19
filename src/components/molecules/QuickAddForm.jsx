import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const QuickAddForm = ({ onSubmit, onCancel, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: categories[0]?.Id || 1,
    priority: 'medium',
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      });
      setFormData({
        title: '',
        categoryId: categories[0]?.Id || 1,
        priority: 'medium',
        dueDate: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-4 shadow-lg border border-gray-200"
    >
      <div className="space-y-4">
        {/* Title Input */}
        <Input
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          autoFocus
          className="text-base"
        />

        {/* Quick Options */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category Select */}
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', parseInt(e.target.value, 10))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Priority Select */}
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Due Date Input */}
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={!formData.title.trim() || isSubmitting}
            loading={isSubmitting}
            size="sm"
            icon="Plus"
          >
            Add Task
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            icon="X"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default QuickAddForm;