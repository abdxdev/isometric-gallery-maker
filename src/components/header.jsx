"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { AbdIcon } from "@/components/svg/abd";
import { GitHubStarCounter } from "@/components/github-star-counter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6 max-w-none">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold">Isometric Gallery Maker</h1>
        </div>
        <div className="flex items-center space-x-2">
          <GitHubStarCounter repo="abdxdev/isometric-gallery-maker" />
          <Button variant="outline" size="sm" asChild className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-xs">
            <a href="https://abd-dev.studio?ref=isometric-gallery-maker" target="_blank" rel="noopener noreferrer" title="Portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
              <AbdIcon className="h-3 w-3" />
              <span className="font-medium">More tools</span>
            </a>
          </Button>
          <div className="h-6 w-px bg-border" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
