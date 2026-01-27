import React from 'react';
import { RouteObject } from 'react-router-dom';
import './styles.css';

const CalendarPage = React.lazy(() =>
  import('./pages/CalendarPage').then((module) => ({ default: module.CalendarPage })),
);
const TaskListPage = React.lazy(() =>
  import('./pages/TaskListPage').then((module) => ({ default: module.TaskListPage })),
);
const TaskFormPage = React.lazy(() =>
  import('./pages/TaskFormPage').then((module) => ({ default: module.TaskFormPage })),
);
const TaskDetailPage = React.lazy(() =>
  import('./pages/TaskDetailPage').then((module) => ({ default: module.TaskDetailPage })),
);
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
