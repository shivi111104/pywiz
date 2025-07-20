import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import LevelAccuracyChart from "./LevelAccuracyChart";
import DifficultyAccuracyChart from "./DifficultyAccuracyChart";

const Statistics = () => {
  const [userCount, setUserCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/userCount"); 
        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }
        const data = await response.json();
        console.log(data);
        setUserCount(data.user_count);
        setAccuracy(Number(data.average_accuracy).toFixed(2)); 
        setScore(Number(data.average_score).toFixed(2));

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserCount();
  }, []);
  return (
    <div className="flex flex-col ">
      <div className=" w-full text-4xl">Statistics</div>

      <div className="flex h-[15vh] gap-4">
        <div className="w-1/3 h-full text-center bg-red-200 rounded-lg flex ">
          <div className="h-full w-1/4">
            <FaUserAlt className="h-full w-full p-6" />
          </div>
          <div className="h-full w-3/4 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">User Count</h1>
            <p>{userCount}</p>
          </div>
        </div>
        <div className="w-1/3 h-full text-center bg-yellow-200 rounded-lg flex ">
          <div className="h-full w-1/4">
            <FaUserAlt className="h-full w-full p-6" />
          </div>
          <div className="h-full w-3/4 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Avg Accuracy</h1>
            <p>{accuracy} %</p>
          </div>
        </div>
        <div className="w-1/3 h-full text-center bg-purple-200 rounded-lg flex ">
          <div className="h-full w-1/4">
            <FaUserAlt className="h-full w-full p-6" />
          </div>
          <div className="h-full w-3/4 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Avg Score</h1>
            <p>{score}</p>
          </div>
        </div>
      </div>
      <div className="h-[50vh] flex gap-4 mt-4 ">

        <div className="w-2/3">
          <LevelAccuracyChart />
        </div>

        <div className="w-1/3 ">
          <DifficultyAccuracyChart />
        </div>
        
      </div>
    </div>
  );
};

export default Statistics;
