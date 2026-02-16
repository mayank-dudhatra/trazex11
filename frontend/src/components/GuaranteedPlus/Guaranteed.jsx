import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import './scrollbar.css'

const ContestDetails = () => {
  const { date, exchange } = useParams();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await apiClient.get('/contests', {
          params: { date, market: exchange },
        });
        const grouped = response?.data?.data || {};
        const allContests = [
          ...(grouped.daily || []),
          ...(grouped.weekly || []),
          ...(grouped.monthly || []),
        ];
        setContests(allContests);
      } catch (err) {
        setError('Error fetching contests');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [date, exchange]);

  const navigate = useNavigate();

  const handleGoToCreateTeams = (contest) => {
    localStorage.setItem("contestId", contest._id);
    localStorage.setItem("exchange", exchange);
    localStorage.setItem("contestDate", date);
    localStorage.setItem("contestEntryFee", String(contest.entryFee ?? 0));
    navigate("/createTeams");
  };

  const getFirstPrize = (breakup = []) => {
    const first = breakup.find((item) => Number(item.rankFrom) === 1);
    return first ? Number(first.prizeEach || 0) : 0;
  };

  const getTotalWinners = (breakup = []) =>
    breakup.reduce((sum, item) => sum + Number(item.winners || 0), 0);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center">
        <section className="rounded-none mt-10 w-[1291px]">
          {loading ? (
            <p className="text-center text-white"><Loader /></p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : contests.length === 0 ? (
            <p className="text-center text-white">No contests available.</p>
          ) : (
            contests.map((contest) => {
              const joinedCount = contest.filledSpots ?? contest.joinedTeams?.length ?? 0;
              const totalSpots = contest.totalSpots ?? 0;
              const spotsLeft = Math.max(totalSpots - joinedCount, 0);
              const firstPrize = getFirstPrize(contest.prizeBreakup);
              const totalWinners = getTotalWinners(contest.prizeBreakup);
              const winPercentage = totalSpots
                ? Math.round((totalWinners / totalSpots) * 100)
                : 0;

              return (
              <article key={contest._id} className="flex flex-col pt-3.5 w-full rounded-lg bg-stone-900 max-md:max-w-full mb-5">
                <GuaranteedPlusHeader 
                  icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1adff2cb2f31b63bd5b8b039a8e7127ca3fd67b86738bdab4faf6ea4085527cf" 
                  title={contest.name} 
                  amount={`${contest.prizePool} Coins`} 
                  spotsLeft={spotsLeft} 
                  totalSpots={totalSpots} 
                  entryFee={contest.entryFee} 
                  prizepool={`${contest.prizePool} Coins`} 
                  contest={contest} 
                  handleGoToCreateTeams={handleGoToCreateTeams}
                />
                <StatsSection 
                  prizepool={`${contest.prizePool}`} 
                  firstprize={`${firstPrize}`}
                  totalteam={`${contest.maximumTeamPerUser}`}
                  winpercentage={`${winPercentage}`}
                  joinedTeams={contest.joinedTeams}
                  prizeBreakup={contest.prizeBreakup}
                />
              </article>
            )})
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

const GuaranteedPlusHeader = ({ icon, title, amount, spotsLeft, totalSpots, entryFee, contest, handleGoToCreateTeams }) => (
  <div className="flex flex-wrap gap-5 justify-between self-center w-full max-w-[1241px] max-md:max-w-full">
    <div className="flex flex-col self-start max-md:max-w-full">
      <div className="flex gap-5 self-start text-xl font-semibold text-white">
        <img loading="lazy" src={icon} className="object-contain shrink-0 my-auto aspect-[1.05] w-[21px]" alt="Guaranteed Plus Icon" />
        <h1>{title}</h1>
      </div>
      <div className="flex flex-wrap gap-5 justify-between items-start mt-6 max-md:max-w-full">
        <p className="mt-2.5 text-5xl font-bold leading-none text-white max-md:text-4xl">{amount}</p>
      </div>
    </div>
    <ProgressBar spotsLeft={spotsLeft} totalSpots={totalSpots} />
    <EntryFeeSection entryFee={entryFee} contest={contest} handleGoToCreateTeams={handleGoToCreateTeams} />  
  </div>
);

const ProgressBar = ({ spotsLeft, totalSpots }) => {
  const progress = totalSpots ? ((totalSpots - spotsLeft) / totalSpots) * 100 : 0;

  return (
    <div className="w-full max-w-[350px] self-center">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span className="text-green-400">{spotsLeft.toLocaleString()}</span>
        <span>{totalSpots.toLocaleString()}</span>
      </div>
      <div className="relative w-full h-3 bg-gray-700 rounded-full">
        <div className="h-full bg-green-400 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const EntryFeeSection = ({ entryFee, contest, handleGoToCreateTeams }) => {
  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-col px-8 py-2 w-full text-3xl font-bold leading-none rounded-lg bg-emerald-400 bg-opacity-10 max-md:px-5">
        <h2>Entry Fee</h2>
        <div className="flex gap-3.5 self-center items-center mt-1 whitespace-nowrap w-[79px]">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a173a2cfdc7598c5bce331a49044fb35aaa78a619f2d1b37ebbf2edde63c9cee" className="object-contain shrink-0 mt-1 my-auto w-8 aspect-[1.07]" alt="Entry Fee Icon" />
          <span>{entryFee}</span>
        </div>
      </div>
      <button onClick={() => handleGoToCreateTeams(contest)} className="self-center mt-4 text-[21px] text-white bg-[#3FD68C] px-4 py-2 h-[47px] w-[157px] font-semibold rounded-md flex items-center justify-center">
        Join Now <span className="ml-2">➜</span>
      </button>
    </div>
  );
};

const StatsSection = ({ prizepool, firstprize, winpercentage, totalteam, joinedTeams, prizeBreakup }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="flex flex-col overflow-hidden gap-5 px-7 py-1.5 mt-4 w-full font-medium rounded-lg bg-neutral-800 max-md:px-5 max-md:max-w-full">
      <div
        className="flex overflow-hidden flex-wrap gap-5 items-center justify-between w-full cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex flex-wrap gap-10 text-2xl max-md:max-w-full">
          <div className="flex flex-auto gap-5 items-center self-start text-stone-300">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8ead62c132ac2c7e2d772a0bbf895d37c7840641f982fac36ecf0a2d4cac257"
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[35px]"
              alt="Stats Icon"
            />
            <span className="self-stretch leading-relaxed">{firstprize}</span>
            <div className="shrink-0 self-stretch my-auto w-px h-9 border border-white border-solid" />
            <span className="flex items-center justify-center w-8 h-8 text-lg font-semibold text-white border-2 border-stone-300 rounded-lg">
              M
            </span>
            <span className="self-stretch my-auto leading-tight">Upto {totalteam}</span>
            <div className="shrink-0 self-stretch my-auto w-px h-9 border border-white border-solid" />
          </div>
          <div className="flex gap-4 items-center justify-center -ml-4">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3112/3112946.png"
              alt="Trophy"
              className="object-contain shrink-0 my-auto w-8"
            />
            <span className="text-white">{winpercentage}%</span>
          </div>
        </div>
        <div className="flex gap-7 self-start text-2xl leading-loose text-white">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/33d91e4d51c1d362e15a4dfa163f2ee77bde5b2a6d37d4eccdfc4997fb00ea46"
            className="object-contain shrink-0 my-auto w-8 aspect-[1.68]"
            alt="Total Amount Icon"
          />
          <span>{prizepool}</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/41ccfc38390615e5dcc4424b858b95819238dc694198d88f05c1c2f6787e3172"
            alt="coin"
            className="object-contain shrink-0 my-auto w-8"
          />
        </div>
      </div>

      {isToggled && (
        <div className="flex flex-col md:flex-row gap-5 mt-4 w-full">
          <div className="w-full md:w-1/2">
            <PrizeBreakup prizeBreakup={prizeBreakup} />
          </div>
          <div className="w-full md:w-1/2">
            <Leaderboard joinedTeams={joinedTeams} />
          </div>
        </div>
      )}
    </div>
  );
};

const PrizeBreakup = ({ prizeBreakup }) => {
  // Format amount with commas and append "Coins"
  const formatPrize = (amount) => {
    return `${Number(amount).toLocaleString()} Coins`;
  };

  return (
    <div className="w-full h-[300px] bg-neutral-900 rounded-lg shadow-md border border-gray-700 overflow-hidden">
      <div className="sticky top-0 bg-neutral-900 z-10 p-4 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white">Winnings</h3>
      </div>
      <div className="h-[calc(100%-60px)] overflow-y-auto custom-scrollbar p-4">
        {prizeBreakup && prizeBreakup.length > 0 ? (
          prizeBreakup.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-white py-2 border-b border-gray-600 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {Number(item.rankFrom) === 1 ? "🏆" : `#${item.rankFrom}-${item.rankTo}`}
                </span>
                {item.winners > 1 && (
                  <span className="text-sm text-gray-400">({item.winners} winners)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/41ccfc38390615e5dcc4424b858b95819238dc694198d88f05c1c2f6787e3172"
                  alt="coin"
                  className="object-contain w-6"
                />
                <span className="text-lg">{formatPrize(item.prizeEach)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white py-2">No prize breakup available.</p>
        )}
      </div>
    </div>
  );
};

const Leaderboard = ({ joinedTeams }) => {
  return (
    <div className="w-full h-[300px] bg-neutral-900 rounded-lg shadow-md border border-gray-700 overflow-hidden">
      <div className="sticky top-0 bg-neutral-900 z-10 p-4 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white">Leaderboards</h3>
      </div>
      <div className="h-[calc(100%-60px)] overflow-y-auto custom-scrollbar p-4">
        {joinedTeams && joinedTeams.length > 0 ? (
          joinedTeams.map((team, index) => (
            <div
              key={team._id}
              className="flex justify-between items-center text-white py-2 border-b border-gray-600 last:border-b-0"
            >
              <div className="flex items-center gap-2 w-1/3">
                <span className="text-lg">{index + 1 === 1 ? "🏆" : `#${index + 1}`}</span>
              </div>
              <div className="flex items-center gap-2 w-1/3">
                <img
                  src="https://res-console.cloudinary.com/dbrb9ptmn/media_explorer_thumbnails/3d227726335182d7a63379073301db14/detailed"
                  alt="user"
                  className="object-contain w-6"
                />
                <span className="text-lg truncate">{team.userId || "User"}</span>
              </div>
              <div className="w-1/3 text-lg">Team: {team.teamId || "N/A"}</div>
            </div>
          ))
        ) : (
          <p className="text-white py-2">No teams have joined yet.</p>
        )}
      </div>
    </div>
  );
};

export default ContestDetails;