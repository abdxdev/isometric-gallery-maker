"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { GitHubIcon } from "@/components/svg/github";
import { AbdIcon } from "@/components/svg/abd";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6 max-w-none">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold">Mockup Maker</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/your-username/your-repo-name" target="_blank" rel="noopener noreferrer" title="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
              <GitHubIcon className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://your-portfolio-url.com" target="_blank" rel="noopener noreferrer" title="Portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
              <AbdIcon className="h-4 w-4" />
            </a>
          </Button>
          <div className="h-6 w-px bg-border" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
