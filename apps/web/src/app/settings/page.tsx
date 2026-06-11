"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// --- REUSABLE UI COMPONENTS ---
const Card = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    <p className="text-sm text-gray-500 mb-6">{desc}</p>
    <div className="space-y-6">{children}</div>
  </section>
);

const SelectRow = ({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <span className="text-sm font-medium text-gray-700 w-1/3">{label}</span>
    <div className="relative w-full sm:w-2/3">
      <select 
        defaultValue={defaultValue}
        className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

const ToggleRow = ({ title, desc, isOn, onToggle }: { title: string; desc: string; isOn: boolean; onToggle?: () => void }) => (
  <div className="flex items-center justify-between">
    <div className="w-2/3 pr-4">
      <span className="block text-sm font-medium text-gray-700">{title}</span>
      <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>
    </div>
    <div onClick={onToggle} className={`w-12 h-6 rounded-full relative cursor-pointer flex items-center px-1 transition-colors ${isOn ? 'bg-[#F5A623]' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${isOn ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

const InputRow = ({ label, type = "text", placeholder, defaultValue }: { label: string; type?: string; placeholder?: string; defaultValue?: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <span className="text-sm font-medium text-gray-700 w-1/3">{label}</span>
    <input 
      type={type} 
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full sm:w-2/3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
    />
  </div>
);

// --- TAB CONTENTS ---
const GeneralTab = () => (
  <>
    <Card title="General" desc="Pengaturan dasar aplikasi.">
      <SelectRow label="Language" options={["Bahasa Indonesia", "English (US)"]} />
      
      {/* Theme Selector Custom */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <span className="text-sm font-medium text-gray-700 w-1/3 mt-3">Theme</span>
        <div className="w-full sm:w-2/3 grid grid-cols-3 gap-3">
          <div className="relative border-2 border-[#F5A623] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white">
            <div className="absolute -top-2 -right-2 bg-[#F5A623] rounded-full p-0.5 border-2 border-white">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <svg className="w-6 h-6 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="text-xs font-semibold text-gray-900">Light</span>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-300 bg-white transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <span className="text-xs font-medium text-gray-600">Dark</span>
          </div>
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-300 bg-white transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span className="text-xs font-medium text-gray-600">System</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-100 w-full my-6"></div>
      <SelectRow label="Time Zone" options={["(GMT+07:00) Asia/Jakarta", "(GMT+00:00) UTC"]} />
      <SelectRow label="Date Format" options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />
      <SelectRow label="Default Project Aspect Ratio" options={["16:9 (Widescreen)", "9:16 (Vertical)", "1:1 (Square)"]} />
      <div className="h-px bg-gray-100 w-full my-6"></div>
      <ToggleRow title="Show tips on startup" desc="Tampilkan panduan saat aplikasi dibuka" isOn={true} />
    </Card>

    <Card title="Auto Save" desc="Atur preferensi penyimpanan otomatis proyek.">
      <ToggleRow title="Enable Auto Save" desc="Simpan proyek secara otomatis saat Anda bekerja" isOn={true} />
      <SelectRow label="Auto Save Interval" options={["1 menit", "5 menit", "10 menit", "30 menit"]} defaultValue="5 menit" />
    </Card>

    <Card title="Export Defaults" desc="Pengaturan default untuk ekspor video.">
      <SelectRow label="Default Resolution" options={["1080p (1920x1080)", "4K (3840x2160)", "720p (1280x720)"]} />
      <SelectRow label="Default Frame Rate" options={["24 fps", "30 fps", "60 fps"]} defaultValue="30 fps" />
      <SelectRow label="Default Export Format" options={["MP4", "MOV", "WEBM"]} />
      <SelectRow label="Default Video Quality" options={["Low", "Medium", "High", "Ultra"]} defaultValue="High" />
    </Card>
  </>
);

const ProfileTab = () => (
  <Card title="Profile Information" desc="Perbarui detail profil publik dan informasi pribadi Anda.">
    <div className="flex items-center gap-6 mb-6">
      <div className="w-20 h-20 bg-orange-300 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">
        AU
      </div>
      <div>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-2">Change Avatar</button>
        <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
      </div>
    </div>
    <div className="h-px bg-gray-100 w-full my-6"></div>
    <InputRow label="Full Name" defaultValue="Agus Dwi R" />
    <InputRow label="Email Address" type="email" defaultValue="audira@clip.ai" />
    <InputRow label="Role / Job Title" defaultValue="Lead Architect" />
    
    <div className="flex justify-end pt-4">
      <button className="px-6 py-2.5 bg-[#F5A623] text-white rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm">Save Changes</button>
    </div>
  </Card>
);

const PreferencesTab = () => (
  <Card title="Editor Preferences" desc="Sesuaikan antarmuka Editor dan AI Copilot dengan gaya kerja Anda.">
    <SelectRow label="Default Subtitle Font" options={["Plus Jakarta Sans", "Roboto", "Inter", "Arial"]} />
    <SelectRow label="Subtitle Font Size" options={["Small", "Medium", "Large", "Extra Large"]} defaultValue="Medium" />
    <ToggleRow title="Auto-Generate Subtitles" desc="Selalu buat subtitle otomatis saat mengunggah video baru" isOn={true} />
    <ToggleRow title="AI Highlight Detection" desc="Gunakan AI untuk mendeteksi momen penting secara otomatis" isOn={true} />
    <ToggleRow title="Show Audio Waveforms" desc="Tampilkan gelombang audio di timeline editor" isOn={true} />
  </Card>
);

const StorageTab = () => (
  <Card title="Storage & Quota" desc="Pantau penggunaan penyimpanan cloud dan limit pemrosesan AI Anda.">
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Cloud Storage</h3>
            <p className="text-xs text-gray-500 mt-1">Digunakan untuk menyimpan video asli dan hasil render.</p>
          </div>
          <span className="text-sm font-bold text-gray-900">250 GB <span className="text-gray-400 font-normal">/ 1 TB</span></span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#F5A623] rounded-full w-[25%]" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900">AI Processing Minutes</h3>
            <p className="text-xs text-gray-500 mt-1">Durasi total video yang telah diproses oleh Whisper & AI.</p>
          </div>
          <span className="text-sm font-bold text-gray-900">850 <span className="text-gray-400 font-normal">/ 1000 mins</span></span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 rounded-full w-[85%]" />
        </div>
        <p className="text-xs text-red-500 mt-2 font-medium">Hampir mencapai batas bulanan Anda.</p>
      </div>

      <div className="pt-4 flex">
        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm">Upgrade Quota</button>
      </div>
    </div>
  </Card>
);

const BillingTab = () => (
  <>
    <Card title="Current Plan" desc="Informasi paket berlangganan Anda saat ini.">
      <div className="bg-[#FFF8EB] border border-[#F5A623]/30 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="inline-block px-2.5 py-1 bg-[#F5A623] text-white text-[10px] font-black tracking-widest uppercase rounded mb-2">Pro Plan</span>
          <h3 className="text-2xl font-bold text-gray-900">$49<span className="text-sm text-gray-500 font-medium">/month</span></h3>
          <p className="text-sm text-gray-600 mt-1">Siklus penagihan berikutnya pada <strong>1 Oktober 2026</strong>.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel Plan</button>
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-[#F5A623] text-white rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm">Manage Billing</button>
        </div>
      </div>
    </Card>
    <Card title="Billing History" desc="Faktur dan riwayat pembayaran sebelumnya.">
      <div className="text-center py-8 text-gray-500 text-sm">
        Belum ada riwayat penagihan.
      </div>
    </Card>
  </>
);

const IntegrationsTab = () => (
  <Card title="Connected Accounts" desc="Hubungkan akun media sosial Anda untuk mengekspor langsung.">
    <div className="space-y-4">
      {/* YouTube */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">YouTube</h4>
            <p className="text-xs text-green-600 font-medium">Connected as Audira Channel</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">Disconnect</button>
      </div>

      {/* TikTok */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">TikTok</h4>
            <p className="text-xs text-gray-500">Not connected</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black">Connect</button>
      </div>
    </div>
  </Card>
);

const NotificationsTab = () => (
  <Card title="Notification Preferences" desc="Pilih jenis pemberitahuan yang ingin Anda terima.">
    <ToggleRow title="Email Notifications" desc="Terima ringkasan mingguan dan pengumuman fitur baru via email." isOn={false} />
    <ToggleRow title="Render Complete Alerts" desc="Kirimkan push notification di browser saat video selesai dirender." isOn={true} />
    <ToggleRow title="Security Alerts" desc="Dapatkan email saat ada login dari perangkat atau IP baru." isOn={true} />
    <ToggleRow title="Marketing & Promo" desc="Tawaran eksklusif dan diskon berlangganan." isOn={false} />
  </Card>
);

const SecurityTab = () => (
  <>
    <Card title="Change Password" desc="Perbarui kata sandi Anda untuk menjaga keamanan akun.">
      <InputRow label="Current Password" type="password" placeholder="••••••••" />
      <InputRow label="New Password" type="password" placeholder="••••••••" />
      <InputRow label="Confirm New Password" type="password" placeholder="••••••••" />
      <div className="flex justify-end pt-2">
        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm">Update Password</button>
      </div>
    </Card>
    <Card title="Two-Factor Authentication (2FA)" desc="Lapisan keamanan ekstra menggunakan aplikasi Authenticator.">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-sm font-bold text-gray-900">App Authenticator</span>
          <span className="block text-xs text-gray-500 mt-0.5">Disarankan (Google Authenticator, Authy, dll)</span>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-200">Enable 2FA</button>
      </div>
    </Card>
  </>
);

const AdvancedTab = () => (
  <>
    <Card title="Developer API" desc="Gunakan API Key ini untuk mengintegrasikan Audira Clip AI dengan sistem Anda.">
      <div className="flex items-center gap-4">
        <input type="text" readOnly value="audira_key_8471xxxxxxxxxxxx" className="flex-1 bg-gray-50 border border-gray-200 text-gray-500 font-mono text-sm rounded-lg px-4 py-2.5 focus:outline-none" />
        <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Copy</button>
      </div>
      <p className="text-xs text-orange-600 font-medium">Jaga kerahasiaan kunci ini. Jangan membagikannya secara publik.</p>
    </Card>
    <Card title="Advanced Configuration" desc="Pengaturan teknis tingkat lanjut.">
      <ToggleRow title="Hardware Acceleration" desc="Gunakan GPU untuk rendering lebih cepat" isOn={true} />
      <ToggleRow title="Enable Proxy Files" desc="Buat file proxy resolusi rendah untuk editing lancar" isOn={false} />
      
      <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
        <div className="w-2/3">
          <span className="block text-sm font-medium text-gray-700">Clear Cache</span>
          <span className="block text-xs text-gray-400 mt-0.5">Hapus file sementara (temp) untuk melonggarkan disk</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Clear Cache
        </button>
      </div>
    </Card>
    <Card title="Danger Zone" desc="Tindakan permanen dan destruktif.">
      <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50/50 rounded-xl">
        <div>
          <h4 className="font-bold text-red-800 text-sm">Delete Account</h4>
          <p className="text-xs text-red-600 mt-1">Hapus seluruh proyek, pengaturan, dan data penagihan secara permanen.</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">Delete Account</button>
      </div>
    </Card>
  </>
);


// --- MAIN PAGE COMPONENT ---
export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Preferences', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { name: 'Storage', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
    { name: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Integrations', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { name: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { name: 'Advanced', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'General': return <GeneralTab />;
      case 'Profile': return <ProfileTab />;
      case 'Preferences': return <PreferencesTab />;
      case 'Storage': return <StorageTab />;
      case 'Billing': return <BillingTab />;
      case 'Integrations': return <IntegrationsTab />;
      case 'Notifications': return <NotificationsTab />;
      case 'Security': return <SecurityTab />;
      case 'Advanced': return <AdvancedTab />;
      default: return <GeneralTab />;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Kelola preferensi akun dan aplikasi Anda</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Inner Sidebar Navigation */}
          <aside className="w-full lg:w-60 shrink-0 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#FFF8EB] text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  {tab.name}
                </button>
              );
            })}
          </aside>

          {/* Main Settings Content */}
          <div className="flex-1 space-y-6">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2026 Audira Clip. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
