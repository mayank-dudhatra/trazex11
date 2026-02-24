

import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import apiClient from "../../services/apiClient";
import { fetchContestLeaderboard } from "../../services/api";
import { stockSocket } from "../../services/stockSocket";

// ProgressBar Component
const ProgressBar = ({ spotsLeft, totalSpots }) => {
  const progress = ((totalSpots - spotsLeft) / totalSpots) * 100;

  return (
    <div className="w-full max-w-[350px] self-center">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span className="text-green-400">{spotsLeft.toLocaleString()}</span>
        <span>{totalSpots.toLocaleString()}</span>
      </div>
      <div className="relative w-full h-3 bg-gray-700 rounded-full">
        <div
          className="h-full bg-green-400 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// EntryFeeSection Component
const EntryFeeSection = ({ entryFee, firstPrize }) => {
  return (
    <div className="flex flex-col justify-center items-center text-white">
      <div className="flex flex-col justify-center items-center px-8 py-2 w-full text-3xl font-bold leading-none rounded-lg bg-emerald-400 bg-opacity-10 max-md:px-5">
        <div className="flex items-center text-[#c5c5c5] justify-center">
          <img
            className="h-[45px] w-[45px]"
            src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1739714517/lupnj6inuaripexhfc4w.png"
            alt="coins"
          />
          <span>Entry ₹{entryFee}</span>
        </div>
        <h2 className="text-[#c5c5c5] font-medium mt-2">Top Prize ₹{firstPrize}</h2>
      </div>
    </div>
  );
};

// GuaranteedPlusHeader Component
const GuaranteedPlusHeader = ({ name, entryFee, spotsLeft, totalSpots, prize, firstPrize }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-between self-center w-full max-w-[1241px] max-md:max-w-full">
      <div className="flex flex-col self-start max-md:max-w-full">
        <div className="flex gap-5 self-start text-xl font-semibold text-white">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1adff2cb2f31b63bd5b8b039a8e7127ca3fd67b86738bdab4faf6ea4085527cf"
            className="object-contain shrink-0 my-auto aspect-[1.05] w-[21px]"
            alt="Contest Icon"
          />
          <h1>{name}</h1>
        </div>
        <div className="flex flex-wrap gap-5">
          <p className="mt-2 text-5xl font-bold leading-none text-white max-md:text-4xl">
            ₹{prize}
          </p>
        </div>
      </div>
      <ProgressBar spotsLeft={spotsLeft} totalSpots={totalSpots} />
      <EntryFeeSection firstPrize={firstPrize} entryFee={entryFee} />
    </div>
  );
};

// StatsSection Component
const StatsSection = ({ prize, firstPrize, maximumTeam, winPercentage }) => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-5 items-center justify-between px-7 py-1.5 mt-4 w-full font-medium rounded-lg bg-neutral-800 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-10 text-2xl max-md:max-w-full">
        <div className="flex flex-auto gap-5 items-center self-start text-stone-300">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8ead62c132ac2c7e2d772a0bbf895d37c7840641f982fac36ecf0a2d4cac257"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[35px]"
            alt="Stats Icon"
          />
          <span className="self-stretch leading-relaxed">₹{firstPrize}</span>
          <div className="shrink-0 self-stretch my-auto w-px h-9 border border-white border-solid" />
          <span className="flex items-center justify-center w-8 h-8 text-lg font-semibold text-white border-2 border-stone-300 rounded-lg">
            M
          </span>
          <span className="self-stretch my-auto leading-tight">Upto {maximumTeam}</span>
          <div className="shrink-0 self-stretch my-auto w-px h-9 border border-white border-solid" />
        </div>
        <div className="flex gap-4 items-center justify-center -ml-4">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3112/3112946.png"
            alt="Trophy"
            className="object-contain shrink-0 my-auto w-8"
          />
          <span className="text-white">{winPercentage}%</span>
        </div>
      </div>
      <div className="flex gap-7 self-start text-2xl leading-loose text-white">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/33d91e4d51c1d362e15a4dfa163f2ee77bde5b2a6d37d4eccdfc4997fb00ea46"
          className="object-contain shrink-0 my-auto w-8 aspect-[1.68]"
          alt="Total Amount Icon"
        />
        <span>₹{prize}</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/41ccfc38390615e5dcc4424b858b95819238dc694198d88f05c1c2f6787e3172"
          alt="coin"
          className="object-contain shrink-0 my-auto w-8"
        />
      </div>
    </div>
  );
};

