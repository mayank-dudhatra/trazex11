import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { fetchContestLeaderboard } from "../../services/api";
import { stockSocket } from "../../services/stockSocket";

const PAGE_SIZE = 50;

const Leaderboard = () => {
  const location = useLocation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [flashRows, setFlashRows] = useState({});
  const flashTimers = useRef({});

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const contestId = searchParams.get("contestId") || localStorage.getItem("contestId") || "";

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return entries.slice(start, start + PAGE_SIZE);
  }, [entries, page]);

  useEffect(() => {
    if (!contestId) {
      setError("Contest ID missing. Open leaderboard from a contest.");
      return;
    }

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchContestLeaderboard(contestId);
        const data = response?.data || [];
        setEntries(data);
        setPage(1);
      } catch (fetchError) {
        setError(fetchError?.message || "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);

  useEffect(() => {
    if (!contestId) return;

    const handleUpdate = (payload) => {
      if (!payload) return;
      if (payload.contestId && payload.contestId !== contestId) return;

      if (Array.isArray(payload.entries)) {
        setEntries(payload.entries);
        return;
      }

      if (payload.teamId) {
        setEntries((prev) =>
          prev.map((entry) => {
            if (entry.teamId?._id?.toString() !== payload.teamId.toString()) {
              return entry;
            }
            const updated = { ...entry, ...payload };
            const rowKey = payload.teamId.toString();
            setFlashRows((current) => ({ ...current, [rowKey]: true }));
            if (flashTimers.current[rowKey]) {
              clearTimeout(flashTimers.current[rowKey]);
            }
            flashTimers.current[rowKey] = setTimeout(() => {
              setFlashRows((current) => ({ ...current, [rowKey]: false }));
            }, 800);
            return updated;
          })
        );
      }
    };

    stockSocket.onLeaderboardUpdate(handleUpdate);
    return () => {
      stockSocket.offLeaderboardUpdate(handleUpdate);
    };
  }, [contestId]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto w-full max-w-[1130px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Contest Leaderboard</h1>
            <div className="text-sm text-white/60">Contest ID: {contestId || "—"}</div>
          </div>

          {loading && <p className="mt-6 text-white/70">Loading leaderboard...</p>}
          {error && <p className="mt-6 text-red-400">{error}</p>}

          {!loading && !error && pageItems.length === 0 && (
            <p className="mt-6 text-white/70">No leaderboard data yet.</p>
          )}

          {!loading && !error && pageItems.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="grid grid-cols-[80px_1fr_1fr_140px_140px] gap-3 border-b border-white/10 px-6 py-3 text-sm uppercase tracking-wide text-white/60">
                <span>Rank</span>
                <span>User</span>
                <span>Team</span>
                <span>Points</span>
                <span>Winning</span>
              </div>

              <div className="divide-y divide-white/10">
                {pageItems.map((entry) => {
                  const rowKey = entry.teamId?._id?.toString() || entry._id?.toString();
                  const flash = rowKey && flashRows[rowKey];
                  const userName = entry.userId?.username || "Unknown";
                  const teamName = entry.teamId?.teamName || entry.teamId?._id?.slice(-6) || "—";
                  return (
                    <div
                      key={entry._id}
                      className={`grid grid-cols-[80px_1fr_1fr_140px_140px] gap-3 px-6 py-4 text-sm ${
                        flash ? 'bg-emerald-500/10' : ''
                      }`}
                    >
                      <span className="font-semibold text-white">#{entry.rank || "—"}</span>
                      <span className="text-white/80">{userName}</span>
                      <span className="text-white/70">{teamName}</span>
                      <span className="font-semibold text-white">{Number(entry.points || 0).toFixed(2)}</span>
                      <span className="text-white/80">
                        {entry.winningAmount ? `₹${entry.winningAmount}` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Prev
              </button>
              <span className="text-sm text-white/70">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Leaderboard;




// <div className="min-h-screen flex items-center justify-center bg-[#000000] p-6">
// <div className="w-[1130px] bg-[#1F1F1F] text-white rounded-2xl shadow-xl p-8">
//   <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
//     🏆 Leaderboard (26 FEB)
//   </h2>

//   {/* Leaderboard List */}
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5 }}
//     className="space-y-4"
//   >
//     {leaderboardData.map((user, index) => (
//       <motion.div
//         key={user.id}
//         whileHover={{ scale: 1.05 }}
//         className="flex items-center justify-between bg-[#292929] p-5 rounded-xl shadow-md transition-all"
//       >
//         <div className="flex items-center">
//           <span className="text-xl font-bold w-8">{index + 1}.</span>
//           <img
//             src={user.avatar}
//             alt={user.name}
//             className="w-14 h-14 rounded-full border-2 border-gray-500"
//           />
//           <div className="ml-4">
//             <h3 className="text-lg font-semibold">{user.name}</h3>
//             <p className="text-gray-400">{user.points} pts</p>
//           </div>
//         </div>
//         {/* Emoji-based Ranking */}
//         <span className="text-2xl">
//           {index === 0 ? "🏆" : index === 1 ? "🥇" : index === 2 ? "🥈" : "🥉"}
//         </span>
//       </motion.div>
//     ))}
//   </motion.div>
// </div>
// </div>