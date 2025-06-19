import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  categories = [], 
  onFilterChange, 
  activeFilters = {},
  taskCounts = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters };
    
    if (newFilters[filterType] === value) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <ApperIcon name="Filter" size={16} className="mr-2" />
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="space-y-4">
          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Priority</h4>
            <div className="flex gap-2">
              {['high', 'medium', 'low'].map(priority => (
                <button
                  key={priority}
                  onClick={() => handleFilterChange('priority', priority)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeFilters.priority === priority
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.Id}
                  onClick={() => handleFilterChange('categoryId', category.Id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center ${
                    activeFilters.categoryId === category.Id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: activeFilters.categoryId === category.Id 
                      ? category.color 
                      : undefined
                  }}
                >
                  <ApperIcon name={category.icon} size={12} className="mr-1" />
                  {category.name}
                  {taskCounts[category.Id] !== undefined && (
                    <span className="ml-1 text-xs opacity-75">
                      ({taskCounts[category.Id]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Status</h4>
            <div className="flex gap-2">
              {[
                { value: 'incomplete', label: 'Incomplete' },
                { value: 'completed', label: 'Completed' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => handleFilterChange('status', status.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeFilters.status === status.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterType, value]) => {
              let displayValue = value;
              if (filterType === 'categoryId') {
                const category = categories.find(c => c.Id === value);
                displayValue = category?.name || value;
              }
              
              return (
                <Badge
                  key={`${filterType}-${value}`}
                  variant="primary"
                  size="xs"
                  className="cursor-pointer"
                  onClick={() => handleFilterChange(filterType, value)}
                >
                  {displayValue}
                  <ApperIcon name="X" size={12} className="ml-1" />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;