import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = leaderboardData.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/findall");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const sortedData = data.sort((a, b) => b.score - a.score);
          setLeaderboardData(sortedData);
        } else {
          console.error("Error fetching leaderboard data");
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className=" mx-auto mt-8 p-6 text-lg bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border bg-red-200 w-auto px-4 py-2">Rank</th>
            <th className="border bg-yellow-200 w-1/4 px-4 py-2">PRN</th>
            <th className="border bg-blue-200 w-1/4 px-4 py-2">Username</th>
            <th className="border bg-purple-200 w-1/6 px-4 py-2">Solved Qs</th>
            <th className="border bg-green-200 w-1/6 px-4 py-2">Accuracy</th>
            <th className="border bg-green-200 w-1/6 px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id} className="">
              <td className="border border-gray-400 px-4 py-2">
                {indexOfFirstUser + index + 1}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {user.prn}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {user.username}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {user.total_solved}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {user.accuracy.toFixed(2)}
              </td>
              <td className="border border-gray-400 px-4 py-2">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentUsers.length < usersPerPage}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
