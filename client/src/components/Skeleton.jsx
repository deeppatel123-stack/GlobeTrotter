import React from 'react';

export const Skeleton = ({ height = '20px', width = '100%', borderRadius = '8px', className = '' }) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{ height, width, borderRadius }}
    >
      <style>{`
        .skeleton-box {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonLoading 1.5s infinite;
        }
        @keyframes skeletonLoading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <Skeleton height="180px" borderRadius="12px" />
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton height="24px" width="70%" />
        <Skeleton height="16px" width="40%" />
        <Skeleton height="16px" width="90%" />
      </div>
    </div>
  );
};

export default Skeleton;
