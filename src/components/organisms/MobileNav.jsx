import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const MobileNav = () => {
  return (
    <nav className="lg:hidden bg-white border-t border-gray-200 flex-shrink-0 z-40">
      <div className="flex">
        {Object.values(routes).map((route) => (
          <NavLink
            key={route.id}
            to={route.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <ApperIcon name={route.icon} size={20} className="mb-1" />
            <span className="truncate">{route.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;