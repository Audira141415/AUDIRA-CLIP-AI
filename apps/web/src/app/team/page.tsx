'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, ChevronDown, UserPlus, ShieldAlert, Shield, Edit2, Eye, MoreHorizontal, Users, CreditCard, ChevronLeft, ChevronRight, LogOut, CheckCircle2, Circle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export default function TeamPage() {
  const members = [
    { name: "Ardiansyah Utomo", email: "ardiansyah@audira.com", role: "Owner", access: "All Projects", lastActive: "2 minutes ago", status: "Online", avatar: "A" },
    { name: "Dewi Lestari", email: "dewi@audira.com", role: "Admin", access: "All Projects", lastActive: "1 hour ago", status: "Online", avatar: "D" },
    { name: "Rizky Pratama", email: "rizky@audira.com", role: "Editor", access: "12 Projects", lastActive: "3 hours ago", status: "Online", avatar: "R" },
    { name: "Siti Aisyah", email: "siti@audira.com", role: "Editor", access: "8 Projects", lastActive: "Yesterday", status: "Offline", avatar: "S" },
    { name: "Bagus Setiawan", email: "bagus@audira.com", role: "Viewer", access: "5 Projects", lastActive: "2 days ago", status: "Offline", avatar: "B" },
    { name: "Maya Putri", email: "maya@audira.com", role: "Viewer", access: "3 Projects", lastActive: "3 days ago", status: "Offline", avatar: "M" }
  ];

  const getRoleStyle = (role: string) => {
    switch(role) {
      case 'Owner': return { bg: 'bg-[#D8B4E2]', icon: ShieldAlert };
      case 'Admin': return { bg: 'bg-[#82C3FF]', icon: Shield };
      case 'Editor': return { bg: 'bg-[#00E5FF]', icon: Edit2 };
      case 'Viewer': return { bg: 'bg-gray-200', icon: Eye };
      default: return { bg: 'bg-white', icon: Eye };
    }
  };

  const activity = [
    { name: "Rizky Pratama", action: "Edited project Marketing Video", time: "2 minutes ago", initial: "R" },
    { name: "Dewi Lestari", action: "Added new member Maya Putri", time: "1 hour ago", initial: "D" },
    { name: "Ardiansyah Utomo", action: "Changed role of Bagus Setiawan", time: "3 hours ago", initial: "A" },
    { name: "Siti Aisyah", action: "Exported video Social Media Clip", time: "Yesterday", initial: "S" }
  ];

  return (
    <DashboardLayout>
      <div className="flex h-full bg-[#FAFAFA] text-black font-sans -m-8 relative">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        {/* Main Content Area (Left) */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto h-[calc(100vh-80px)] z-10 relative">
          
          <PageHero
            title="Team"
            description="Manage your team members, roles and permissions."
            imageSrc="/images/hero_team.png"
            imageAlt="Team Hero"
          />

          {/* Tabs */}
          <div className="flex border-b-4 border-black mb-6">
            <button className="px-6 py-3 font-black uppercase text-sm border-b-4 border-[#F5A623] text-black -mb-1">Members</button>
            <button className="px-6 py-3 font-bold uppercase text-sm text-gray-500 hover:text-black hover:border-b-4 hover:border-black transition-all -mb-1">Roles & Permissions</button>
            <button className="px-6 py-3 font-bold uppercase text-sm text-gray-500 hover:text-black hover:border-b-4 hover:border-black transition-all -mb-1">Invitations</button>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            
            <div className="flex-1 flex gap-4 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search members..." 
                  className="w-full bg-white border-4 border-black py-3 pl-10 pr-4 font-bold outline-none focus:border-[#F5A623] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] focus:translate-x-[2px] transition-all"
                />
              </div>

              {/* Filter */}
              <div className="relative w-48">
                <select className="w-full h-full bg-white border-4 border-black px-4 font-bold appearance-none outline-none cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" strokeWidth={3} />
              </div>
            </div>

            {/* Invite Button */}
            <button className="bg-[#F5A623] border-4 border-black py-3 px-6 font-black uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all whitespace-nowrap">
              <UserPlus className="w-5 h-5" strokeWidth={3} /> Invite Member
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b-4 border-black text-xs font-black uppercase">
                    <th className="p-4 border-r-2 border-black w-1/3">Member</th>
                    <th className="p-4 border-r-2 border-black">Role</th>
                    <th className="p-4 border-r-2 border-black">Projects Access</th>
                    <th className="p-4 border-r-2 border-black">Last Active</th>
                    <th className="p-4 border-r-2 border-black">Status</th>
                    <th className="p-4 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm">
                  {members.map((m, i) => {
                    const roleStyle = getRoleStyle(m.role);
                    const RoleIcon = roleStyle.icon;
                    return (
                      <tr key={i} className="border-b-2 border-gray-200 hover:bg-[#FFEDF4] transition-colors group cursor-pointer">
                        <td className="p-4 border-r-2 border-gray-200 group-hover:border-black flex items-center gap-3">
                          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black border-2 border-black">
                            {m.avatar}
                          </div>
                          <div>
                            <div className="font-black text-base">{m.name}</div>
                            <div className="text-gray-500 text-xs">{m.email}</div>
                          </div>
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 group-hover:border-black">
                          <span className={`inline-flex items-center gap-1.5 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${roleStyle.bg}`}>
                            {m.role} <RoleIcon className="w-3 h-3" strokeWidth={3} />
                          </span>
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 group-hover:border-black">
                          {m.access}
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 group-hover:border-black text-gray-500">
                          {m.lastActive}
                        </td>
                        <td className="p-4 border-r-2 border-gray-200 group-hover:border-black">
                          <span className={`inline-flex items-center gap-1.5 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${m.status === 'Online' ? 'bg-[#00E5FF]' : 'bg-gray-100 text-gray-500'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="p-1 hover:bg-[#F5A623] border-2 border-transparent hover:border-black transition-colors rounded-sm">
                            <MoreHorizontal className="w-5 h-5" strokeWidth={3} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-auto">
            <button className="w-10 h-10 flex items-center justify-center bg-white border-4 border-black hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ChevronLeft className="w-5 h-5" strokeWidth={3} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-[#F5A623] border-4 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border-4 border-black font-black hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white border-4 border-black hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ChevronRight className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-[380px] shrink-0 border-l-4 border-black bg-[#FAFAFA] flex flex-col h-[calc(100vh-80px)] z-20">
          
          <div className="flex-1 overflow-y-auto space-y-6 p-6">
            
            {/* Team Overview */}
            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
              <h2 className="font-black uppercase text-xl mb-4">Team Overview</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FFEDF4] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Users className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-black text-lg">6</div>
                    <div className="text-xs font-bold uppercase text-gray-500">Members</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00E5FF] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Shield className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-black text-lg">2</div>
                    <div className="text-xs font-bold uppercase text-gray-500">Admins</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5A623] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <MoreHorizontal className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-black text-lg">12</div>
                    <div className="text-xs font-bold uppercase text-gray-500">Projects Accessed</div>
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-between border-t-2 border-black pt-4 font-black uppercase text-sm hover:text-[#F5A623] transition-colors group">
                <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Manage Billing</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-black uppercase text-xl">Recent Activity</h2>
                <button className="text-xs font-black uppercase text-[#F5A623] hover:underline decoration-2 underline-offset-2">View all</button>
              </div>

              <div className="space-y-4">
                {activity.map((act, i) => (
                  <div key={i} className="flex gap-3 relative">
                    {/* Activity Line (skip for last) */}
                    {i !== activity.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-[-16px] w-0.5 bg-black z-0"></div>
                    )}
                    
                    <div className="w-8 h-8 bg-black text-white border-2 border-black flex items-center justify-center font-black text-sm shrink-0 z-10 relative">
                      {act.initial}
                    </div>
                    <div>
                      <h4 className="font-black text-sm">{act.name}</h4>
                      <p className="font-bold text-xs text-gray-600 leading-snug">{act.action}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Settings */}
            <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
              <h2 className="font-black uppercase text-xl mb-4">Team Settings</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3">
                  <span className="font-bold text-sm">Team Name</span>
                  <div className="flex items-center gap-2 font-black text-sm">
                    Audira Creative <Edit2 className="w-3 h-3 text-gray-400 cursor-pointer hover:text-black" />
                  </div>
                </div>

                <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 cursor-pointer group">
                  <span className="font-bold text-sm">Default Project Access</span>
                  <div className="flex items-center gap-1 font-black text-sm group-hover:text-[#F5A623] transition-colors">
                    By Invitation <ChevronRight className="w-4 h-4" strokeWidth={3} />
                  </div>
                </div>

                <div className="flex justify-between items-center pb-1">
                  <span className="font-bold text-sm">Members Can Invite</span>
                  <div className="w-10 h-5 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full absolute right-0.5"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Require Approval</span>
                  <div className="w-10 h-5 bg-gray-200 border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-3 h-3 bg-white border-2 border-black rounded-full absolute left-0.5"></div>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 font-black uppercase text-sm border-2 border-red-500 px-4 py-2 w-full justify-center transition-colors">
                <LogOut className="w-4 h-4" strokeWidth={3} /> Leave Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
