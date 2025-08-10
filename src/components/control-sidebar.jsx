"use client";

export function ControlSidebar({ children }) {
  return (
    <div className="w-full lg:w-86 flex flex-col p-4 lg:border-l border-border h-full">
      {children}
    </div>
  );
}
