import { LayoutDashboard, ClipboardList, FolderKanban, FileBarChart2, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager", label: "Manager", icon: ClipboardList },
  { href: "/work", label: "Work", icon: FolderKanban },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
