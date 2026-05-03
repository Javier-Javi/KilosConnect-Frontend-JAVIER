import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";

// --- Types ---
interface Task {
  _id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  startTime: string | number; 
  endTime: string | number;   
  area: string;
  status: "Completed" | "Pending";
  date: string;
}

export const TaskMonitorPage: React.FC = () => {
  // --- MOCK DATA ---
  const [tasks, setTasks] = useState<Task[]>([
    { _id: "1", title: "Clean Powerlifting Racks", frequency: "Daily", startTime: "08:00", endTime: "09:00", area: "Powerlifting Area", status: "Completed", date: "2026-05-03" },
    { _id: "2", title: "Check Inventory - Cafe", frequency: "Weekly", startTime: "10:00", endTime: "11:00", area: "Café", status: "Pending", date: "2026-05-03" },
    { _id: "3", title: "Sanitize Yoga Mats", frequency: "Daily", startTime: "13:00", endTime: "14:00", area: "Mezzanine", status: "Pending", date: "2026-05-03" }
  ]);

  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [freqFilter, setFreqFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTask, setNewTask] = useState({
    title: "",
    area: "",
    frequency: "Daily",
    startTime: "",
    endTime: "",
  });

  // --- Handlers ---
  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t._id === id ? { ...t, status: t.status === "Pending" ? "Completed" : "Pending" } : t
    ));
  };

  const handleArchive = (id: string) => {
    if (window.confirm("Archive this task?")) {
      setTasks(prev => prev.filter(t => t._id !== id));
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const taskEntry: Task = {
      _id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      frequency: newTask.frequency as any,
      area: newTask.area,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
    };
    setTasks([taskEntry, ...tasks]);
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesFreq = freqFilter === "All" || task.frequency === freqFilter;
    return matchesStatus && matchesFreq;
  });

  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const pendingCount = tasks.filter(t => t.status === "Pending").length;

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      <SidebarNavigationSection />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-8">
          <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#1f1f1f] text-[36px]">
            Task Tracking
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
              <img src="https://c.animaapp.com/C3N4JJvt/img/profile@2x.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[20px] border border-[#e8e8e8] flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-xs text-gray-500 font-medium">Completed Today</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[20px] border border-[#e8e8e8] flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-xs text-gray-500 font-medium">Pending Tasks</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-[#e8e8e8] mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                {(['All', 'Pending', 'Completed'] as const).map(s => (
                  <button 
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${statusFilter === s ? 'bg-[#0a2e27] text-white' : 'bg-[#f4f5f6] text-gray-600 hover:bg-gray-200'}`}
                  >
                    {s} Tasks
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0a2e27] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium"
              >
                <span className="text-xl">+</span> New Task
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFreqFilter(f)}
                  className={`text-sm font-semibold px-3 py-1 rounded ${freqFilter === f ? 'bg-purple-600 text-white' : 'text-blue-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#e8e8e8] overflow-hidden">
            <div className="p-6 space-y-4">
              {filteredTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => handleToggleStatus(task._id)}
                      className={`mt-1 ${task.status === 'Completed' ? 'text-green-500' : 'text-gray-400'}`}
                    >
                      {task.status === 'Completed' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold text-lg ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-[#1f1f1f]'}`}>
                          {task.title}
                        </h4>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded uppercase">
                          {task.frequency}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">🕒 {task.startTime} - {task.endTime}</span>
                        <span className="flex items-center gap-1">📍 {task.area}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-400 text-sm">📅 {task.date}</span>
                    <button onClick={() => handleArchive(task._id)} className="text-gray-400 hover:text-red-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1f1f1f]">New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-5">
              <input 
                type="text" placeholder="Task Title" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0a2e27]"
                required onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" onChange={(e) => setNewTask({...newTask, frequency: e.target.value as any})}>
                  <option>Daily</option><option>Weekly</option><option>Monthly</option>
                </select>
                <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" onChange={(e) => setNewTask({...newTask, area: e.target.value})}>
                  <option value="">Select Area</option>
                  <option value="Mezzanine">Mezzanine</option>
                  <option value="Powerlifting Area">Powerlifting Area</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" onChange={(e) => setNewTask({...newTask, startTime: e.target.value})} />
                <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" onChange={(e) => setNewTask({...newTask, endTime: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 rounded-xl font-semibold bg-[#0a2e27] text-white">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMonitorPage;