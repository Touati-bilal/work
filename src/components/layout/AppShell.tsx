import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <Sidebar />
      <div className="md:pl-64 flex min-h-full flex-col">
        <Header />
        <main className="flex-1 px-4 md:px-8 py-4 md:py-6 pb-[calc(72px+var(--safe-bottom))] md:pb-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
