import React, { useMemo, useState } from "react";
import { SidebarNavigationSection } from "../../components/SidebarNavigationSection";
import { useAuth } from "../../Hooks/useAuth";

import LogsHeaderSection from "./LogsHeaderSection";
import LogsFilterSection from "./LogsFilterSection";
import LogsStatsSection from "./LogsStatsSection";
import LogsTableSection from "./LogsTableSection";

export interface LogItem {
  timestamp: string;
  user: string;
  type: string;
  action: string;
  details: string;
}

export default function LogsMain() {
  const { role } = useAuth();

  const userRole =
    (role ?? "custodian") as React.ComponentProps<
      typeof SidebarNavigationSection
    >["userRole"];

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  const logs: LogItem[] = [
    {
      timestamp: "2024-05-17 14:32:15",
      user: "Sarah Admin",
      type: "Asset",
      action: "Asset Created",
      details:
        "Created new asset: Olympic Barbell #46 in Powerlifting Area",
    },
    {
      timestamp: "2024-05-17 14:15:42",
      user: "John Custodian",
      type: "Maintenance",
      action: "Maintenance Completed",
      details:
        "Completed maintenance verification for Mezzanine zone with photo evidence",
    },
    {
      timestamp: "2024-05-17 13:48:21",
      user: "Maria Staff",
      type: "Incident",
      action: "Incident Reported",
      details:
        "Reported new incident: Cable fraying on Cable Machine B (INC-002)",
    },
    {
      timestamp: "2024-05-17 12:22:33",
      user: "John Custodian",
      type: "Lost & Found",
      action: "Item Added",
      details:
        "Added lost item: Black Water Bottle found in Mezzanine",
    },
    {
      timestamp: "2024-05-17 11:05:18",
      user: "Sarah Admin",
      type: "User",
      action: "User Created",
      details:
        "Created new custodian account: Mike Rodriguez",
    },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.type.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType === "All" ||
        log.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [logs, search, selectedType]);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <SidebarNavigationSection userRole={userRole} />

      <main className="ml-[240px] p-6">
        <div className="space-y-4">
          <LogsHeaderSection />

          <LogsFilterSection
            search={search}
            setSearch={setSearch}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <LogsStatsSection />

          <LogsTableSection logs={filteredLogs} />
        </div>
      </main>
    </div>
  );
}