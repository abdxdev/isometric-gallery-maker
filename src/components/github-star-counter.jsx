"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/svg/github";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function GitHubStarCounter({ repo = "abdxdev/isometric-gallery-maker", className, variant }) {
  const [starCount, setStarCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          // Add cache headers to avoid rate limiting
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch star count:", error);
        // Fallback to null if API fails
        setStarCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStarCount();
  }, [repo]);

  const formatStarCount = (count) => {
    if (count === null) return "";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Button variant={variant || "outline"} size="sm" asChild className={cn("flex items-center gap-1 sm:gap-1.5 h-6 sm:h-8 px-2 sm:px-3 text-xs", className)}>
      <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
        <GitHubIcon className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
        <Star className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-current" />
        {loading ? <span className="w-4 sm:w-6 text-center">...</span> : <span className="font-medium">{starCount !== null ? formatStarCount(starCount) : "Star"}</span>}
      </a>
    </Button>
  );
}
