import React from 'react';

function SkeletonLoader({ width, height }) {
  return <div className="skeleton-loader" style={{ width: width || '100%', height: height || '20px', backgroundColor: '#e0e0e0', marginBottom: '8px' }} />;
}

export default SkeletonLoader;
