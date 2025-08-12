"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/**
 * Generic grouped sidebar controls component.
 *
 * Group object supports either `content` (ReactNode) OR `items` array.
 * items: Array<{
 *  key?: string;
 *  label?: string;            // optional label text
 *  labelFor?: string;         // htmlFor value
 *  node?: React.ReactNode;    // control node (rendered after label)
 *  control?: React.ReactNode; // alias for node when using standardized API
 *  note?: React.ReactNode;    // note
 *  showReset?: boolean;       // show per-item reset button
 *  resetKey?: string;         // key passed to group.onItemReset
 *  onReset?: () => void;      // custom reset handler
 *  when?: boolean;            // conditional render (false hides)
 * }>
 * Provide group.stackClass to override outer stack (default space-y-4) when using items.
 */
export function GroupedSidebarControls({ groups = [], type = "multiple", className, defaultOpenIds }) {
  const defaultValue = defaultOpenIds || groups.filter((g) => g.defaultOpen !== false).map((g) => g.id);
  return (
    <Accordion type={type} defaultValue={defaultValue} className={clsx("w-full space-y-2", className)}>
      {groups.map((group) => {
        const hasItems = Array.isArray(group.items);
        return (
          <AccordionItem key={group.id} value={group.id}>
            <AccordionTrigger className="text-md flex items-center justify-between gap-2">
              <span className="flex-1 text-left">{group.title}</span>
              {group.allowReset && group.onResetGroup && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 ml-2"
                  title={`Reset ${group.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    group.onResetGroup();
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </AccordionTrigger>
            <AccordionContent>
              {hasItems ? (
                <div className={group.stackClass || "space-y-4"}>
                  {group.items.map((it, idx) => {
                    if (it.when === false) return null;
                    const showReset = !!it.showReset;
                    const handleReset = () => {
                      if (typeof it.onReset === "function") it.onReset();
                      else if (it.resetKey && typeof group.onItemReset === "function") group.onItemReset(it.resetKey);
                    };
                    const baseControl = it.control || it.node; // allow either prop
                    const controlRow = showReset ? (
                      <div className={clsx("flex gap-2 items-center", it.inlineFull && "w-full")}>
                        <div className={clsx("flex-1 min-w-0", it.controlWrapperClass)}>{baseControl}</div>
                        <Button onClick={handleReset} variant="outline" size="icon" className="flex-shrink-0" title={it.resetTitle || `Reset ${it.label || ""}`.trim() || "Reset"}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      baseControl
                    );

                    // Tooltip logic for notes
                    const hasNote = !!it.note;
                    const labelEl = it.label ? (
                      hasNote ? (
                        <div className="flex items-center gap-1">
                          <Label htmlFor={it.labelFor}>{it.label}</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="inline-flex items-center justify-center w-4 h-4 rounded border text-[10px] leading-none text-muted-foreground hover:text-foreground" aria-label="Info">
                                ?
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">{it.note}</TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <Label htmlFor={it.labelFor}>{it.label}</Label>
                      )
                    ) : null;

                    const renderedControl = !it.label && hasNote ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>{controlRow}</div>
                        </TooltipTrigger>
                        <TooltipContent side="top">{it.note}</TooltipContent>
                      </Tooltip>
                    ) : (
                      controlRow
                    );

                    return (
                      <div key={it.key || idx} className="grouped-control-item space-y-2">
                        {labelEl}
                        <div className="space-y-1">{renderedControl}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                group.content
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
