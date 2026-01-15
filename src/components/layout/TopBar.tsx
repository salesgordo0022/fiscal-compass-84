import React from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  return (
    <div className="topbar">
      <div className="container mx-auto">
        {subtitle && (
          <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mb-1">
            {subtitle}
          </p>
        )}
        <h1 className="text-xl font-bold tracking-wide uppercase">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default TopBar;
