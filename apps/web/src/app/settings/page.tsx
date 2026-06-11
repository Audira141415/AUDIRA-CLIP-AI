import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Settings() {
  const tabs = [
    { name: 'General', active: true, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Profile', active: false, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Preferences', active: false, icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { name: 'Storage', active: false, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
    { name: 'Billing', active: false, icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Integrations', active: false, icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { name: 'Notifications', active: false, icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Security', active: false, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { name: 'Advanced', active: false, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Kelola preferensi akun dan aplikasi Anda</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Inner Sidebar Navigation */}
          <aside className="w-full lg:w-60 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  tab.active
                    ? 'bg-[#FFF8EB] text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <svg className={`w-5 h-5 ${tab.active ? 'text-gray-900' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.name}
              </button>
            ))}
          </aside>

          {/* Main Settings Content */}
          <div className="flex-1 space-y-6">
            
            {/* General Card */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-bold text-gray-900">General</h2>
              <p className="text-sm text-gray-500 mb-6">Pengaturan dasar aplikasi.</p>

              <div className="space-y-6">
                {/* Language */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Language</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>Bahasa Indonesia</option>
                      <option>English</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3 mt-3">Theme</span>
                  <div className="w-full sm:w-2/3 grid grid-cols-3 gap-3">
                    {/* Light Active */}
                    <div className="relative border-2 border-[#F5A623] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white">
                      <div className="absolute -top-2 -right-2 bg-[#F5A623] rounded-full p-0.5 border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <svg className="w-6 h-6 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <span className="text-xs font-semibold text-gray-900">Light</span>
                    </div>
                    {/* Dark */}
                    <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-300 bg-white">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      <span className="text-xs font-medium text-gray-600">Dark</span>
                    </div>
                    {/* System */}
                    <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-300 bg-white">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span className="text-xs font-medium text-gray-600">System</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full my-6"></div>

                {/* Time Zone */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Time Zone</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>(GMT+07:00) Asia/Jakarta</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Date Format */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Date Format</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>DD/MM/YYYY</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Default Project Aspect Ratio</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>16:9 (Widescreen)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 w-full my-6"></div>

                {/* Show tips */}
                <div className="flex items-center justify-between">
                  <div className="w-2/3">
                    <span className="block text-sm font-medium text-gray-700">Show tips on startup</span>
                    <span className="block text-xs text-gray-400 mt-0.5">Tampilkan tips dan panduan saat aplikasi dibuka</span>
                  </div>
                  <div className="w-12 h-6 bg-[#F5A623] rounded-full relative cursor-pointer flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Auto Save Card */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-bold text-gray-900">Auto Save</h2>
              <p className="text-sm text-gray-500 mb-6">Atur preferensi penyimpanan otomatis proyek.</p>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-2/3">
                    <span className="block text-sm font-medium text-gray-700">Enable Auto Save</span>
                    <span className="block text-xs text-gray-400 mt-0.5">Simpan proyek secara otomatis saat Anda bekerja</span>
                  </div>
                  <div className="w-12 h-6 bg-[#F5A623] rounded-full relative cursor-pointer flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Auto Save Interval</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>5 menit</option>
                      <option>10 menit</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Export Defaults Card */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-bold text-gray-900">Export Defaults</h2>
              <p className="text-sm text-gray-500 mb-6">Pengaturan default untuk ekspor video.</p>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Default Resolution</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>1080p (1920x1080)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Default Frame Rate</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>30 fps</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Default Export Format</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>MP4</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700 w-1/3">Default Video Quality</span>
                  <div className="relative w-full sm:w-2/3">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent">
                      <option>High</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Settings Card */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-bold text-gray-900">Advanced Settings</h2>
              <p className="text-sm text-gray-500 mb-6">Pengaturan lanjutan untuk pengguna berpengalaman.</p>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-2/3">
                    <span className="block text-sm font-medium text-gray-700">Hardware Acceleration</span>
                    <span className="block text-xs text-gray-400 mt-0.5">Gunakan akselerasi hardware untuk performa lebih baik</span>
                  </div>
                  <div className="w-12 h-6 bg-[#F5A623] rounded-full relative cursor-pointer flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-2/3">
                    <span className="block text-sm font-medium text-gray-700">Enable Proxies</span>
                    <span className="block text-xs text-gray-400 mt-0.5">Gunakan proxy untuk editing video resolusi tinggi</span>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="w-2/3">
                    <span className="block text-sm font-medium text-gray-700">Clear Cache</span>
                    <span className="block text-xs text-gray-400 mt-0.5">Hapus cache aplikasi untuk membebaskan ruang</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Clear Cache
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2024 Audira Clip. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
