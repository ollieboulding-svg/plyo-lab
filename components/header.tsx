"use client";

import { Zap, LayoutDashboard, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeTab: "dashboard" | "assessment";
  onTabChange: (tab: "dashboard" | "assessment") => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground leading-none">
              Plyo Lab
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Performance Testing
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-muted/50 p-1" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "dashboard"}
            onClick={() => onTabChange("dashboard")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "dashboard"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "assessment"}
            onClick={() => onTabChange("assessment")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "assessment"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Assessment</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
