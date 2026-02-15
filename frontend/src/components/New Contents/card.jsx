

"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import SectionLoader from "../Loader/SectionLoader";
import apiClient from "../../services/apiClient";

const EventCard = () => {
  const [allContests, setAllContests] = useState([]);
  const [displayedContests, setDisplayedContests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get today's date automatically
  const getTodayDate = () => {
    return new Date().toISOString().slice(0, 10);
  };

  // Fetch all contests for today onwards (next 7 days)
  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      setError(null);
      try {
        const allContests = [];
        
        // Fetch contests for today + next 7 days
        const daysToFetch = 7;
        for (let i = 0; i < daysToFetch; i++) {
          const fetchDate = new Date();
          fetchDate.setDate(fetchDate.getDate() + i);
          const dateString = fetchDate.toISOString().slice(0, 10);
          
          console.log(`Fetching contests for date: ${dateString} (Market: NSE & BSE)`);
          
          try {
            // Fetch both NSE and BSE for this date
            const [responseNSE, responseBSE] = await Promise.all([
              apiClient.get("/contests", {
                params: { date: dateString, market: "NSE" },
              }),
              apiClient.get("/contests", {
                params: { date: dateString, market: "BSE" },
              })
            ]);

            console.log(`NSE Response for ${dateString}:`, responseNSE?.data);
            console.log(`BSE Response for ${dateString}:`, responseBSE?.data);

            // Extract from NSE
            if (responseNSE?.data?.data) {
              const data = responseNSE.data.data;
              if (data.daily) allContests.push(...(Array.isArray(data.daily) ? data.daily : []));
              if (data.weekly) allContests.push(...(Array.isArray(data.weekly) ? data.weekly : []));
              if (data.monthly) allContests.push(...(Array.isArray(data.monthly) ? data.monthly : []));
            }

            // Extract from BSE
            if (responseBSE?.data?.data) {
              const data = responseBSE.data.data;
              if (data.daily) allContests.push(...(Array.isArray(data.daily) ? data.daily : []));
              if (data.weekly) allContests.push(...(Array.isArray(data.weekly) ? data.weekly : []));
              if (data.monthly) allContests.push(...(Array.isArray(data.monthly) ? data.monthly : []));
            }
          } catch (err) {
            console.error(`Error fetching for ${dateString}:`, err);
            // Continue with next date even if one fails
          }
        }

        console.log("All Contests Collected:", allContests);

        // Filter: only show today and future dates, exclude past contests
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const filtered = allContests.filter((contest) => {
          const contestDate = new Date(contest.contestStartTime || contest.contestDate);
          return contestDate >= now;
        });

        console.log("Filtered Contests:", filtered);

        // Remove duplicates by ID
        const uniqueContests = Array.from(
          new Map(filtered.map(c => [c._id, c])).values()
        );

        console.log("Final Unique Contests:", uniqueContests);

        setAllContests(uniqueContests);
        filterAndSortContests(uniqueContests, "all");
      } catch (error) {
        console.error("Error fetching contests:", error);
        setError("Failed to fetch contests.");
        setAllContests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // Filter and sort contests
  const filterAndSortContests = (contests, status) => {
    let filtered = contests;

    // Filter by status (live, upcoming, completed)
    if (status !== "all") {
      filtered = filtered.filter(
        c => (c.status || "upcoming").toLowerCase() === status.toLowerCase()
      );
    }

    // Sort: Live first, then upcoming, then completed
    const statusOrder = { live: 0, upcoming: 1, completed: 2 };
    const sortedContests = filtered.sort((a, b) => {
      const statusA = statusOrder[(a.status || "upcoming").toLowerCase()] || 3;
      const statusB = statusOrder[(b.status || "upcoming").toLowerCase()] || 3;
      
      if (statusA !== statusB) return statusA - statusB;
      
      // Within same status, sort by date
      const dateA = new Date(a.contestStartTime || a.contestDate);
      const dateB = new Date(b.contestStartTime || b.contestDate);
      return dateA - dateB;
    });

    setDisplayedContests(sortedContests);
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    filterAndSortContests(allContests, newStatus);
  };

  // Utility functions for formatting
  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const formatDay = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", { weekday: "long" });
  };

  const formatTime = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatParamDate = (value) => {
    if (!value) return selectedDate;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return selectedDate;
    return date.toISOString().slice(0, 10);
  };

  // Function to handle GO button click
  const handleGoClick = (date, exchange) => {
    navigate(`/contestdetails/date/${date}/exchange/${exchange}`);
  };

  // Group contests by date for display
  const groupByDate = (contests) => {
    const grouped = {};
    contests.forEach((contest) => {
      const date = formatDate(contest.contestStartTime || contest.contestDate);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(contest);
    });
    return grouped;
  };

  if (loading) return <SectionLoader message="Loading contests..." />;
  if (error) return <p className="text-red-500 text-xl text-center mt-10">{error}</p>;

  const totalContests = displayedContests.length;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-16 min-h-screen pb-10">
        
        {/* Filters Section - Top */}
        <div className="w-full max-w-[1291px] px-4 mb-8">
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
            
            {/* Status Filter Only */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60 font-medium mb-3">FILTER BY STATUS</p>
                <div className="flex flex-wrap gap-3">
                  {["all", "live", "upcoming", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStatus === status
                          ? "bg-[#80db66] text-black"
                          : "bg-neutral-800 text-white/70 hover:bg-neutral-700 hover:text-white"
                      }`}
                    >
                      {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-white/70">
                <span className="font-semibold text-[#80db66]">{totalContests}</span> contests
              </div>
            </div>
          </div>
        </div>

        {/* Contests Display Section */}
        <div className="w-full max-w-[1291px] px-4">
          {totalContests === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg mb-2">No contests found</p>
              <p className="text-white/40 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            displayedContests.map((contest) => (
              <div
                key={contest._id}
                className="flex flex-col items-center pt-3 w-full max-w-[1291px] h-[215px] justify-center rounded-lg bg-stone-900 mb-4 overflow-hidden"
              >
                {/* Header */}
                <header className="flex gap-5 self-start ml-3 text-xl font-semibold whitespace-nowrap text-stone-300">
                  <img
                    loading="lazy"
                    src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738904644/nbbzv6vdg9mitp2mque8.png"
                    className="object-contain shrink-0 w-7 aspect-square"
                    alt="Exchange Logo"
                  />
                  <h1 className="my-auto">{contest.marketType || market}</h1>
                </header>

                <hr className="mt-1.5 w-full border border-white border-solid" />

                {/* Main Content */}
                <div className="flex flex-wrap gap-5 justify-between px-3 self-center items-center mt-6 w-full font-bold max-w-[1227px]">
                  <div className="flex gap-10 self-start mt-1.5">
                    <time className="text-5xl leading-none text-white">
                      {formatDate(contest.contestStartTime || contest.contestDate)}
                    </time>
                    <span className="text-2xl leading-loose text-neutral-400">
                      {formatDay(contest.contestStartTime || contest.contestDate)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-[350px] text-2xl items-center justify-center leading-loose">
                    <span className="text-stone-300">
                      Ends At: {formatTime(contest.contestEndTime)}
                    </span>

                    <button
                      onClick={() =>
                        handleGoClick(
                          formatParamDate(contest.contestStartTime || contest.contestDate),
                          contest.marketType || market
                        )
                      }
                      className="px-5 py-1 text-white bg-emerald-400 rounded-lg hover:bg-emerald-500 transition-all"
                    >
                      GO &gt;&gt;
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <footer className="flex flex-wrap gap-5 justify-between py-1.5 px-4 mt-8 w-full max-w-[1291px] h-[52px] rounded-lg bg-neutral-800 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-2xl">🏆</span>
                    <p className="text-xl font-medium leading-10 text-stone-300">
                      {(contest.joinedTeams?.length ?? contest.filledSpots ?? 0)} Joined
                    </p>
                  </div>
                  <p className="text-white text-xl">Status: {contest.status || "Upcoming"}</p>
                </footer>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventCard;
