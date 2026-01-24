import { RouteObject } from 'react-router-dom';
import { CalendarPage } from './pages/CalendarPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskFormPage } from './pages/TaskFormPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import './styles.css';
export const iTodolistRoute: RouteObject = {
  path: 'todolist',
  children: [
    {
      index: true,
      element: <CalendarPage />,
    },
    {
      path: 'list',
      element: <TaskListPage />,
    },
    {
      path: 'create',
      element: <TaskFormPage />,
    },
    {
      path: ':id',
      element: <TaskDetailPage />,
    },
  ],
};