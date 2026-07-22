"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Sunrise, Sunset, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export interface GreetingHeaderProps {
  userName?: string;
  vaultName?: string;
  onOpenWalkthrough?: () => void;
  onCustomizeLayout?: () => void;
}

export function GreetingHeader({
  userName = "Maithili",
  vaultName = "My Life Vault",
  onOpenWalkthrough,
  onCustomizeLayout,
}: GreetingHeaderProps) {
  const [greeting, setGreeting] = useState("Good Day");
  const [timeIcon, setTimeIcon] = useState<React.ReactNode>(<Sun className="h-5 w-5 text-amber-400" />);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
      setTimeIcon(<Sunrise className="h-5 w-5 text-amber-400" />);
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
      setTimeIcon(<Sun className="h-5 w-5 text-amber-400" />);
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good Evening");
      setTimeIcon(<Sunset className="h-5 w-5 text-indigo-400" />);
    } else {
      setGreeting("Good Night");
      setTimeIcon(<Moon className="h-5 w-5 text-purple-400" />);
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", dateOptions));
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl mb-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {timeIcon}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{currentDate}</span>
          <Badge variant="emerald" className="gap-1 ml-2">
            <ShieldCheck className="h-3 w-3" /> {vaultName} Active
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          {greeting}, {userName} <span className="inline-block animate-pulse">✨</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Your personal intelligence hub has 3 AI suggestions and 2 recent updates ready for review.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onOpenWalkthrough && (
          <Button variant="outline" size="sm" onClick={onOpenWalkthrough} leftIcon={<HelpCircle className="h-3.5 w-3.5" />}>
            Guide
          </Button>
        )}
        {onCustomizeLayout && (
          <Button variant="secondary" size="sm" onClick={onCustomizeLayout} leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
            Customize Layout
          </Button>
        )}
      </div>
    </div>
  );
}
