

// // Main Code 

// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import JoinContent from "../JoinContent/JoinContent";

// const CaptainPage = () => {
//   const [selectedStocks, setSelectedStocks] = useState([]);
//   const [captain, setCaptain] = useState(null);
//   const [viceCaptain, setViceCaptain] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const storedStocks = JSON.parse(localStorage.getItem("selectedStocks")) || [];
//     setSelectedStocks(storedStocks);
//   }, []);

//   const handleSelectCaptain = (stock) => {
//     if (stock === viceCaptain) {
//       alert("Captain and Vice-Captain must be different!");
//       return;
//     }
//     setCaptain(stock);
//     localStorage.setItem("captain", JSON.stringify(stock));
//   };

//   const handleSelectViceCaptain = (stock) => {
//     if (stock === captain) {
//       alert("Captain and Vice-Captain must be different!");
//       return;
//     }
//     setViceCaptain(stock);
//     localStorage.setItem("viceCaptain", JSON.stringify(stock));
//   };

//   return (
//     <>
//       <Navbar />
//       <main className="flex flex-col items-center px-6 py-10 bg-black min-h-screen">
//         <h2 className="text-white text-2xl font-bold mb-4">Choose Your Captain and Vice-Captain</h2>

//         <div className="w-[1130px] bg-zinc-900 p-6 rounded-xl shadow-md">
//           <div className="flex justify-between text-white text-lg mb-3">
//             <span><strong>C</strong>: 2X (Double) Points</span>
//             <span><strong>VC</strong>: 1.5X Points</span>
//           </div>

//           <div className="bg-black rounded-lg p-4">
//             {selectedStocks.length > 0 ? (
//               selectedStocks.map((stock, index) => (
//                 <div 
//                   key={index} 
//                   className={`flex items-center justify-between p-3 mb-3 rounded-lg border-l-4 ${
//                     stock.type === "buy" ? "border-[#80db66]" : "border-[#f44336]"
//                   } bg-zinc-800 text-white`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <img src={stock.image} alt={stock.name} className="w-12 h-12 rounded-full" />
//                     <div>
//                       <h3 className="text-lg font-bold">{stock.name}</h3>
//                       <p className="text-sm text-gray-400">{stock.sector}</p>
//                     </div>
//                   </div>
//                   <div className="text-lg font-bold">
//                     {captain?.name === stock.name && viceCaptain?.name === stock.name
//                       ? "C & VC (2X & 1.5X)"
//                       : captain?.name === stock.name
//                       ? "C (2X)"
//                       : viceCaptain?.name === stock.name
//                       ? "VC (1.5X)"
//                       : "0 Pts"}
//                   </div>
//                   <div className="flex gap-3">
//                     <button 
//                       className={`px-4 py-2 rounded-lg transition-all ${
//                         captain?.name === stock.name ? "bg-green-500" : "bg-gray-700 hover:bg-green-500"
//                       }`} 
//                       onClick={() => handleSelectCaptain(stock)}
//                     >
//                       C
//                     </button>
//                     <button 
//                       className={`px-4 py-2 rounded-lg transition-all ${
//                         viceCaptain?.name === stock.name ? "bg-red-500" : "bg-gray-700 hover:bg-red-500"
//                       }`} 
//                       onClick={() => handleSelectViceCaptain(stock)}
//                     >
//                       VC
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-white text-center">No stocks selected</p>
//             )}
//           </div>

//           <div className="mt-4 flex justify-center">
//             <button 
//               onClick={() => setIsOpen(true)}
//               className="px-16 py-3 text-2xl font-bold text-white bg-green-600 rounded-full shadow-lg hover:bg-green-500 transition-all disabled:opacity-50"
//               disabled={!captain || !viceCaptain}
//             >
//               Join
//             </button>
//           </div>
//         </div>

//         {isOpen && <JoinContent setIsOpen={setIsOpen} />}
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default CaptainPage;











import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import JoinContent from "../JoinContent/JoinContent";

const CaptainPage = () => {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [contestId, setContestId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedStocks = JSON.parse(localStorage.getItem("selectedStocks")) || [];
    setSelectedStocks(storedStocks);

    const storedContestId = localStorage.getItem("contestId");
    if (storedContestId) {
      setContestId(storedContestId);
      console.log(storedContestId)
    } else {
      console.error("No Contest ID found!");
    }
  }, []);

  const handleSelectCaptain = (stock) => {
    if (stock === viceCaptain) {
      alert("Captain and Vice-Captain must be different!");
      return;
    }
    setCaptain(stock);
    localStorage.setItem("captain", JSON.stringify(stock));
  };

  const handleSelectViceCaptain = (stock) => {
    if (stock === captain) {
      alert("Captain and Vice-Captain must be different!");
      return;
    }
    setViceCaptain(stock);
    localStorage.setItem("viceCaptain", JSON.stringify(stock));
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center px-6 py-10 bg-black min-h-screen">
        <h2 className="text-white text-2xl font-bold mb-4">Choose Your Captain and Vice-Captain</h2>

        <div className="w-[1130px] bg-zinc-900 p-6 rounded-xl shadow-md">
          <div className="flex justify-between text-white text-lg mb-3">
            <span><strong>C</strong>: 2X (Double) Points</span>
            <span><strong>VC</strong>: 1.5X Points</span>
          </div>

          <div className="bg-black rounded-lg p-4">
            {selectedStocks.length > 0 ? (
              selectedStocks.map((stock, index) => {
                const cleanSymbol = stock.symbol?.split(".")[0] || "";
                const imageUrl = `https://images.dhan.co/symbol/${cleanSymbol}.png`;

                return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 mb-3 rounded-lg border-l-4 ${
                    stock.type === "buy" ? "border-[#80db66]" : "border-[#f44336]"
                  } bg-zinc-800 text-white`}
                >
                  <div className="flex items-center gap-3">
                    <img src={imageUrl} alt={stock.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="text-lg font-bold">{stock.name}</h3>
                      <p className="text-sm text-gray-400">{stock.sector}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {captain?.name === stock.name && viceCaptain?.name === stock.name
                      ? "C & VC (2X & 1.5X)"
                      : captain?.name === stock.name
                      ? "C (2X)"
                      : viceCaptain?.name === stock.name
                      ? "VC (1.5X)"
                      : "0 Pts"}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      className={`px-4 py-2 rounded-lg transition-all ${
                        captain?.name === stock.name ? "bg-green-500" : "bg-gray-700 hover:bg-green-500"
                      }`} 
                      onClick={() => handleSelectCaptain(stock)}
                    >
                      C
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg transition-all ${
                        viceCaptain?.name === stock.name ? "bg-red-500" : "bg-gray-700 hover:bg-red-500"
                      }`} 
                      onClick={() => handleSelectViceCaptain(stock)}
                    >
                      VC
                    </button>
                  </div>
                </div>
                );
              })
            ) : (
              <p className="text-white text-center">No stocks selected</p>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setIsOpen(true)}
              className="px-16 py-3 text-2xl font-bold text-white bg-green-600 rounded-full shadow-lg hover:bg-green-500 transition-all disabled:opacity-50"
              disabled={!captain || !viceCaptain || !contestId}
            >
              Join
            </button>
          </div>
        </div>

        {isOpen && <JoinContent setIsOpen={setIsOpen} />}
      </main>
      <Footer />
    </>
  );
};

export default CaptainPage;
