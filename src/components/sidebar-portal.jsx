"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SidebarPortal({ children }) {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const el = document.getElementById("screenshoots-sidebar-slot");
    setTarget(el || null);
  }, []);

  if (!target) return null;
  return createPortal(children, target);
}
