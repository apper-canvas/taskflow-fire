import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import QuickAddForm from '@/components/molecules/QuickAddForm';
import { taskService, categoryService } from '@/services';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleQuickAdd = async (taskData) => {
    try {
      await taskService.create(taskData);
      setShowQuickAdd(false);
      toast.success('Task created successfully!');
      // Note: In a real app, we'd trigger a refresh of the task list here
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex-shrink-0 z-40">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-primary hidden sm:block">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <Input
            placeholder="Search tasks..."
            icon="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <ApperIcon name="Search" size={20} />
          </button>

          {/* Quick Add Button */}
          <Button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            icon="Plus"
            className={showQuickAdd ? 'bg-secondary' : ''}
          >
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Quick Add Form */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 z-50 p-4 bg-gray-50 border-b border-gray-200"
          >
            <div className="max-w-2xl mx-auto">
              <QuickAddForm
                onSubmit={handleQuickAdd}
                onCancel={() => setShowQuickAdd(false)}
                categories={categories}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;