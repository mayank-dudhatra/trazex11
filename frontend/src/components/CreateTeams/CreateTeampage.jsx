
// Main Code


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaTimes } from "react-icons/fa";
import apiClient from "../../services/apiClient";
import { useMultipleStocks } from "../../hooks/useStockLive";


const CreateTeamsPage = () => {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [contestId, setContestId] = useState(null);
  const [stockList, setstockList] = useState([]);
  const [symbols, setSymbols] = useState([]);

  const navigate = useNavigate();
  const maxStocks = 11;

  const { stocks: liveStocks } = useMultipleStocks(symbols);

  const normalizeStock = (stock) => ({
    ...stock,
    percentchange: stock.percentchange ?? stock.percentChange ?? 0
  });


  useEffect(() => {
    const storedContestId = localStorage.getItem("contestId");
    if (storedContestId) setContestId(storedContestId);

    const storedExchange = localStorage.getItem("exchange");

    const fetchStocks = async (exchange) => {
      try {
        const response = await apiClient.get("/stocks", {
          params: { exchange }
        });
        const list = response?.data?.data || [];
        const normalized = list.map(normalizeStock);
        setstockList(normalized);
        setSymbols(normalized.map((stock) => stock.symbol));
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    if (storedExchange) {
      fetchStocks(storedExchange);
    }
  }, []);

  useEffect(() => {
    if (!liveStocks || Object.keys(liveStocks).length === 0) {
      return;
    }

    setstockList((prev) =>
      prev.map((stock) => {
        const live = liveStocks[stock.symbol];
        if (!live) return stock;
        return normalizeStock({ ...stock, ...live });
      })
    );
  }, [liveStocks]);



  const handleBuy = (stock) => {
    if (selectedStocks.length < maxStocks) {
      setSelectedStocks([...selectedStocks, { ...stock, type: "buy" }]);
    }
  };

  const handleSell = (stock) => {
    if (selectedStocks.length < maxStocks) {
      setSelectedStocks([...selectedStocks, { ...stock, type: "sell" }]);
    }
  };

  const handleRemove = (index) => {
    const updatedStocks = [...selectedStocks];
    updatedStocks.splice(index, 1);
    setSelectedStocks(updatedStocks);
  };

  const handleNext = async () => {
    if (selectedStocks.length !== maxStocks) {
      alert("You must select exactly 11 stocks!");
      return;
    }
  
    localStorage.setItem("selectedStocks", JSON.stringify(selectedStocks));
    navigate("/captainpage");
    
    const buyStocks = selectedStocks.filter(stock => stock.type === "buy");
    const sellStocks = selectedStocks.filter(stock => stock.type === "sell");
    
    localStorage.setItem("selectedStocks", JSON.stringify(selectedStocks));
    localStorage.setItem("buyStocks", JSON.stringify(buyStocks));
    localStorage.setItem("sellStocks", JSON.stringify(sellStocks));
    
    const payload = {
      userId,
      stocks: selectedStocks.map(stock => ({ name: stock.name, action: stock.type })),
      captain: selectedStocks[0].name,
      viceCaptain: selectedStocks[1].name,
    };


  };

  const filteredStocks = stockList.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center px-6 py-10 bg-black min-h-screen">
        <div className="w-[1130px] p-6 bg-[#80db66] rounded-xl flex flex-col text-white shadow-lg">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Buy: {selectedStocks.filter(stock => stock.type === "buy").length}</span>
            <span>Sell: {selectedStocks.filter(stock => stock.type === "sell").length}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {selectedStocks.map((stock, index) => {
              const cleanSymbol = stock.symbol?.split(".")[0] || "";
              const imageUrl = `https://images.dhan.co/symbol/${cleanSymbol}.png`;

              return (
              <div 
                key={index} 
                className={`relative p-3 rounded-lg ${
                  stock.type === "buy" ? "border-2 border-green-500" : "border-2 border-red-500"
                }`}
              >
                <img src={imageUrl} alt="Stock Logo" className="w-12 h-12 rounded-full" />
                <FaTimes className="absolute top-0 right-0 cursor-pointer text-red-400 hover:text-red-600" onClick={() => handleRemove(index)} />
              </div>
              );
            })}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search Stocks..."
          className="w-[1130px] p-3 mt-6 rounded-lg bg-zinc-900 text-white border border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <section className="w-[1130px] mt-6 bg-zinc-900 rounded-lg p-4 shadow-md">
          {filteredStocks.map((stock, index) => (
            <StockCard key={index} stock={stock} handleBuy={handleBuy} handleSell={handleSell} />
          ))}
        </section>

        <div className="mt-6">
          <button onClick={handleNext} className="px-16 py-3 text-2xl font-bold text-white bg-green-600 rounded-full shadow-lg hover:bg-green-500 transition-all">
            NEXT
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

const StockCard = ({ stock, handleBuy, handleSell }) => {
  const cleanSymbol = stock.symbol?.split(".")[0] || "";
  const imageUrl = `https://images.dhan.co/symbol/${cleanSymbol}.png`;

  return (
    <article className="flex items-center justify-between bg-zinc-800 p-4 rounded-lg text-white mt-4 w-[1100px] shadow-sm">
      <div className="flex items-center gap-4">
        <img src={imageUrl} alt="Stock Logo" className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="text-lg font-bold">{stock.name}</h3>
          <p className="text-sm text-gray-400">{stock.sector}</p>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold">
          ₹{stock.price} 
          <span className={`ml-2 px-2 py-1 text-sm font-medium rounded-md ${stock.percentchange < 0 ? "bg-red-700 text-red-300" : "bg-green-700 text-green-300"}`}>
          {stock.percentchange < 0 ? "▼" : "▲"} {stock.percentchange.toFixed(2)}%
          </span>
        </p>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600" onClick={() => handleBuy(stock)}>BUY</button>
        <button className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600" onClick={() => handleSell(stock)}>SELL</button>
      </div>
    </article>
  );
};


export default CreateTeamsPage;