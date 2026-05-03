const BASE_URL = "http://localhost:5000/api";

export const inventoryService = {
  // --- FETCHING ---
  fetchAssets: async () => {
    const res = await fetch(`${BASE_URL}/assets`);
    if (!res.ok) throw new Error("Failed to fetch assets");
    return res.json();
  },

  fetchFilteredAssets: async (filters: { condition?: string; area?: string }) => {
    const params = new URLSearchParams();
    if (filters.condition && filters.condition !== "All") {
      params.append("condition", filters.condition);
    }
    if (filters.area && filters.area !== "All") {
      params.append("area", filters.area);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${BASE_URL}/assets${queryString}`);
    if (!res.ok) throw new Error("Failed to fetch filtered assets");
    return res.json();
  },

  fetchSummary: async () => {
    const res = await fetch(`${BASE_URL}/inventory/summary`);
    if (!res.ok) throw new Error("Failed to fetch inventory summary");
    return res.json();
  },
  
  fetchConsumables: async () => {
    const res = await fetch(`${BASE_URL}/consumables`);
    if (!res.ok) throw new Error("Failed to fetch consumables");
    return res.json();
  },

  // --- ASSETS ---
  updateAssetCondition: async (id: string, condition: string) => {
    const response = await fetch(`${BASE_URL}/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition }),
    });
    return response.json();
  },

  addAsset: async (data: any) => {
    const response = await fetch(`${BASE_URL}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add asset");
    return response.json();
  },

  // FIXED: Changed to PATCH and sends isArchived: true
  archiveAsset: async (id: string) => {
    const response = await fetch(`${BASE_URL}/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: true }),
    });
    if (!response.ok) throw new Error("Failed to archive asset");
    return response.json();
  },

  // --- CONSUMABLES ---
  updateConsumableQuantity: async (id: string, quantity: number) => {
    const response = await fetch(`${BASE_URL}/consumables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update consumable");
    return response.json();
  },

  addConsumable: async (data: any) => {
    const response = await fetch(`${BASE_URL}/consumables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add consumable");
    return response.json();
  },

  // FIXED: Changed to PATCH and sends isArchived: true
  archiveConsumable: async (id: string) => {
    const response = await fetch(`${BASE_URL}/consumables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: true }),
    });
    if (!response.ok) throw new Error("Failed to archive consumable");
    return response.json();
  },
};

export const fetchAssets = inventoryService.fetchAssets;
export const fetchConsumables = inventoryService.fetchConsumables;
export const fetchSummary = inventoryService.fetchSummary;