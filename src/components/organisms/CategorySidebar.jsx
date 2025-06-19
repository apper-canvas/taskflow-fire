import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { categoryService, taskService } from '@/services';

const CategorySidebar = () => {
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);

      setCategories(categoriesData);

      // Calculate task counts per category
      const counts = {};
      tasksData.forEach(task => {
        if (!task.completed) {
          counts[task.categoryId] = (counts[task.categoryId] || 0) + 1;
        }
      });
      setTaskCounts(counts);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <SkeletonLoader count={3} type="category" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <p className="text-sm text-error">Failed to load categories</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Categories</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <ApperIcon name="Plus" size={16} />
        </button>
      </div>

      <div className="space-y-1">
        {categories.map((category) => (
          <motion.div
            key={category.Id}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <ApperIcon name={category.icon} size={14} className="text-gray-500" />
              <span className="text-sm text-gray-700">{category.name}</span>
            </div>
            
            {taskCounts[category.Id] > 0 && (
              <Badge variant="default" size="xs">
                {taskCounts[category.Id]}
              </Badge>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;