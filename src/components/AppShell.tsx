import { Header } from "@/components/Header";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileMenu } from "@/components/MobileMenu";
import { MobileNav } from "@/components/MobileNav";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />

      <div className="min-h-screen md:ml-60">
        <Header />
        <MobileHeader />

        <main className="min-h-[calc(100vh-70px)] bg-slate-50 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
      <MobileMenu />
    </>
  );
}
