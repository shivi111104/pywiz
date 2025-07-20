import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
Modal.setAppElement("#root");

const StatisticsModal = ({ isOpen, onClose }) => {
  const [statisticsData, setStatisticsData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch("http://localhost:5000/getUserStats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        console.log("Data received from backend:", data);
        setStatisticsData(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    if (isOpen) {
      fetchStatistics();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content relative md:w-3/6 sm:w-4/6 h-auto flex justify-center p-12 bg-[#3C1A0B] border-yellow-500 border-4 text-white"
      overlayClassName="modal-overlay"
    >
      <div className="flex items-center flex-col xl:w-5/6">
        <div className="text-4xl flex gap-8 ">
          <FaPython />
          <p>Statistics</p>
          <FaPython />
        </div>
        <div className="mt-16 grow  w-full   text-white">
          <ul className="space-y-4">
            {statisticsData && (
              <ul className="space-y-4">
                <li className="flex justify-between w-full">
                  <span className="mr-2">Username:</span>
                  <span>{statisticsData.username}</span>
                </li>
                <li className="flex justify-between w-full">
                  <span className="mr-2">Total Encounters:</span>
                  <span>{statisticsData.total_solved}</span>
                </li>
                <li className="flex justify-between w-full">
                  <span className="mr-2">Enemies Slain:</span>
                  <span>{statisticsData.correct}</span>
                </li>
                <li className="flex justify-between w-full">
                  <span className="mr-2">Injured:</span>
                  <span>{statisticsData.incorrect}</span>
                </li>
                <li className="flex justify-between w-full">
                  <span className="mr-2">Accuracy:</span>
                  <span>{statisticsData.accuracy !== undefined ? statisticsData.accuracy.toFixed(2) + '%' : '-'}</span>
                </li>
                <li className="flex justify-between w-full">
                  <span className="mr-2">Score:</span>
                  <span>{statisticsData.score}</span>
                </li>
                <li className="flex justify-between w-full">
                  <span className="mr-2">Max Level:</span>
                  <span>{statisticsData.max_level}</span>
                </li>
              </ul>
            )}
          </ul>
        </div>
      </div>
      <FaTimes
        className="text-red-500 h-8 w-8 absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      />
    </Modal>
  );
};

export default StatisticsModal;
