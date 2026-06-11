import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CopilotChat from "../ui/CopilotChat";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-8">
          {children}
        </main>
        <CopilotChat />
      </div>
    </div>
  );
}
