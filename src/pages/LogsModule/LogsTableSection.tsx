import type { LogItem } from "./LogsMain";

interface Props {
  logs: LogItem[];
}

const getBadge = (type: string) => {
  switch (type) {
    case "Asset":
      return "bg-blue-100 text-blue-700 border border-blue-300";

    case "Maintenance":
      return "bg-green-100 text-green-700 border border-green-300";

    case "Incident":
      return "bg-red-100 text-red-700 border border-red-300";

    case "Lost & Found":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";

    case "User":
      return "bg-purple-100 text-purple-700 border border-purple-300";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export default function LogsTableSection({
  logs,
}: Props) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-white">
            <th className="px-5 py-4 text-left text-xs font-semibold text-[#475569]">
              TIMESTAMP
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-[#475569]">
              USER
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-[#475569]">
              TYPE
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-[#475569]">
              ACTION
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold text-[#475569]">
              DETAILS
            </th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-gray-500"
              >
                No logs found.
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="px-5 py-5 text-sm">
                  {log.timestamp}
                </td>

                <td className="px-5 py-5 text-sm">
                  {log.user}
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${getBadge(log.type)}
                    `}
                  >
                    {log.type}
                  </span>
                </td>

                <td className="px-5 py-5 text-sm font-medium">
                  {log.action}
                </td>

                <td className="px-5 py-5 text-sm text-[#64748B]">
                  {log.details}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}