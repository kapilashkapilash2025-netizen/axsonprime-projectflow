import {
  Bug,
  ClipboardCheck,
  FileBarChart,
  LayoutDashboard,
  ListChecks,
  Rocket,
  Settings as SettingsIcon,
  FolderKanban,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";

const ICON_CLASS = "h-4 w-4";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: <FolderKanban className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: <ListChecks className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/issues",
    label: "Issues",
    icon: <Bug className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/quality",
    label: "Quality",
    icon: <ClipboardCheck className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/releases",
    label: "Releases",
    icon: <Rocket className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: <FileBarChart className={ICON_CLASS} aria-hidden="true" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <SettingsIcon className={ICON_CLASS} aria-hidden="true" />,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
      >
        Skip to main content
      </a>
      <aside className="no-print border-b border-border bg-surface lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:flex-col lg:items-start lg:gap-6">
          <div>
            <p className="text-base font-semibold tracking-tight">
              ProjectFlow
            </p>
            <p className="text-xs text-muted-foreground">by AXSONprime</p>
          </div>
          <ThemeToggle />
        </div>
        <nav
          aria-label="Main navigation"
          className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible lg:px-3"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="app-header no-print sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur px-4 py-3 lg:hidden">
          <p className="text-sm font-semibold">ProjectFlow</p>
        </header>
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="no-print border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          Built by AXSONprime
        </footer>
      </div>
    </div>
  );
}
