"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, Sparkles } from "lucide-react";

export function WelcomeDialog({ onLoadSamples, onCancel }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome dialog before
    const hasSeenWelcome = localStorage.getItem("isometric-gallery-welcome-seen");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleLoadSamples = () => {
    localStorage.setItem("isometric-gallery-welcome-seen", "true");
    setIsOpen(false);
    onLoadSamples();
  };

  const handleCancel = () => {
    localStorage.setItem("isometric-gallery-welcome-seen", "true");
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">Welcome to Screenshoots!</DialogTitle>
          </div>
          <DialogDescription className=" space-y-3">
            <p className="text-base">
              Create stunning 3D isometric gallery mockups from your images with an easy-to-use interface.
              <br />
            </p>
            <p className="text-sm text-muted-foreground">Would you like to start with some sample images to see what's possible?</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Start Empty
          </Button>
          <Button onClick={handleLoadSamples} className="w-full sm:w-auto">
            <ImageIcon className="w-4 h-4" />
            Load Sample Images
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