// TeamInfo Component
const TeamInfo = ({ onToggle, numTeams }) => {
  return (
    <div className="max-w-[1341px] ">
      <div
        className="flex flex-wrap gap-5 justify-between text-2xl leading-loose w-full bg-[linear-gradient(to_left,#DFDFDF_0%,#D0D0D0_25%,#848484_100%)] rounded-lg px-2 py-1 shadow-md relative cursor-pointer"
        onClick={onToggle}
      >
        <div className="text-white px-4 font-semibold">
          Joined with {numTeams} Team{numTeams > 1 ? "s" : ""}
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/018b7148eec24a4f0c02deea20bf95b1509f2729a7c7ca51c2e113b078701463?placeholderIfAbsent=true&apiKey=f5294c2440c849e09806e1501d656072"
          className="object-contain shrink-0 my-auto mr-6 w-6 h-6"
          alt="Dropdown"
        />
        <div className="absolute left-5 -bottom-3 px-5 py-1 text-xs bg-[#666666] text-white rounded-full shadow-lg">
          T{numTeams}
        </div>
      </div>
    </div>
  );
};

const MyContest = () => {
  const [joinedContests, setJoinedContests] = useState([]);
  const [myStats, setMyStats] = useState({});
  const [showMyTeam, setShowMyTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchJoinedContests();
    } else {
      setError("Please log in to view your contests.");
    }
  }, [userId]);

  const fetchJoinedContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/contests/user');
      const contests = response?.data?.contests || [];
      setJoinedContests(contests);
    } catch (error) {
      console.error("Error fetching joined contests:", error.response?.data || error.message);
      setError(error?.response?.data?.message || error.message || "Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!joinedContests.length || !userId) return;

    const loadMyStats = async () => {
      const statsEntries = await Promise.all(
        joinedContests.map(async (contest) => {
          try {
            const response = await fetchContestLeaderboard(contest._id);
            const entries = response?.data || [];
            const mine = entries.find((entry) => entry.userId?._id?.toString() === userId);
            if (!mine) return [contest._id, null];
            return [contest._id, {
              rank: mine.rank,
              points: mine.points,
              winningAmount: mine.winningAmount
            }];
          } catch (leaderboardError) {
            return [contest._id, null];
          }
        })
      );

      const next = statsEntries.reduce((acc, [contestId, stats]) => {
        if (stats) acc[contestId] = stats;
        return acc;
      }, {});

      setMyStats(next);
    };

    loadMyStats();
  }, [joinedContests, userId]);

  useEffect(() => {
    const handleLeaderboardUpdate = (payload) => {
      if (!payload?.contestId || !payload?.userId) return;
      if (payload.userId.toString() !== userId) return;
      setMyStats((prev) => ({
        ...prev,
        [payload.contestId]: {
          rank: payload.rank ?? prev[payload.contestId]?.rank,
          points: payload.points ?? prev[payload.contestId]?.points,
          winningAmount: payload.winningAmount ?? prev[payload.contestId]?.winningAmount
        }
      }));
    };

    stockSocket.onLeaderboardUpdate(handleLeaderboardUpdate);
    return () => {
      stockSocket.offLeaderboardUpdate(handleLeaderboardUpdate);
    };
  }, [userId]);

  const contestStats = useMemo(() => myStats, [myStats]);

  const handleToggle = (contestId) => {
    setShowMyTeam((prev) => (prev === contestId ? null : contestId));
  };

  return (
    <>
      <Navbar />
      <div className="text-white flex items-center justify-center mt-4 text-[24px]">
        My Contests
      </div>
      <div className="flex items-center justify-center">
        <section className="rounded-none mt-10 w-[1291px]">
          {loading ? (
            <p className="text-white text-center">Loading contests...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : joinedContests.length > 0 ? (
            joinedContests.map((contest) => {
              const prizePool = contest.prizePool || 0;
              const totalSpots = contest.totalSpots || 0;
              const filledSpots = contest.filledSpots || 0;
              const spotsLeft = Math.max(totalSpots - filledSpots, 0);
              const firstPrize = contest.prizeBreakup?.find((range) => range.rankFrom === 1)?.prizeEach
                || contest.prizeBreakup?.[0]?.prizeEach
                || 0;
              const totalWinners = contest.prizeBreakup?.reduce((sum, range) => sum + Number(range.winners || 0), 0) || 0;
              const winPercentage = totalSpots > 0 ? Math.round((totalWinners / totalSpots) * 100) : 0;
              const numTeams = contest.userTeamsCount || 0;
              const myEntry = contestStats[contest._id];
              return (
                <article
                  key={contest._id}
                  className="flex flex-col pt-3.5 w-full rounded-lg bg-stone-900 max-md:max-w-full mb-5"
                >
                  <GuaranteedPlusHeader
                    name={contest.name}
                    entryFee={contest.entryFee}
                    spotsLeft={spotsLeft}
                    totalSpots={totalSpots}
                    prize={prizePool}
                    firstPrize={firstPrize}
                  />
                  <StatsSection
                    prize={prizePool}
                    firstPrize={firstPrize}
                    maximumTeam={contest.maximumTeamPerUser}
                    winPercentage={winPercentage}
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                    <span className="rounded-full bg-white/10 px-3 py-1">Status: {contest.status || 'Upcoming'}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">My Rank: {myEntry?.rank ?? '—'}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">My Points: {myEntry?.points?.toFixed?.(2) ?? '—'}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">
                      Winnings: {myEntry?.winningAmount ? `₹${myEntry.winningAmount}` : '—'}
                    </span>
                  </div>
                  <TeamInfo onToggle={() => handleToggle(contest._id)} numTeams={numTeams} />
                  {showMyTeam === contest._id && <MyTeam contestId={contest._id} />}
                </article>
              );
            })
          ) : (
            <p className="text-white text-center">You have not joined any contests yet.</p>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default MyContest;





const MyTeam = ({ contestId }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!contestId) throw new Error("Contest ID is missing");
        const response = await apiClient.get(`/contests/${contestId}/teams`);
        setTeams(response?.data?.teams || []);
      } catch (error) {
        console.error("Error fetching teams:", error.response?.data || error.message);
        setError(error?.response?.data?.message || error.message || "Failed to fetch team data");
      } finally {
        setLoading(false);
      }
    };

    if (contestId) {
      fetchTeams();
    }
  }, [contestId]);

  return (
    <section className="flex justify-center items-center py-2">
      <div className="w-[1291px]">
        {loading ? (
          <p className="text-white">Loading teams...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : teams.length > 0 ? (
          teams.map((team, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-5 justify-between text-2xl leading-loose w-full bg-[linear-gradient(to_left,#DFDFDF_0%,#D0D0D0_25%,#848484_100%)] rounded-lg px-2 py-1 shadow-md relative mb-4"
            >
              <div className="text-white px-4 font-semibold">
                Team {index + 1}
              </div>
              <div className="flex gap-10 items-center text-stone-300">
                <div className="flex flex-col items-center">
                  <div className="w-[90px] h-[90px] rounded-full bg-white/10 flex items-center justify-center text-white text-sm">
                    {team.captain?.stockSymbol || 'C'}
                  </div>
                  <span className="mt-2 text-white">{team.captain?.stockSymbol || 'Captain'}</span>
                  <span className="text-sm text-gray-300">C</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[90px] h-[90px] rounded-full bg-white/10 flex items-center justify-center text-white text-sm">
                    {team.viceCaptain?.stockSymbol || 'VC'}
                  </div>
                  <span className="mt-2 text-white">{team.viceCaptain?.stockSymbol || 'Vice Captain'}</span>
                  <span className="text-sm text-gray-300">VC</span>
                </div>
              </div>
              <div className="absolute left-5 -bottom-3 px-5 py-1 text-xs bg-[#666666] text-white rounded-full shadow-lg">
                T{index + 1}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No teams found for this contest.</p>
        )}
      </div>
    </section>
  );
};

