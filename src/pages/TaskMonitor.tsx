import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";
import { taskService } from "../services/TaskServices";

// --- Types ---
interface Task {
  _id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  startTime: string; // Updated to string for time input compatibility
  endTime: string;   // Updated to string for time input compatibility
  area: string;
  status: "Completed" | "Pending";
  date: string;
  completedAt?: string;
}

export const TaskMonitorPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [freqFilter, setFreqFilter] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    area: "",
    frequency: "Daily",
    startTime: "",
    endTime: "",
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: "Completed" | "Pending") => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
    try {
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
      await taskService.updateTaskStatus(id, newStatus);
    } catch (error) {
      console.error("Update failed:", error);
      loadTasks();
    }
  };

  const handleArchive = async (id: string) => {
    if (window.confirm("Archive this task?")) {
      try {
        await taskService.archiveTask(id);
        setTasks(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error("Archive failed:", error);
      }
    }
  };

const handleAddTask = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate that a zone was actually selected
  if (!newTask.area) {
    alert("Please select a valid Zone/Area.");
    return;
  }

  // Helper to convert "HH:mm" string to a Number (minutes from midnight)
  // This satisfies the Backend Schema requirement for Number
  const timeToNumber = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  try {
    const taskToSave = {
      title: newTask.title,
      frequency: newTask.frequency,
      area: newTask.area,
      // Convert strings to numbers to prevent 400 Error
      startTime: timeToNumber(newTask.startTime), 
      endTime: timeToNumber(newTask.endTime),
      status: "Pending", 
      date: new Date().toISOString().split('T')[0], // Matches backend default
      isArchived: false
    };

    console.log("Sending to backend:", taskToSave); 
    
    await taskService.createTask(taskToSave);
    
    // Clear the form and refresh
    setNewTask({
      title: "",
      area: "",
      frequency: "Daily",
      startTime: "",
      endTime: "",
    });
    setIsModalOpen(false);
    loadTasks(); 
  } catch (error) {
    console.error("Failed to add task:", error);
    alert("Backend rejected the task. Check the console for validation details.");
  }
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
            <button className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
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
                className="bg-[#0a2e27] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-[#08241f] transition-colors"
              >
                <span className="text-xl">+</span> New Task
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFreqFilter(f)}
                  className={`text-sm font-semibold px-3 py-1 rounded transition-colors ${freqFilter === f ? 'bg-purple-600 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Task List Table/Cards */}
          <div className="bg-white rounded-[24px] border border-[#e8e8e8] overflow-hidden">
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tasks...</div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No tasks found.</div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={() => handleToggleStatus(task._id, task.status)}
                        className={`mt-1 transition-colors ${task.status === 'Completed' ? 'text-green-500' : 'text-gray-400 hover:text-green-400'}`}
                      >
                        {task.status === 'Completed' ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold text-lg transition-all ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-[#1f1f1f]'}`}>
                            {task.title}
                          </h4>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded uppercase">
                            {task.frequency}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                             {task.startTime} - {task.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                             Area: {task.area}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {task.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleArchive(task._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1f1f1f]">New Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Task Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Clean Powerlifting Racks"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0a2e27] outline-none transition-all"
                    required
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Frequency</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0a2e27] outline-none bg-white"
                      onChange={(e) => setNewTask({...newTask, frequency: e.target.value as any})}
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Area</label>
                    {/* FIXED: Zones from image_5c9cbc.png */}
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0a2e27] outline-none bg-white"
                      onChange={(e) => setNewTask({...newTask, area: e.target.value})}
                    >
                      <option value="">Select zone</option>
                      <option value="Mezzanine">Mezzanine</option>
                      <option value="Powerlifting Area">Powerlifting Area</option>
                      <option value="Open WOD Area">Open WOD Area</option>
                      <option value="CrossFit Area">CrossFit Area</option>
                      <option value="Café">Café</option>
                      <option value="General Storage">General Storage</option>
                      <option value="Maintenance Storage">Maintenance Storage</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0a2e27]" 
                      onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0a2e27]" 
                      onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-[#0a2e27] text-white hover:bg-[#08241f] transition-all shadow-lg shadow-[#0a2e27]/20"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMonitorPage;