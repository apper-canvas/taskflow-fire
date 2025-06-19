import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <motion.label
          htmlFor={checkboxId}
          className={`w-5 h-5 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 ${
            checked 
              ? 'bg-primary border-primary' 
              : 'bg-white border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: checked ? 1 : 0, 
              opacity: checked ? 1 : 0 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <ApperIcon name="Check" size={12} className="text-white" />
          </motion.div>
        </motion.label>
      </div>
      {label && (
        <label 
          htmlFor={checkboxId}
          className={`ml-2 text-sm cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;