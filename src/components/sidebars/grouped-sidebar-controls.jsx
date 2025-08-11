"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import clsx from "clsx";
import { Label } from "@/components/ui/label";

/**
 * Generic grouped sidebar controls component.
 *
 * Group object supports either `content` (ReactNode) OR `items` array.
 * items: Array<{
 *  key?: string;
 *  label?: string;            // optional label text
 *  labelFor?: string;         // htmlFor value
 *  node?: React.ReactNode;    // control node (rendered after label)
 *  description?: React.ReactNode; // small helper text under control
 *  wrapperClass?: string;     // default: space-y-2
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
                    const labelEl = it.label ? <Label htmlFor={it.labelFor}>{it.label}</Label> : null;
                    const baseControl = it.control || it.node; // allow either prop
                    const controlRow = showReset ? (
                      <div className={clsx("flex gap-2 items-center", it.inlineFull && "w-full")}>
                        <div className={clsx("flex-1 min-w-0", it.controlWrapperClass)}>{baseControl}</div>
                        <ResetButton onClick={handleReset} title={it.resetTitle || `Reset ${it.label || ""}`.trim()} />
                      </div>
                    ) : (
                      baseControl
                    );
                    return (
                      <div key={it.key || idx} className={clsx("grouped-control-item", it.wrapperClass || "space-y-2")}>
                        {labelEl}
                        {controlRow}
                        {it.description && <p className="text-xs text-muted-foreground">{it.description}</p>}
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

function ResetButton({ onClick, title }) {
  return (
    <Button onClick={onClick} variant="outline" size="icon" className="flex-shrink-0" title={title || "Reset"}>
      <RefreshCw className="w-4 h-4" />
    </Button>
  );
}
