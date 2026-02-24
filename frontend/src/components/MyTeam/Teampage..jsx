import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { fetchTeamById, fetchTeamsByContest } from "../../services/api";
import { stockSocket } from "../../services/stockSocket";

const MyTeamPage = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);
  const flashTimer = useRef(null);

  const teamId = localStorage.getItem("teamId") || "";
  const contestId = localStorage.getItem("contestId") || "";

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      setError("");
      try {
        if (teamId) {
          const response = await fetchTeamById(teamId);
          if (response?.team) {
            setTeam(response.team);
            return;
          }
        }

        if (contestId) {
          const response = await fetchTeamsByContest(contestId);
          const teams = response?.teams || [];
          if (teams.length) {
            const selected = teamId
              ? teams.find((t) => t._id?.toString() === teamId)
              : teams[0];
            setTeam(selected || teams[0]);
            return;
          }
        }

        setTeam(null);
        setError("No team data available.");
      } catch (loadError) {
        setError(loadError?.message || "Failed to load team.");
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId, contestId]);

  useEffect(() => {
    const handleTeamUpdate = (payload) => {
      if (!payload?.teamId) return;
      if (teamId && payload.teamId.toString() !== teamId.toString()) return;

      setTeam((prev) => (prev ? { ...prev, ...payload } : prev));
      setFlash(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 800);
    };

    stockSocket.onTeamUpdate(handleTeamUpdate);
    return () => {
      stockSocket.offTeamUpdate(handleTeamUpdate);
    };
  }, [teamId]);

  const stockRows = useMemo(() => team?.stocks || [], [team]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto w-full max-w-[1130px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">My Team</h1>
            <div className="text-sm text-white/60">
              Live Points: {team?.totalPoints?.toFixed?.(2) ?? "0.00"}
            </div>
          </div>

          {loading && <p className="mt-6 text-white/70">Loading team...</p>}
          {error && <p className="mt-6 text-red-400">{error}</p>}

          {!loading && !error && team && (
            <div className={`mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 ${flash ? 'ring-2 ring-emerald-400/60' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-lg font-semibold">Team {team._id?.slice(-6)}</div>
                <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100">
                  Live updating
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {stockRows.map((stock) => {
                  const isCaptain = team.captain?.stockSymbol === stock.stockSymbol;
                  const isVice = team.viceCaptain?.stockSymbol === stock.stockSymbol;
                  return (
                    <div
                      key={`${team._id}-${stock.stockSymbol}`}
                      className={`rounded-xl border border-white/10 bg-black/30 p-4 ${
                        isCaptain ? 'ring-1 ring-emerald-400/70' : isVice ? 'ring-1 ring-blue-400/70' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-semibold">{stock.stockSymbol}</div>
                          <div className="text-xs text-white/60">{stock.action}</div>
                        </div>
                        {isCaptain && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-100">Captain 2x</span>
                        )}
                        {isVice && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-100">Vice 1.5x</span>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-white/70">Stock points: Live update</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyTeamPage;
