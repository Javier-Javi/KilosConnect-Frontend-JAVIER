export type LostAndFoundItem = {
  id: string;
  description: string;
  location: string;
  dateFound: string;
  status: "Claimed" | "Unclaimed";
};

// TODO: Replace with MongoDB fetch – e.g. GET /api/lost-and-found
const lostAndFoundItems: LostAndFoundItem[] = [];

export const LostAndFoundTrackingSection : React.FC = () => {
  const unclaimedCount = lostAndFoundItems.filter((i) => i.status === "Unclaimed").length;

  return (
    <section
      aria-labelledby="lost-and-found-heading"
      className="w-full bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-wrap gap-3">
        <h2
          id="lost-and-found-heading"
          className="[font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-xl m-0 p-0"
        >
          Lost and Found
        </h2>
        <div className="flex flex-col items-center gap-1">
          <span className="[font-family:'Poppins',Helvetica] font-semibold text-2xl leading-none text-[#e07000]">
            {unclaimedCount}
          </span>
          <span className="[font-family:'Poppins',Helvetica] font-normal text-[#888] text-[11px] whitespace-nowrap">
            Unclaimed Items
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#efefef]">
              {["ID", "Item Description", "Location Found", "Date Found", "Status"].map((col) => (
                <th
                  key={col}
                  className="[font-family:'Poppins',Helvetica] font-semibold text-[#1a1a1a] text-sm text-left py-2 pr-6 last:pr-0 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lostAndFoundItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-[#bbb] [font-family:'Poppins',Helvetica] text-sm"
                >
                  No lost and found data available.
                </td>
              </tr>
            ) : (
              lostAndFoundItems.map((item) => (
              <tr key={item.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#555] text-sm">{item.id}</td>
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#1a1a1a] text-sm">{item.description}</td>
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#555] text-sm">{item.location}</td>
                <td className="py-2.5 pr-6 [font-family:'Poppins',Helvetica] text-[#555] text-sm whitespace-nowrap">{item.dateFound}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] [font-family:'Poppins',Helvetica] font-medium whitespace-nowrap ${
                      item.status === "Unclaimed"
                        ? "bg-[#fff0e0] text-[#e07000]"
                        : "bg-[#e0f5e9] text-[#1b9640]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
};