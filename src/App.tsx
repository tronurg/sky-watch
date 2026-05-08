import React, { useState } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  User,
  Search,
  Plus,
  Cpu,
  Target,
  Shield,
  Eye,
  Maximize2
} from 'lucide-react';
import VisualTracker from './components/VisualTracker';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'intercept' | 'fleet' | 'intelligence'>('intercept');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar Rail */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl z-50">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black mb-12 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <Cpu className="w-6 h-6" />
        </div>

        <nav className="flex-1 flex flex-col gap-6">
          <SidebarIcon 
            icon={<Target className="w-5 h-5" />} 
            active={activeTab === 'intercept'} 
            onClick={() => setActiveTab('intercept')}
          />
          <SidebarIcon 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            active={activeTab === 'fleet'} 
            onClick={() => setActiveTab('fleet')}
          />
          <SidebarIcon 
            icon={<Activity className="w-5 h-5" />} 
            active={activeTab === 'intelligence'} 
            onClick={() => setActiveTab('intelligence')}
          />
        </nav>

        <div className="mt-auto flex flex-col gap-6 mb-4">
          <SidebarIcon icon={<Bell className="w-5 h-5" />} />
          <SidebarIcon icon={<Settings className="w-5 h-5" />} />
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all">
            <User className="w-5 h-5 text-zinc-500" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold tracking-widest uppercase italic text-emerald-500">
              SkyWatch Interceptor <span className="text-zinc-600 mx-2">//</span> Neural Eye v4
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-zinc-900/50 border border-zinc-800 rounded-full px-3 py-1.5 gap-2 w-64 ring-1 ring-zinc-800/50">
              <Search className="w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Query classification db..." 
                className="bg-transparent border-none outline-none text-xs w-full text-zinc-300 placeholder:text-zinc-600"
              />
            </div>
            <div className="flex gap-2">
               <button className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
                  <Maximize2 className="w-4 h-4" />
               </button>
               <button className="bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold uppercase py-2 px-6 rounded transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                Deploy Countermeasures
              </button>
            </div>
          </div>
        </header>

        {/* Content Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 bg-zinc-950 relative overflow-hidden">
            {/* Scan Line Animation */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
            
            <VisualTracker />
          </div>

          {/* Right Panel - Intelligence Feed */}
          <aside className="w-[380px] bg-zinc-950 border-l border-zinc-800 flex flex-col font-mono">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest italic font-bold">Intelligence Feed</span>
                <h2 className="text-xl font-bold mt-2 text-zinc-100 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  Live Intercept
                </h2>
             </div>

             <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <section className="space-y-4">
                   <div className="flex justify-between items-center bg-zinc-900/30 p-3 rounded border border-zinc-800">
                      <div>
                         <p className="text-[9px] text-zinc-500 uppercase">Detection Confidence</p>
                         <p className="text-lg font-bold text-emerald-500">OPTIMAL</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-zinc-500 uppercase">Neural Load</p>
                         <p className="text-lg font-bold text-zinc-300">12.4%</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
                         <span>Spectral analysis</span>
                         <span className="text-emerald-500">Synced</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          className="h-full bg-emerald-500" />
                      </div>
                   </div>
                </section>

                <section className="space-y-4 pt-6 border-t border-zinc-900">
                   <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Intercept Logs</h3>
                   <div className="space-y-3">
                      <LogEntry time="19:51:02" msg="Neural engine handshake successful" type="success" />
                      <LogEntry time="19:51:05" msg="Camera matrix calibrated to 4K" type="info" />
                      <LogEntry time="19:51:12" msg="Awaiting visual object signature..." type="warning" />
                   </div>
                </section>
             </div>

             <div className="p-6 bg-black border-t border-zinc-800">
                <div className="flex items-center gap-3 text-red-500 bg-red-500/10 p-3 border border-red-500/30 rounded">
                   <Shield className="w-5 h-5" />
                   <div>
                      <p className="text-[10px] font-bold uppercase">Priority Alert</p>
                      <p className="text-[11px] leading-tight">Unauthorized aerial units in sector will be flagged automatically.</p>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group ${
        active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50'
      }`}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-[-1.5rem] w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_#10b981]"
        />
      )}
    </button>
  );
}

function LogEntry({ time, msg, type }: { time: string; msg: string; type: 'success' | 'info' | 'warning' | 'error' }) {
  const colors = {
    success: 'text-emerald-500',
    info: 'text-zinc-500',
    warning: 'text-amber-500',
    error: 'text-red-500'
  };
  return (
    <div className="flex gap-2 text-[9px] font-mono leading-tight">
       <span className="text-zinc-700">[{time}]</span>
       <span className={colors[type]}>{msg}</span>
    </div>
  );
}
