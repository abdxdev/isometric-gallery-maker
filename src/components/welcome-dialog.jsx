"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Generic reusable welcome dialog
// Props:
// storageKey: unique localStorage key to remember dismissal
// title: heading text
// description: main description (string or JSX)
// primaryAction: { label, onClick, icon? }
// secondaryAction: { label, onClick? } (defaults to just closing)
// autoOpen: bool (default true) – whether to auto show if not seen
export function WelcomeDialog({
  storageKey = "app-welcome-dialog",
  title = "Welcome",
  description = "",
  primaryAction,
  secondaryAction,
  autoOpen = true,
  onOpenChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    try {
      const hasSeen = localStorage.getItem(storageKey);
      if (!hasSeen) setIsOpen(true);
    } catch {}
  }, [autoOpen, storageKey]);

  const closeAndPersist = () => {
    try { localStorage.setItem(storageKey, "true"); } catch {}
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handlePrimary = () => {
    if (primaryAction?.onClick) primaryAction.onClick();
    closeAndPersist();
  };
  const handleSecondary = () => {
    if (secondaryAction?.onClick) secondaryAction.onClick();
    closeAndPersist();
  };

  if (!autoOpen && !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) closeAndPersist(); }}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="space-y-3 text-sm leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row">
          {secondaryAction && (
            <Button variant="outline" onClick={handleSecondary} className="w-full sm:w-auto">
              {secondaryAction.label || "Close"}
            </Button>
          )}
          {primaryAction && (
            <Button onClick={handlePrimary} className="w-full sm:w-auto">
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
          )}
          {!primaryAction && !secondaryAction && (
            <Button onClick={closeAndPersist} className="w-full sm:w-auto">Get Started</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
