const BASE_URL = "http://localhost:5000/api";

export const taskService = {
  // --- FETCHING ---
  fetchTasks: async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

    // --- TASKS ---
