import AllTasks from '@/components/pages/AllTasks';
import Today from '@/components/pages/Today';
import Upcoming from '@/components/pages/Upcoming';
import Archive from '@/components/pages/Archive';

export const routes = {
  allTasks: {
    id: 'allTasks',
    label: 'All Tasks',
    path: '/',
    icon: 'List',
    component: AllTasks
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
    component: Upcoming
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
};

export const routeArray = Object.values(routes);
export default routes;