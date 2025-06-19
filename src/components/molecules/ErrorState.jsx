import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-4">
        <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">Oops!</h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onRetry} icon="RefreshCw">
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;