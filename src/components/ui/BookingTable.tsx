export default function BookingTable({ bookings }: { bookings: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest">
              Destination
            </th>
            <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest">
              Status
            </th>
            <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest">
              Price
            </th>
            <th className="pb-4 font-black text-slate-400 text-xs uppercase tracking-widest text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {bookings.map((booking) => (
            <tr key={booking._id} className="group">
              <td className="py-6">
                <p className="font-bold text-slate-900">
                  {booking.itemId?.title || "Trip Details"}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </td>
              <td className="py-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    booking.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="py-6 font-bold text-slate-900">
                ${booking.totalPrice}
              </td>
              <td className="py-6 text-right">
                <button className="text-blue-600 font-bold text-sm hover:underline">
                  View Ticket
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
