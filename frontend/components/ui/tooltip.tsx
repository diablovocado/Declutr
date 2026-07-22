"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export function Tooltip({ content, children, side = "top", align = "center" }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          className={cn(
            "z-50 overflow-hidden rounded-md bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 shadow-md animate-in fade-in-0 zoom-in-95 font-medium"
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-slate-900" />
        </TooltipPrimitive.Content>
      </TooltipRoot>
    </TooltipProvider>
  );
}
