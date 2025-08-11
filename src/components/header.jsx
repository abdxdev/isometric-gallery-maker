"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { AbdIcon } from "@/components/svg/abd";
import { GitHubStarCounter } from "@/components/github-star-counter";
import { GitHubIcon } from "@/components/svg/github";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Maximize2 } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header({ name, logo, isBeta, pages, githubRepo, portfolioUrl }) {
  const [showFsButton, setShowFsButton] = useState(false);
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    const check = () => setShowFsButton(!!document.querySelector('[data-slot="screenshoots-layout-root"]'));
    check();

    const obs = new MutationObserver(check);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  const dispatchToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-fullscreen"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-3 lg:px-6 max-w-none gap-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              {logo}
              <h1 className="text-md font-semibold">{name}</h1>
              {isBeta && <p className="text-xs border px-1 bg-accent">BETA</p>}
            </Link>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="hidden md:flex items-center gap-4">
            {pages.map((page) => (
              <Link key={page.href} href={page.href} aria-current={isActive(page.href) ? "page" : undefined} className={`text-xs lg:text-sm transition-colors ${!isActive(page.href) && "text-muted-foreground hover:text-foreground"}`}>
                <span className="font-medium">{page.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <GitHubStarCounter repo={githubRepo} className="hidden md:flex" />
          <Button variant="outline" size="sm" asChild className="hidden md:flex items-center gap-1.5 h-8 px-3 text-xs">
            <a href={`https://github.com/${githubRepo}/issues/new?title=Feedback&body=Please+share+your+feedback%3A%0A%0A-+What+you+liked%3A%0A-+What+can+be+improved%3A`} target="_blank" rel="noopener noreferrer" title="Give feedback" className="text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="h-3 w-3" />
              <span className="font-medium">Feedback</span>
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden md:flex items-center gap-1.5 h-8 px-3 text-xs">
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" title="Portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
              <AbdIcon className="h-3 w-3" />
              <span className="font-medium">More tools</span>
            </a>
          </Button>
          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {pages.map((page) => (
                <DropdownMenuItem key={page.href} asChild>
                  <Link href={page.href} aria-current={isActive(page.href) ? "page" : undefined} className={isActive(page.href) ? "font-semibold" : undefined}>
                    {page.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <div className="border-t my-1" />
              <DropdownMenuItem asChild>
                <a href={`https://github.com/${githubRepo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <GitHubIcon className="h-3 w-3" />
                  <span>{githubRepo}</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`https://github.com/${githubRepo}/issues/new?title=Feedback&body=Please+share+your+feedback%3A%0A%0A-+What+you+liked%3A%0A-+What+can+be+improved%3A`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  <span>Feedback</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
    </header>
  );
}
