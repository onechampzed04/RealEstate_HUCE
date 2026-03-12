
import React from 'react';

const AreaIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M21 3H3v18h18V3z" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
  </svg>
);

export default AreaIcon;
