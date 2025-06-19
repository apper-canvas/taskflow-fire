import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';
import Header from '@/components/organisms/Header';
import MobileNav from '@/components/organisms/MobileNav';
import CategorySidebar from '@/components/organisms/CategorySidebar';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    closed: { x: -300, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <Header 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              {Object.values(routes).map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} className="mr-3" />
                  {route.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Category Sidebar */}
          <CategorySidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={sidebarVariants.closed}
                animate={sidebarVariants.open}
                exit={sidebarVariants.closed}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col"
              >
                {/* Mobile Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                  <h1 className="text-xl font-heading font-bold text-primary">TaskFlow</h1>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    {Object.values(routes).map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} className="mr-3" />
                        {route.label}
                      </NavLink>
                    ))}
                  </div>
                </nav>

                {/* Mobile Category Sidebar */}
                <CategorySidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;