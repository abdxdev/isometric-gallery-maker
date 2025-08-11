"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { AbdIcon } from "@/components/svg/abd";
import { ScreenshootsIcon } from "@/components/svg/screenshoots";
import { GitHubStarCounter } from "@/components/github-star-counter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [showFsButton, setShowFsButton] = useState(false);

  useEffect(() => {
    // Show the toggle button only when a Screenshoots layout root exists in DOM
    const check = () => setShowFsButton(!!document.querySelector('[data-slot="screenshoots-layout-root"]'));
    check();

    const obs = new MutationObserver(check);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  const dispatchToggle = () => {
    window.dispatchEvent(new CustomEvent("screenshoots:toggle-fullscreen"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-3 md:px-6 max-w-none gap-4">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <ScreenshootsIcon className="h-6 w-6" />
            <h1 className="text-sm font-semibold ">Screenshoots</h1>
          </a>
          <p className="text-xs border px-1 bg-accent">BETA</p>
        </div>
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-4">
            <a href="/isometric-gallery" className="text-xs text-foreground hover:underline transition-colors">
              <span className="font-medium">Isometric Gallery</span>
            </a>
            <a href="/screen-decorator" className="text-xs text-foreground hover:underline transition-colors">
              <span className="font-medium">Screen Decorator</span>
            </a>
          </div>
          <div className="flex items-center space-x-2">
            {/* Desktop: Show both GitHub star counter and More tools button */}
            <GitHubStarCounter repo="abdxdev/screenshoots" className="hidden md:flex" />
            <Button variant="outline" size="sm" asChild className="hidden md:flex items-center gap-1.5 h-8 px-3 text-xs">
              <a href="https://abd-dev.studio?ref=screenshoots" target="_blank" rel="noopener noreferrer" title="Portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                <AbdIcon className="h-3 w-3" />
                <span className="font-medium">More tools</span>
              </a>
            </Button>
            <div className="h-6 w-px bg-border hidden md:block" />

            {/* Mobile: Show 3 dots dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Add main links for mobile */}
                <DropdownMenuItem asChild>
                  <a href="/isometric-gallery">Isometric Gallery</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/screen-decorator">Screen Decorator</a>
                </DropdownMenuItem>
                <div className="border-t my-1" />
                <div className="p-2">
                  <GitHubStarCounter repo="abdxdev/screenshoots" className="w-full justify-center" varient="ghost" />
                </div>
                <DropdownMenuItem asChild>
                  <a href="https://abd-dev.studio?ref=screenshoots" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <AbdIcon className="h-3 w-3" />
                    <span>More tools</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {showFsButton && (
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={dispatchToggle} title="Toggle fullscreen">
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
