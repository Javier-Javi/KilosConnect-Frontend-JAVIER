const BASE_URL = "http://localhost:5000/api";

export const taskService = {
  // Get all active tasks for the monitor
  fetchTasks: async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  // Update status (Mark as Completed/Pending)
  // Fixed the syntax error from image_5cb7df.png by using method shorthand
  updateTaskStatus: async (id: string, status: "Completed" | "Pending") => {
    const completedAt = status === "Completed" ? new Date().toLocaleTimeString() : undefined;
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, completedAt }),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  },

  // Archive a task (matches the archiving logic in InventoryPage)
  archiveTask: async (id: string) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: true }),
    });
    if (!res.ok) throw new Error("Failed to archive task");
    return res.json();
  },

  createTask: async (taskData: any) => {
  const res = await fetch(`${BASE_URL}/tasks`, { // Ensure BASE_URL is correct!
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
},

};