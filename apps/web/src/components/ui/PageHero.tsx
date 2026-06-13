import React, { ReactNode } from 'react';

export interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function PageHero({ title, description, badge, rightContent, className = "", imageSrc, imageAlt }: PageHeroProps) {
  return (
    <div className={`mb-8 flex flex-col md:flex-row items-stretch border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden shrink-0 ${className}`}>
      
      {/* Text Content */}
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase flex flex-wrap items-center gap-3 mb-4 tracking-tight text-black">
          {title}
          {badge && (
            <span className="bg-[#FFEDF4] text-black text-sm md:text-base px-2 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-normal shrink-0">
              {badge}
            </span>
          )}
        </h1>
        {description && (
          <p className="text-lg md:text-xl font-bold text-gray-900 bg-[#D8B4E2] inline-block px-4 py-2 border-4 border-black w-fit mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {description}
          </p>
        )}
        
        {rightContent && (
          <div className="flex flex-wrap gap-4 mt-auto pt-4">
            {rightContent}
          </div>
        )}
      </div>

      {/* Hero Image Banner */}
      {imageSrc && (
        <div className="w-full md:w-1/3 lg:w-[40%] h-64 md:h-auto min-h-[250px] border-t-4 md:border-t-0 md:border-l-4 border-black shrink-0 relative bg-[#FAFAFA]">
          <img src={imageSrc} alt={imageAlt || "Hero Banner"} className="w-full h-full object-cover object-center absolute inset-0" />
        </div>
      )}
      
    </div>
  );
}
