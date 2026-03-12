
import React from 'react';

const BedIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M2 4v16" />
    <path d="M2 12h10" />
    <path d="M12 4v16" />
    <path d="M20 4v16" />
    <path d="M12 12h8" />
    <path d="M16 4h-4" />
    <path d="M16 20h-4" />
  </svg>
);

export default BedIcon;
