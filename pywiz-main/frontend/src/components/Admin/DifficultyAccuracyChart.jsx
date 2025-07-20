import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const DifficultyAccuracyChart = () => {
  const chartRef = useRef(null);
  const [difficultyData, setDifficultyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/getDifficultyData");
        const data = await response.json();
        setDifficultyData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let myChart = null;

    if (chartRef.current && difficultyData.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      const labels = difficultyData.map((item) => item.difficulty);
      const accuracies = difficultyData.map((item) => item.average_accuracy);

      myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Accuracy per Difficulty",
              data: accuracies,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Difficulty",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Accuracy (%)",
              },
              stepSize: 10,
              max: 100,
            },
          },
        },
      });
    }

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [difficultyData]);

  return (
    <div className="w-full h-full bg-teal-200 rounded-lg flex justify-center items-center">
      <canvas ref={chartRef} className="h-full" />
    </div>
  );
};

export default DifficultyAccuracyChart;
