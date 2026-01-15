import React from 'react';

interface PageDescriptionProps {
  description: string;
}

const PageDescription: React.FC<PageDescriptionProps> = ({ description }) => {
  return (
    <div className="page-description">
      <div className="page-description-line" />
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default PageDescription;
