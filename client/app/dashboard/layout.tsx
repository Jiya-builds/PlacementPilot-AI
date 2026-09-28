import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-white">

      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}