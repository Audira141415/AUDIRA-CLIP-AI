import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CopilotChat from "../ui/CopilotChat";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          {children}
        </main>
        <CopilotChat />
      </div>
    </div>
  );
}
