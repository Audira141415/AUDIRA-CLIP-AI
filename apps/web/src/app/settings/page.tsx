"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Settings as SettingsIcon, Bell, CreditCard, Shield, Key, Globe, Palette, MonitorPlay, Zap, Link as LinkIcon, LogOut, CheckCircle2, AlertTriangle, Upload, Save, Eye, EyeOff } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

// --- REUSABLE UI COMPONENTS ---
const Card = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group">
    <div className="absolute top-0 right-0 w-8 h-8 border-l-4 border-b-4 border-black bg-[#F5A623] hidden group-hover:block"></div>
    <h2 className="text-2xl font-black uppercase text-black mb-2">{title}</h2>
    <p className="text-sm font-bold text-black mb-6 bg-[#00E5FF] inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{desc}</p>
    <div className="space-y-6">{children}</div>
  </section>
);

const SelectRow = ({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (val: string) => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <span className="text-sm font-black uppercase text-black w-1/3">{label}</span>
    <div className="relative w-full sm:w-2/3">
      <select 
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full appearance-none bg-white border-4 border-black text-black font-bold text-sm px-4 py-3 pr-10 focus:outline-none focus:bg-[#FFEDF4] cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black border-l-4 border-black bg-[#F5A623]">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

const ToggleRow = ({ title, desc, isOn, onToggle }: { title: string; desc: string; isOn: boolean; onToggle?: () => void }) => (
  <div className="flex items-center justify-between border-b-4 border-black pb-4 last:border-0 last:pb-0">
    <div className="w-2/3 pr-4">
      <span className="block text-sm font-black uppercase text-black">{title}</span>
      <span className="block text-xs font-bold text-gray-600 mt-1">{desc}</span>
    </div>
    <div onClick={onToggle} className={`w-14 h-8 border-4 border-black relative cursor-pointer flex items-center px-1 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isOn ? 'bg-[#00E5FF]' : 'bg-white'}`}>
      <div className={`w-4 h-4 bg-black absolute transition-all ${isOn ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

const InputRow = ({ label, type = "text", placeholder, value, onChange }: { label: string; type?: string; placeholder?: string; value?: string; onChange?: (val: string) => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <span className="text-sm font-black uppercase text-black w-1/3">{label}</span>
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full sm:w-2/3 bg-white border-4 border-black text-black font-bold text-sm px-4 py-3 focus:outline-none focus:bg-[#FFEDF4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    />
  </div>
);

// --- TAB CONTENTS ---
const GeneralTab = ({ settings, onChange }: any) => (
  <>
    <Card title="General" desc="Pengaturan dasar aplikasi.">
      <SelectRow label="Language" options={["Bahasa Indonesia", "English (US)"]} value={settings.language} onChange={(v) => onChange('language', v)} />
      
      {/* Theme Selector Custom */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <span className="text-sm font-black uppercase text-black w-1/3 mt-3">Theme</span>
        <div className="w-full sm:w-2/3 grid grid-cols-3 gap-4">
          <div onClick={() => onChange('theme', 'Light')} className={`relative border-4 border-black p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform ${settings.theme === 'Light' ? 'bg-[#F5A623] shadow-none translate-y-[4px] translate-x-[4px]' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <span className="text-sm font-black uppercase">Light</span>
          </div>
          <div onClick={() => onChange('theme', 'Dark')} className={`relative border-4 border-black p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform ${settings.theme === 'Dark' ? 'bg-[#F5A623] shadow-none translate-y-[4px] translate-x-[4px]' : 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <span className="text-sm font-black uppercase">Dark</span>
          </div>
          <div onClick={() => onChange('theme', 'System')} className={`relative border-4 border-black p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform ${settings.theme === 'System' ? 'bg-[#F5A623] shadow-none translate-y-[4px] translate-x-[4px]' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <span className="text-sm font-black uppercase">System</span>
          </div>
        </div>
      </div>
      <div className="h-1 bg-black w-full my-6"></div>
      <SelectRow label="Time Zone" options={["(GMT+07:00) Asia/Jakarta", "(GMT+00:00) UTC"]} value={settings.timeZone} onChange={(v) => onChange('timeZone', v)} />
      <SelectRow label="Date Format" options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} value={settings.dateFormat} onChange={(v) => onChange('dateFormat', v)} />
      <SelectRow label="Default Aspect Ratio" options={["16:9 (Widescreen)", "9:16 (Vertical)", "1:1 (Square)"]} value={settings.aspectRatio} onChange={(v) => onChange('aspectRatio', v)} />
      <div className="h-1 bg-black w-full my-6"></div>
      <ToggleRow title="Show tips on startup" desc="Tampilkan panduan saat aplikasi dibuka" isOn={settings.showTips} onToggle={() => onChange('showTips', !settings.showTips)} />
    </Card>

    <Card title="Auto Save" desc="Atur preferensi penyimpanan otomatis proyek.">
      <ToggleRow title="Enable Auto Save" desc="Simpan proyek secara otomatis saat Anda bekerja" isOn={settings.autoSave} onToggle={() => onChange('autoSave', !settings.autoSave)} />
      <SelectRow label="Auto Save Interval" options={["1 menit", "5 menit", "10 menit", "30 menit"]} value={settings.autoSaveInterval} onChange={(v) => onChange('autoSaveInterval', v)} />
    </Card>

    <Card title="Export Defaults" desc="Pengaturan default untuk ekspor video.">
      <SelectRow label="Default Resolution" options={["1080p (1920x1080)", "4K (3840x2160)", "720p (1280x720)"]} value={settings.exportRes} onChange={(v) => onChange('exportRes', v)} />
      <SelectRow label="Default Frame Rate" options={["24 fps", "30 fps", "60 fps"]} value={settings.exportFps} onChange={(v) => onChange('exportFps', v)} />
      <SelectRow label="Default Format" options={["MP4", "MOV", "WEBM"]} value={settings.exportFormat} onChange={(v) => onChange('exportFormat', v)} />
      <SelectRow label="Default Quality" options={["Low", "Medium", "High", "Ultra"]} value={settings.exportQuality} onChange={(v) => onChange('exportQuality', v)} />
    </Card>
  </>
);

const ProfileTab = ({ settings, onChange }: any) => (
  <Card title="Profile Information" desc="Perbarui detail profil publik dan informasi pribadi Anda.">
    <div className="flex items-center gap-6 mb-6">
      <div className="w-24 h-24 bg-[#D8B4E2] border-4 border-black flex items-center justify-center text-black font-black text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        AU
      </div>
      <div>
        <button className="px-6 py-3 bg-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform mb-2">Change Avatar</button>
        <p className="text-xs font-bold text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
      </div>
    </div>
    <div className="h-1 bg-black w-full my-6"></div>
    <InputRow label="Full Name" value={settings.profileName} onChange={(v) => onChange('profileName', v)} />
    <InputRow label="Email Address" type="email" value={settings.profileEmail} onChange={(v) => onChange('profileEmail', v)} />
    <InputRow label="Role / Job Title" value={settings.profileRole} onChange={(v) => onChange('profileRole', v)} />
  </Card>
);

const PreferencesTab = ({ settings, onChange }: any) => (
  <Card title="Editor Preferences" desc="Sesuaikan antarmuka Editor dan AI Copilot.">
    {/* NEW SECTION: AI Engine Settings */}
    <div className="mb-6 p-6 bg-[#FFEDF4] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
      <div className="mb-2 border-b-4 border-black pb-2">
        <h4 className="text-lg font-black text-black uppercase flex items-center gap-2">
          AI Engine Provider
        </h4>
        <p className="text-xs font-bold text-gray-700">Pilih model kecerdasan buatan utama.</p>
      </div>

      <SelectRow label="Active Model" options={[
        "deepseek-r1:8b (Fastest)", "deepseek-r1:32b (Smart)", "qwen2.5:32b (Multilingual)",
        "gpt-4o (OpenAI)", "claude-3-5-sonnet (Anthropic)", "gemini-1.5-pro (Google)"
      ]} value={settings.aiModel} onChange={(v) => onChange('aiModel', v)} />

      <div className="pt-4 mt-2 space-y-4">
        <h5 className="text-sm font-black text-black uppercase bg-white inline-block px-2 border-2 border-black">Cloud API Keys</h5>
        <InputRow label="OpenAI API Key" type="password" placeholder="sk-proj-..." value={settings.openAiKey || ''} onChange={(v) => onChange('openAiKey', v)} />
        <InputRow label="Anthropic API Key" type="password" placeholder="sk-ant-..." value={settings.anthropicKey || ''} onChange={(v) => onChange('anthropicKey', v)} />
      </div>
    </div>

    <SelectRow label="Default Subtitle Font" options={["Plus Jakarta Sans", "Roboto", "Inter", "Arial"]} value={settings.subtitleFont} onChange={(v) => onChange('subtitleFont', v)} />
    <SelectRow label="Subtitle Font Size" options={["Small", "Medium", "Large", "Extra Large"]} value={settings.subtitleSize} onChange={(v) => onChange('subtitleSize', v)} />
    <ToggleRow title="Auto-Generate Subtitles" desc="Selalu buat subtitle otomatis saat mengunggah video" isOn={settings.autoSubtitles} onToggle={() => onChange('autoSubtitles', !settings.autoSubtitles)} />
    <ToggleRow title="AI Highlight Detection" desc="Deteksi momen penting otomatis" isOn={settings.aiHighlight} onToggle={() => onChange('aiHighlight', !settings.aiHighlight)} />
    <ToggleRow title="Show Audio Waveforms" desc="Tampilkan gelombang audio di timeline" isOn={settings.showWaveforms} onToggle={() => onChange('showWaveforms', !settings.showWaveforms)} />
  </Card>
);

const StorageTab = () => (
  <Card title="Storage & Quota" desc="Pantau penyimpanan cloud dan limit pemrosesan AI Anda.">
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-black uppercase text-black">Cloud Storage</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Digunakan untuk menyimpan video asli dan hasil render.</p>
          </div>
          <span className="text-sm font-black text-black bg-white px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">250 GB / 1 TB</span>
        </div>
        <div className="w-full h-4 bg-white border-4 border-black relative">
          <div className="absolute top-0 left-0 h-full bg-[#00E5FF] border-r-4 border-black" style={{width: '25%'}} />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-black uppercase text-black">AI Processing Minutes</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Durasi total video yang telah diproses AI.</p>
          </div>
          <span className="text-sm font-black text-black bg-[#FFEDF4] px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">850 / 1000 mins</span>
        </div>
        <div className="w-full h-4 bg-white border-4 border-black relative">
          <div className="absolute top-0 left-0 h-full bg-red-500 border-r-4 border-black" style={{width: '85%'}} />
        </div>
      </div>

      <div className="pt-4 flex">
        <button className="px-6 py-3 bg-[#F5A623] border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">Upgrade Quota</button>
      </div>
    </div>
  </Card>
);

const BillingTab = () => (
  <>
    <Card title="Current Plan" desc="Informasi paket berlangganan Anda saat ini.">
      <div className="bg-[#00E5FF] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-white border-2 border-black text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">Pro Plan</span>
          <h3 className="text-4xl font-black text-black">$49<span className="text-sm font-bold ml-1">/month</span></h3>
          <p className="text-sm font-bold text-black mt-2">Siklus penagihan berikutnya: <span className="bg-white px-1 border-2 border-black">1 Okt 2026</span></p>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button className="w-full px-6 py-3 bg-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">Cancel Plan</button>
          <button className="w-full px-6 py-3 bg-black text-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(245,166,35,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">Manage Billing</button>
        </div>
      </div>
    </Card>
    <Card title="Billing History" desc="Faktur dan riwayat pembayaran sebelumnya.">
      <div className="text-center py-8 font-bold uppercase text-gray-500 bg-gray-100 border-4 border-black border-dashed">
        Belum ada riwayat penagihan.
      </div>
    </Card>
  </>
);

const IntegrationsTab = () => (
  <Card title="Connected Accounts" desc="Hubungkan akun media sosial Anda untuk mengekspor langsung.">
    <div className="space-y-4">
      {/* YouTube */}
      <div className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 border-4 border-black text-white flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </div>
          <div>
            <h4 className="font-black uppercase text-black text-sm">YouTube</h4>
            <p className="text-xs font-bold bg-[#00E5FF] inline-block px-1 border-2 border-black mt-1">Connected</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white border-4 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100">Disconnect</button>
      </div>

      {/* TikTok */}
      <div className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black border-4 border-black text-white flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
          </div>
          <div>
            <h4 className="font-black uppercase text-black text-sm">TikTok</h4>
            <p className="text-xs font-bold text-gray-500 mt-1">Not connected</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-[#D8B4E2] border-4 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">Connect</button>
      </div>
    </div>
  </Card>
);

const NotificationsTab = () => (
  <Card title="Notification Preferences" desc="Pilih jenis pemberitahuan yang ingin Anda terima.">
    <ToggleRow title="Email Notifications" desc="Ringkasan mingguan dan pengumuman fitur baru." isOn={false} />
    <ToggleRow title="Render Alerts" desc="Push notification saat video selesai dirender." isOn={true} />
    <ToggleRow title="Security Alerts" desc="Email saat ada login dari perangkat baru." isOn={true} />
  </Card>
);

const SecurityTab = () => (
  <>
    <Card title="Change Password" desc="Perbarui kata sandi Anda.">
      <InputRow label="Current Password" type="password" placeholder="••••••••" />
      <InputRow label="New Password" type="password" placeholder="••••••••" />
      <InputRow label="Confirm Password" type="password" placeholder="••••••••" />
      <div className="flex justify-end pt-4 border-t-4 border-black mt-4">
        <button className="px-6 py-3 bg-[#F5A623] border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">Update Password</button>
      </div>
    </Card>
    <Card title="Two-Factor Auth" desc="Lapisan keamanan ekstra menggunakan aplikasi Authenticator.">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-sm font-black uppercase text-black">App Authenticator</span>
          <span className="block text-xs font-bold text-gray-500 mt-1">Google Authenticator, Authy, dll</span>
        </div>
        <button className="px-4 py-2 bg-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Enable 2FA</button>
      </div>
    </Card>
  </>
);

const AdvancedTab = () => (
  <>
    <Card title="Developer API" desc="Gunakan API Key ini untuk integrasi.">
      <div className="flex items-center gap-4">
        <input type="text" readOnly value="audira_key_8471xxxxxxxxxxxx" className="flex-1 bg-white border-4 border-black text-black font-mono font-bold text-sm px-4 py-3" />
        <button className="px-6 py-3 bg-[#00E5FF] border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Copy</button>
      </div>
      <p className="text-xs font-bold bg-white inline-block px-1 border-2 border-black text-red-600 mt-2">Jaga kerahasiaan kunci ini.</p>
    </Card>
    <Card title="Advanced Configuration" desc="Pengaturan teknis tingkat lanjut.">
      <ToggleRow title="Hardware Acceleration" desc="Gunakan GPU untuk rendering lebih cepat" isOn={true} />
      <ToggleRow title="Enable Proxy Files" desc="Buat file proxy resolusi rendah" isOn={false} />
      
      <div className="flex items-center justify-between pt-6 border-t-4 border-black mt-6">
        <div className="w-2/3">
          <span className="block text-sm font-black uppercase text-black">Clear Cache</span>
          <span className="block text-xs font-bold text-gray-500 mt-1">Hapus file sementara (temp)</span>
        </div>
        <button className="px-4 py-3 bg-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F5A623] transition-colors">
          Clear Cache
        </button>
      </div>
    </Card>
    <Card title="Danger Zone" desc="Tindakan permanen dan destruktif.">
      <div className="flex items-center justify-between p-6 bg-red-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h4 className="font-black text-white uppercase text-lg">Delete Account</h4>
          <p className="text-xs font-bold text-black mt-1 bg-white inline-block px-1 border-2 border-black">Hapus seluruh proyek secara permanen.</p>
        </div>
        <button className="px-6 py-3 bg-black text-white border-4 border-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform">Delete Account</button>
      </div>
    </Card>
  </>
);
const SystemTab = () => {
  const [statusData, setStatusData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatusData(data.statuses);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchHealth();
  }, []);

  const handleFix = async (componentKey: string) => {
    try {
      await fetch('/api/system/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component: componentKey })
      });
      // Show toast or alert?
      alert('Perintah perbaikan telah dikirim! Jendela terminal baru mungkin akan terbuka.');
      // Wait a few seconds then refresh
      setTimeout(fetchHealth, 5000);
    } catch (e) {
      console.error(e);
      alert('Gagal mengirim perintah perbaikan.');
    }
  };

  const components = [
    { key: 'web', name: 'Next.js Frontend', desc: 'Port 3344', fix: 'Jalankan ./start.bat' },
    { key: 'videoService', name: 'NestJS Video Microservice', desc: 'Port 3345', fix: 'Pastikan NestJS berhasil di-compile saat menjalankan ./start.bat' },
    { key: 'aiEngine', name: 'Python FastAPI Engine', desc: 'Port 8000 (Whisper AI)', fix: 'Buka terminal baru: cd ai-engine && pip install -r requirements.txt && python -m uvicorn api:app --port 8000' },
    { key: 'ollama', name: 'Ollama Local LLM', desc: 'Port 11434 (Qwen2.5)', fix: 'Buka aplikasi Ollama di komputer Anda dan pastikan model qwen2.5:32b sudah di-pull' },
    { key: 'database', name: 'PostgreSQL & Redis', desc: 'Docker Services', fix: 'Pastikan Docker Desktop menyala dan kontainer audira-clip-ai berjalan' }
  ];

  return (
    <Card title="System Requirements Monitor" desc="Pantau status semua komponen yang diperlukan agar Audira berfungsi normal.">
      <div className="flex justify-end mb-4">
        <button onClick={fetchHealth} disabled={loading} className="px-4 py-2 bg-[#00E5FF] border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F5A623] transition-colors flex items-center gap-2 disabled:opacity-50">
          {loading ? 'Mengecek...' : 'Refresh Status'}
        </button>
      </div>
      <div className="space-y-4">
        {components.map((comp) => {
          const isActive = statusData?.[comp.key] === 'ACTIVE';
          return (
            <div key={comp.key} className={`border-4 border-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white`}>
              <div className="mb-2 sm:mb-0">
                <h3 className="font-black text-black uppercase">{comp.name}</h3>
                <p className="text-xs font-bold text-gray-500">{comp.desc}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`px-3 py-1 font-black text-xs uppercase border-2 border-black flex items-center gap-2 ${isActive ? 'bg-green-400 text-black' : 'bg-red-500 text-white'}`}>
                  {isActive ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
              {!isActive && statusData && (
                <div className="w-full mt-4 p-4 bg-[#FFEDF4] border-4 border-black border-dashed flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm font-bold text-black"><span className="text-red-600 uppercase font-black mr-1">Manual Fix:</span> {comp.fix}</p>
                  </div>
                  <button onClick={() => handleFix(comp.key)} className="px-4 py-2 bg-[#F5A623] border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all flex items-center gap-2 whitespace-nowrap">
                    <Zap className="w-4 h-4" /> Perbaiki Otomatis
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  
  // Settings State Management
  const [settings, setSettings] = useState({
    language: 'Bahasa Indonesia',
    theme: 'Light',
    timeZone: '(GMT+07:00) Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    aspectRatio: '16:9 (Widescreen)',
    showTips: true,
    autoSave: true,
    autoSaveInterval: '5 menit',
    exportRes: '1080p (1920x1080)',
    exportFps: '30 fps',
    exportFormat: 'MP4',
    exportQuality: 'High',
    profileName: 'Agus Dwi R',
    profileEmail: 'audira@clip.ai',
    profileRole: 'Lead Architect',
    aiModel: 'deepseek-r1:8b (Fastest)',
    openAiKey: '',
    grokKey: '',
    anthropicKey: '',
    subtitleFont: 'Plus Jakarta Sans',
    subtitleSize: 'Medium',
    autoSubtitles: true,
    aiHighlight: true,
    showWaveforms: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    // Load from local storage if exists
    const saved = localStorage.getItem('audira_settings');
    if (saved) {
      try { setSettings(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {}
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    localStorage.setItem('audira_settings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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
    { name: 'System', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  // Sync tab with URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const match = tabs.find(t => t.name.toLowerCase() === tabParam.toLowerCase());
      if (match) setActiveTab(match.name);
    }
  }, []);

  const handleTabChange = (name: string) => {
    setActiveTab(name);
    window.history.pushState(null, '', `/settings?tab=${name.toLowerCase()}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'General': return <GeneralTab settings={settings} onChange={handleSettingChange} />;
      case 'Profile': return <ProfileTab settings={settings} onChange={handleSettingChange} />;
      case 'Preferences': return <PreferencesTab settings={settings} onChange={handleSettingChange} />;
      case 'Storage': return <StorageTab />;
      case 'Billing': return <BillingTab />;
      case 'Integrations': return <IntegrationsTab />;
      case 'Notifications': return <NotificationsTab />;
      case 'Security': return <SecurityTab />;
      case 'Advanced': return <AdvancedTab />;
      case 'System': return <SystemTab />;
      default: return <GeneralTab settings={settings} onChange={handleSettingChange} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 bg-background min-h-screen text-black font-sans -m-8 p-12 flex flex-col">
        <div className="w-full flex-1 pb-32">
          
          <PageHero
            title="Settings"
            description="Manage your account and preferences."
            imageSrc="/images/hero_settings.png"
            imageAlt="Settings Hero"
          />

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Inner Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0 space-y-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => handleTabChange(tab.name)}
                    className={`w-full flex items-center gap-4 px-6 py-4 border-4 border-black text-left font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      isActive
                        ? 'bg-[#F5A623] text-black translate-y-[-2px] translate-x-[-2px]'
                        : 'bg-white text-black hover:bg-[#FFEDF4] hover:translate-y-[-2px] hover:translate-x-[-2px]'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" d={tab.icon} />
                    </svg>
                    {tab.name}
                  </button>
                );
              })}
            </aside>

            {/* Main Settings Content */}
            <div className="flex-1 space-y-8">
              {renderContent()}
            </div>
          </div>

          {/* Floating Save Bar */}
          {hasUnsavedChanges && (
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 ml-16 z-50 bg-[#00E5FF] border-4 border-black px-8 py-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-8 animate-in slide-in-from-bottom-10 fade-in">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 border-2 border-black rounded-full animate-pulse"></div>
                <span className="text-lg font-black uppercase">Unsaved Changes!</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => {
                  const saved = localStorage.getItem('audira_settings');
                  if (saved) setSettings(JSON.parse(saved));
                  setHasUnsavedChanges(false);
                }} className="px-6 py-3 bg-white border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors">Batal</button>
                <button onClick={handleSaveAll} className="px-6 py-3 bg-[#F5A623] border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all">Simpan Perubahan</button>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {showToast && (
            <div className="fixed top-8 right-8 z-50 bg-[#00E5FF] border-4 border-black px-6 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 animate-in slide-in-from-top-10 fade-in">
              <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-white">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-lg font-black uppercase">Disimpan!</span>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
// Force Next.js recompile
