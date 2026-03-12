
import React from 'react';

const BathIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 6l2 2" />
    <path d="M12 11h.01" />
    <path d="M15 6l-2 2" />
    <path d="M22 12h-1a8.95 8.95 0 00-7-8.95V2" />
    <path d="M2 12h1a8.95 8.95 0 017-8.95V2" />
    <path d="M12 12v10" />
    <path d="M2 16h20" />
  </svg>
);

export default BathIcon;
