"use client";
import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "nav",
  ...props
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("sticky top-0 z-50 w-full", containerClassName)}
      {...props}
    >
      <div
        className={cn(
          "relative bg-background/80 backdrop-blur-md rounded-[inherit] border transition-colors duration-300",
          {
            "border-neutral-700": !hovered,
            "border-slate-700": hovered,
          },
          className,
        )}
      >
        {children}
        <div className="absolute inset-[1px] rounded-[inherit] bg-background/80 backdrop-blur-md" />
      </div>
    </Tag>
  );
}
