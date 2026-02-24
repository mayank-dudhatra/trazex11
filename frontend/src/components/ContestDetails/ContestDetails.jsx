import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import apiClient from "../../services/apiClient";



const ContestDetails = ({ date }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return; // Ensure date is available before fetching

    const encodedDate = encodeURIComponent(date); // Encode the date properly
    console.log("Fetching contests for:", date, "Encoded:", encodedDate);

    apiClient.get(`/contests/date/${encodedDate}`)
    .then((res) => res.data)
    .then((data) => {
        
      console.log("API Response:", data); // Check response here
      if (data?.status === "success" && Array.isArray(data.contests)) {
        setContests(data.contests);
      } else {
        setContests([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setError("Failed to fetch contests.");
      setLoading(false);
    });
  
  }, [date]);

  console.log("Contests State:", contests); 

  const navigate = useNavigate();

const handleGoToCreateTeams = (contestId) => {
  localStorage.setItem("contestId", contestId); // Store contest ID
  navigate("/createTeams");
};

  return (
    <>
    <Navbar />
    <div>
      <h2>Contests for {date}</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {contests.length > 0 ? (
        contests.map((contests, index) => (
          <div key={index} style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
            <h3>{contests.name}</h3>
            <p><strong>Date:</strong> {contests.date}</p>
            
          </div>
        ))
      ) : (
        !loading && <p>No contests available.</p>
      )}
    </div>
    <Footer />
    </>
  );
};

export default ContestDetails;
