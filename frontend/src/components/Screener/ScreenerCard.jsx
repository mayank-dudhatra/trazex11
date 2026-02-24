import React, { useMemo, useRef, useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Details from "./CardDetails";
import { fetchStocks } from "../../services/api";
import { useMultipleStocks } from "../../hooks/useStockLive";

const StockCard = () => {
  const [stocks, setStocks] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [exchange, setExchange] = useState("NSE");
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlighted, setHighlighted] = useState({});
  const highlightTimers = useRef({});

  const { stocks: liveStocks } = useMultipleStocks(symbols);

  const normalizeStock = (stock) => ({
    ...stock,
    LTP: stock.LTP ?? stock.price ?? null,
    percentchange: stock.percentchange ?? stock.percentChange ?? null,
    dailyBuyPoints: stock.dailyBuyPoints ?? stock.buyPoints ?? 0,
    dailyBuyBasePoints: stock.dailyBuyBasePoints ?? 0,
    dailyBuyMilestonePoints: stock.dailyBuyMilestonePoints ?? 0,
    dailySellPoints: stock.dailySellPoints ?? stock.sellPoints ?? 0,
    dailySellBasePoints: stock.dailySellBasePoints ?? 0,
    dailySellMilestonePoints: stock.dailySellMilestonePoints ?? 0,
    dailyMilestonesHit: stock.dailyMilestonesHit ?? stock.dailyMilestones ?? {}
  });

  // Fetch stock data from backend
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const response = await fetchStocks({ exchange });
        const list = response?.data || [];
        setStocks(list.map(normalizeStock));
        setSymbols(list.map((stock) => stock.symbol));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadStocks();
  }, [exchange]);

  useEffect(() => {
    if (!liveStocks || Object.keys(liveStocks).length === 0) {
      return;
    }

    const changedSymbols = Object.keys(liveStocks);

    setHighlighted((current) => {
      const next = { ...current };
      changedSymbols.forEach((symbol) => {
        next[symbol] = true;
      });
      return next;
    });

    changedSymbols.forEach((symbol) => {
      if (highlightTimers.current[symbol]) {
        clearTimeout(highlightTimers.current[symbol]);
      }

      highlightTimers.current[symbol] = setTimeout(() => {
        setHighlighted((current) => ({ ...current, [symbol]: false }));
      }, 800);
    });

    setStocks((prev) =>
      prev.map((stock) => {
        const live = liveStocks[stock.symbol];
        if (!live) return stock;
        return normalizeStock({ ...stock, ...live });
      })
    );
  }, [liveStocks]);

  useEffect(() => {
    return () => {
      Object.values(highlightTimers.current).forEach((timerId) => clearTimeout(timerId));
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const term = searchTerm.toLowerCase();
    return stocks.filter((stock) =>
      stock.name?.toLowerCase().includes(term)
      || stock.symbol?.toLowerCase().includes(term)
    );
  }, [stocks, searchTerm]);

  // Toggle details visibility for a specific stock
  const toggleDetails = (symbol) => {
    setShowDetails((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  // Handle exchange selection
  const handleExchangeChange = (selectedExchange) => {
    setExchange(selectedExchange);
    setShowDetails({});
    setStocks([]);
    setSymbols([]);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-5 bg-black min-h-screen">
        {/* Modern Exchange Selection */}
        <div className="mb-8 flex  justify-center">
          <div className="relative inline-flex gap-1 border border-[#bebebe] p-1 rounded-[4px] shadow-lg">
            <button
              onClick={() => handleExchangeChange("NSE")}
              className={`px-8  text-[16px] font-semibold rounded-[4px] transition-all duration-300 ${
                exchange === "NSE"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              NSE
            </button>
            <button
              onClick={() => handleExchangeChange("BSE")}
              className={`px-8  text-[16px] font-semibold rounded-[4px] transition-all duration-300 ${
                exchange === "BSE"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              BSE
            </button>
            {/* Optional: Sliding background effect */}
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-full transition-transform duration-300 ${
                exchange === "NSE" ? "left-1" : "left-1/2"
              }`}
            />
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <p className="text-white text-lg animate-pulse">Loading stocks...</p>
        )}
        {error && <p className="text-red-500 text-lg">Error: {error}</p>}

        <div className="w-[1130px]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-white text-lg font-semibold">Live Stocks</div>
            <div className="relative">
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by symbol or name"
                className="w-full md:w-[320px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>

        {/* Stock Cards */}
        {!loading && !error && filteredStocks.length > 0 && (
          <div className="w-[1130px] space-y-5">
            {filteredStocks.map((stock) => (
              (() => {
                const cleanSymbol = stock.symbol?.split(".")[0] || "";
                const imageUrl = `https://images.dhan.co/symbol/${cleanSymbol}.png`;
                const change = stock.change ?? 0;
                const isNegative = change < 0;
                const isHighlighted = highlighted[stock.symbol];
                const baseBuyPoints = stock.dailyBuyBasePoints ?? 0;
                const baseSellPoints = stock.dailySellBasePoints ?? 0;
                const buyMilestoneBonus = stock.dailyBuyMilestonePoints ?? 0;
                const sellMilestoneBonus = stock.dailySellMilestonePoints ?? 0;

                return (
              <div
                key={stock.symbol}
                className={`bg-[#1E1E1E] p-4 pt-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isHighlighted ? 'ring-2 ring-emerald-400/60 shadow-emerald-400/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={imageUrl}
                      className="w-[50px] h-[50px] mr-3 rounded-full"
                      alt={`${stock.name} Logo`}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                    />
                    <div>
                      <p className="text-white text-[28px] font-bold">{stock.name}</p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <p>IND : {stock.symbol.split(".")[0]}</p>
                        <p className="text-green-400 font-semibold bg-green-900 px-2 py-0.5 rounded text-xs">
                          LTP {stock.LTP?.toFixed(2) || "N/A"}
                        </p>
                        <p className="text-white/60">Vol {stock.volume?.toLocaleString() || "0"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-white text-[35px] font-bold">
                      {stock.price?.toFixed(2) || "N/A"}
                    </p>
                    <p
                      className={`text-sm flex items-center ${
                        isNegative ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {change?.toFixed(2) || "0.00"} (
                      {stock.percentchange?.toFixed(2) || "0.00"}%)
                      <img
                        src={
                          isNegative
                            ? "https://dhan.co/_next/static/media/loss.1d0f44e9.svg"
                            : "https://dhan.co/_next/static/media/profit.ac476bbb.svg"
                        }
                        className="ml-1 w-3 h-3"
                        alt={isNegative ? "Down" : "Up"}
                      />
                    </p>
                  </div>
                </div>

                {/* Daily Points Display */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                    <div className="text-xs text-white/60 mb-1">BUY Points</div>
                    <div className="text-2xl font-bold text-green-400">
                      {stock.dailyBuyPoints ?? 0}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Base {baseBuyPoints} + Milestone {buyMilestoneBonus}
                    </div>
                    {stock.dailyMilestonesHit && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stock.dailyMilestonesHit.m2 && (
                          <span className="text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded">
                            2%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.m5 && (
                          <span className="text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded">
                            5%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.m10 && (
                          <span className="text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded">
                            10%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.m15 && (
                          <span className="text-[10px] bg-green-600/30 text-green-200 px-2 py-0.5 rounded">
                            15%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.dayHigh && (
                          <span className="text-[10px] bg-yellow-600/30 text-yellow-200 px-2 py-0.5 rounded">
                            Day High
                          </span>
                        )}
                        {stock.dailyMilestonesHit.volume2x && (
                          <span className="text-[10px] bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded">
                            Vol 2x
                          </span>
                        )}
                        {stock.dailyMilestonesHit.volume3x && (
                          <span className="text-[10px] bg-purple-600/30 text-purple-200 px-2 py-0.5 rounded">
                            Vol 3x
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <div className="text-xs text-white/60 mb-1">SELL Points</div>
                    <div className="text-2xl font-bold text-red-400">
                      {stock.dailySellPoints ?? 0}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Base {baseSellPoints} + Milestone {sellMilestoneBonus}
                    </div>
                    {stock.dailyMilestonesHit && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stock.dailyMilestonesHit.m2 && (
                          <span className="text-[10px] bg-red-600/30 text-red-200 px-2 py-0.5 rounded">
                            2%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.m5 && (
                          <span className="text-[10px] bg-red-600/30 text-red-200 px-2 py-0.5 rounded">
                            5%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.m10 && (
                          <span className="text-[10px] bg-red-600/30 text-red-200 px-2 py-0.5 rounded">
                            10%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.m15 && (
                          <span className="text-[10px] bg-red-600/30 text-red-200 px-2 py-0.5 rounded">
                            15%
                          </span>
                        )}
                        {stock.dailyMilestonesHit.dayLow && (
                          <span className="text-[10px] bg-yellow-600/30 text-yellow-200 px-2 py-0.5 rounded">
                            Day Low
                          </span>
                        )}
                        {stock.dailyMilestonesHit.volume2x && (
                          <span className="text-[10px] bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded">
                            Vol 2x
                          </span>
                        )}
                        {stock.dailyMilestonesHit.volume3x && (
                          <span className="text-[10px] bg-purple-600/30 text-purple-200 px-2 py-0.5 rounded">
                            Vol 3x
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>


                <div className="flex justify-between items-center mt-3 text-gray-400 text-[18px] border-t border-gray-700 pt-3">
                <p>Open: {stock.openPrice?.toFixed(2) || "N/A"}</p>
                  <p>p.Close: {stock.previousClose?.toFixed(2) || "N/A"}</p>
                  <p>52 Week Low: {stock.week52Low?.toFixed(2) || "N/A"}</p>
                  <p>52 Week High: {stock.week52High?.toFixed(2) || "N/A"}</p>
                  <p>High: {stock.dayHigh?.toFixed(2) || "N/A"}</p>
                  <p>Low: {stock.dayLow?.toFixed(2) || "N/A"}</p>
                </div>

                <div
                  onClick={() => toggleDetails(stock.symbol)}
                  className="flex items-center justify-center mt-4 text-white cursor-pointer hover:underline transition-colors duration-200"
                >
                  {showDetails[stock.symbol] ? "Hide Details" : "See More"}
                </div>

                {showDetails[stock.symbol] && <Details />}
              </div>
                );
              })()
            ))}
          </div>
        )}

        {!loading && !error && filteredStocks.length === 0 && (
          <p className="text-white text-lg">No stock data available.</p>
        )}
      </div>
      {/* <MiniChart /> */}
      <Footer />
    </>
  );
};

export default StockCard;




// import { Line } from "react-chartjs-2";

// const MiniChart = ({ data }) => {
//   const [chartData, setChartData] = useState({});

//   useEffect(() => {
//     if (data) {
//       setChartData({
//         labels: data.map((point) => new Date(point.date).toLocaleTimeString()),
//         datasets: [
//           {
//             label: "Price",
//             data: data.map((point) => point.close),
//             borderColor: "green",
//             borderWidth: 1,
//             fill: false,
//             tension: 0.1,
//           },
//         ],
//       });
//     }
//   }, [data]);

//   return (
//     <div style={{ width: "100px", height: "50px" }}>
//       <Line data={chartData} options={{ scales: { x: { display: false }, y: { display: false } }, plugins: { legend: { display: false } } }} />
//     </div>
//   );
// };

