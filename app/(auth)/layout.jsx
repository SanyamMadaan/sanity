import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div>
      <div className="flex border h-[90vh] -mt-8 w-[98%] mx-auto rounded-2xl border-zinc-200/20 ">
        <div className="w-1/2 relative p-2 flex items-center justify-center max-md:hidden">
          <div className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 pb-2 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Welcome to Sanity
          </div>
        </div>
        <div className="w-1/2 max-md:w-full relative p-2 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
