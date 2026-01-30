import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * LeadsPage - Redirects to Lead & Risk Home page
 * This is a compatibility redirect for the /leads route
 */
export default function LeadsPage() {
  return <Navigate to="/lead-risk/home" replace />;
}
