"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { AbdIcon } from "@/components/svg/abd";
import { GitHubStarCounter } from "@/components/github-star-counter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6 max-w-none gap-6">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold sm:text-lg">Isometric Gallery Maker</h1>
          <p className="text-xs sm:text-sm border px-1.5 bg-accent">BETA</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Desktop: Show both GitHub star counter and More tools button */}
          <GitHubStarCounter repo="abdxdev/isometric-gallery-maker" className="hidden sm:flex" />
          <Button variant="outline" size="sm" asChild className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-xs">
            <a href="https://abd-dev.studio?ref=isometric-gallery-maker" target="_blank" rel="noopener noreferrer" title="Portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
              <AbdIcon className="h-3 w-3" />
              <span className="font-medium">More tools</span>
            </a>
          </Button>
          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Mobile: Show 3 dots dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <GitHubStarCounter repo="abdxdev/isometric-gallery-maker" className="w-full justify-center" varient="ghost" />
              </div>
              <DropdownMenuItem asChild>
                <a href="https://abd-dev.studio?ref=isometric-gallery-maker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <AbdIcon className="h-3 w-3" />
                  <span>More tools</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
