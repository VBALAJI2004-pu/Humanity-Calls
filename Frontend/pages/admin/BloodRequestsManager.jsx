import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTint, FaSearch, FaTrash, FaCheckCircle } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const BloodRequestsManager = () => {
  const { onStatusUpdate } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusTab, setStatusTab] = useState("open");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/blood-requests?status=${statusTab}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRequests(res.data || []);
      if (onStatusUpdate) onStatusUpdate();
    } catch (_err) {
      toast.error("Failed to fetch blood requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return requests;
    return requests.filter((r) => {
      return (
        r.verifiedPersonName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.patientName?.toLowerCase().includes(q) ||
        r.bloodGroup?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery]);

  const updateStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/blood-requests/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Status updated");
      fetchRequests();
    } catch (_err) {
      toast.error("Failed to update status");
    }
  };

  const deleteRequest = async (id) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      await axios.delete(`${import.meta.env.VITE_API_URL}/blood-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchRequests();
    } catch (_err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-blood flex items-center gap-3">
            <FaTint /> Blood Requests
          </h2>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-body/40" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2 border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-2 bg-bg p-1.5 rounded-2xl">
              {["open", "closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusTab(s)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all capitalize text-sm ${
                    statusTab === s ? "bg-blood text-white shadow-md" : "text-text-body/60 hover:text-blood hover:bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blood/30 border-t-blood rounded-full animate-spin"></div>
            <p className="text-text-body/60 font-medium italic">Loading blood requests...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-text-body/40 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-4 py-4">Submitted By</th>
                  <th className="px-4 py-4">Patient</th>
                  <th className="px-4 py-4">Blood</th>
                  <th className="px-4 py-4">Hospital</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-bg/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-text-body">{r.verifiedPersonName}</div>
                      <div className="text-[11px] text-text-body/50 font-bold">{r.phone}</div>
                      <div className="text-[11px] text-text-body/50">{r.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold">{r.patientName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-blood/10 text-blood font-black text-[11px] border border-blood/20">
                        {r.bloodGroup}
                      </span>
                      <div className="text-[11px] text-text-body/50 mt-1">{r.bloodRequestType}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-[11px] text-text-body/70 max-w-[260px]">
                        {r.hospitalAddressWithPincode}
                      </div>
                      {r.requestImageUrl ? (
                        <a className="text-[11px] font-bold text-primary hover:underline" href={r.requestImageUrl} target="_blank" rel="noreferrer">
                          View attachment
                        </a>
                      ) : (
                        <div className="text-[11px] text-text-body/30 italic">No attachment</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-[11px] text-text-body/70 max-w-[220px]">{r.locationAddress}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-[11px] text-text-body/50 font-bold">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString("en-GB") : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {statusTab === "open" && (
                          <button
                            onClick={() => updateStatus(r._id, "closed")}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-all"
                            title="Mark closed"
                          >
                            <FaCheckCircle /> Close
                          </button>
                        )}
                        <button
                          onClick={() => deleteRequest(r._id)}
                          className="p-2 text-blood hover:bg-blood/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <FaTint size={64} className="mx-auto text-blood/10 mb-6" />
            <h3 className="text-2xl font-bold text-text-body mb-2">No {statusTab} blood requests</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequestsManager;

