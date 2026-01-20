import { forwardRef } from 'react';
import { Navigate } from 'react-router-dom';

const Index = forwardRef<HTMLDivElement>((_, _ref) => {
  // Navigate doesn't accept refs, so we just return it directly
  return <Navigate to="/login" replace />;
});

Index.displayName = 'Index';

export default Index;
