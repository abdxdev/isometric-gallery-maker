"use client";

export function ControlSidebar({ children }) {
  return (
    <div className="w-full lg:w-86 flex flex-col p-4 lg:border-l border-border h-auto md:h-full min-h-0 overflow-visible md:overflow-y-auto overscroll-contain" data-slot="control-sidebar">
      {children}
    </div>
  );
}
