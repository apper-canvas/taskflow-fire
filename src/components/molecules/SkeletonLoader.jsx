import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  const skeletonVariants = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
  };

  if (type === 'task') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="animate-pulse"
          >
            <div className="flex items-center gap-3 p-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-6 ml-auto"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;