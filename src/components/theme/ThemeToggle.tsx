"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: MonitorSmartphone, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-2 p-0.5">
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = (theme ?? "system") === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            onClick={() => setTheme(value)}
            suppressHydrationWarning
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-brand text-brand-foreground"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Icon size={16} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
