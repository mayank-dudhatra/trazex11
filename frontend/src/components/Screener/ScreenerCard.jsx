import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Details from "./CardDetails";
import apiClient from "../../services/apiClient";
import { useMultipleStocks } from "../../hooks/useStockLive";

const StockCard = () => {
  const [stocks, setStocks] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [exchange, setExchange] = useState("NSE");
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { stocks: liveStocks } = useMultipleStocks(symbols);

  const normalizeStock = (stock) => ({
    ...stock,
    LTP: stock.LTP ?? stock.price ?? null,
    percentchange: stock.percentchange ?? stock.percentChange ?? null
  });

  // Fetch stock data from backend
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/stocks", {
          params: { exchange }
        });
        const list = response?.data?.data || [];
        setStocks(list.map(normalizeStock));
        setSymbols(list.map((stock) => stock.symbol));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStocks();
  }, [exchange]);

  useEffect(() => {
    if (!liveStocks || Object.keys(liveStocks).length === 0) {
      return;
    }

    setStocks((prev) =>
      prev.map((stock) => {
        const live = liveStocks[stock.symbol];
        if (!live) return stock;
        return normalizeStock({ ...stock, ...live });
      })
    );
  }, [liveStocks]);

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

        {/* Stock Cards */}
        {!loading && !error && stocks.length > 0 && (
          <div className="w-[1130px] space-y-5">
            {stocks.map((stock) => (
              (() => {
                const cleanSymbol = stock.symbol?.split(".")[0] || "";
                const imageUrl = `https://images.dhan.co/symbol/${cleanSymbol}.png`;

                return (
              <div
                key={stock.symbol}
                className="bg-[#1E1E1E] p-4 pt-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-white text-[35px] font-bold">
                      {stock.price?.toFixed(2) || "N/A"}
                    </p>
                    <p
                      className={`text-sm flex items-center ${
                        stock.change < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {stock.change?.toFixed(2) || "0.00"} (
                      {stock.percentchange?.toFixed(2) || "0.00"}%)
                      <img
                        src={
                          stock.change < 0
                            ? "https://dhan.co/_next/static/media/loss.1d0f44e9.svg"
                            : "https://dhan.co/_next/static/media/profit.ac476bbb.svg"
                        }
                        className="ml-1 w-3 h-3"
                        alt={stock.change < 0 ? "Down" : "Up"}
                      />
                    </p>
                  </div>
                </div>

                {/* <div className="flex justify-between mt-4 text-white text-[20px]">
                  <p className="text-green-400 font-semibold">
                    <span className="text-white">BUY Points: </span>
                    {stock.buyPoints || "N/A"}
                  </p>
                  <p className="text-red-500 font-semibold">
                    <span className="text-white">SELL Points: </span>
                    {stock.sellPoints || "N/A"}
                  </p>
                </div> */}


<div className="flex justify-between mt-4 text-white text-[20px]">
  <p className="text-green-400 font-semibold">
    <span className="text-white">BUY Points: </span>
    {stock.buyPoints ?? 0}
  </p>
  <p className="text-red-500 font-semibold">
    <span className="text-white">SELL Points: </span>
    {stock.sellPoints ?? 0}
  </p>
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

        {!loading && !error && stocks.length === 0 && (
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

