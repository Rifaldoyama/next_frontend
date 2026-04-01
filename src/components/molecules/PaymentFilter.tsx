import { Button } from "../atoms/Buttons";

interface Props {
  onTypeChange: (type: any) => void;
  onDateChange: (date: string) => void;
  onStatusChange: (status: any) => void;
}

export function PaymentFilter({
  onTypeChange,
  onDateChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-xl shadow-sm border">
      {/* STATUS */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">
          STATUS
        </label>
        <select
          onChange={(e) => onStatusChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="ALL">Semua</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* TIPE */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">
          TIPE PEMBAYARAN
        </label>
        <select
          onChange={(e) => onTypeChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="ALL">Semua</option>
          <option value="DP">DP</option>
          <option value="PELUNASAN">Pelunasan</option>
        </select>
      </div>

      {/* DATE */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">
          TANGGAL
        </label>
        <input
          type="date"
          onChange={(e) => onDateChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
