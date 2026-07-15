export default function LogsStatsSection() {
  const stats = [
    { label: "Asset", value: 2 },
    { label: "Incident", value: 2 },
    { label: "Maintenance", value: 1 },
    { label: "Lost & Found", value: 1 },
    { label: "User", value: 1 },
    { label: "System", value: 1 },
  ];

  return (
    <div className="grid grid-cols-6 gap-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="
            bg-white
            border
            border-[#E5E7EB]
            rounded-xl
            shadow-sm
            p-4
          "
        >
          <p className="text-[11px] text-[#64748B]">
            {item.label}
          </p>

          <p className="mt-1 text-[28px] font-semibold text-[#0F172A]">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}