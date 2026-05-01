import React, { useState, useEffect } from "react";
import { SidebarNavigationSection } from "../components/SidebarNavigationSection";

// --- Types ---
interface Task {
  _id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  timeRange: string;
  zone: string;
  status: "Completed" | "Pending";
  date: string;
  completedAt?: string;
}

export const TaskMonitorPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from MongoDB via your API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Derived stats
  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const pendingCount = tasks.filter(t => t.status === "Pending").length;

  return (
    <div className="flex h-screen bg-[#f4f5f6] overflow-hidden">
      <SidebarNavigationSection />

      <div className="flex flex-col flex-1 min-w-0 ml-[240px] overflow-y-auto">
        {/* Header */}
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
          {/* Stats Cards - Completion Rate Removed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[20px] border border-[#e8e8e8] flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-xs text-gray-500 font-medium">Pending Tasks</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-[20px] p-6 border border-[#e8e8e8] mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button className="px-6 py-2 bg-[#0a2e27] text-white rounded-lg font-medium">All Tasks</button>
                <button className="px-6 py-2 bg-[#f4f5f6] text-gray-600 rounded-lg font-medium hover:bg-gray-200">Pending</button>
                <button className="px-6 py-2 bg-[#f4f5f6] text-gray-600 rounded-lg font-medium hover:bg-gray-200">Completed</button>
              </div>
              <button className="bg-[#0a2e27] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-[#08241f] transition-colors">
                <span className="text-xl">+</span> New Task
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((f) => (
                <button key={f} className={`text-sm font-semibold px-3 py-1 rounded ${f === 'All' ? 'bg-purple-600 text-white' : 'text-blue-500 hover:bg-blue-50'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-[24px] border border-[#e8e8e8] overflow-hidden">
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No tasks found.</div>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 ${task.status === 'Completed' ? 'text-green-500' : 'text-gray-400'}`}>
                        {task.status === 'Completed' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold text-lg ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-[#1f1f1f]'}`}>
                            {task.title}
                          </h4>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded uppercase">
                            {task.frequency}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                             {task.timeRange}
                          </span>
                          <span className="flex items-center gap-1">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                             Zone: {task.zone}
                          </span>
                          {task.completedAt && (
                            <span className="text-green-600 font-medium">Completed at {task.completedAt}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {task.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
    </div>
  );
};

export default TaskMonitorPage;