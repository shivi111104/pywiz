import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const LevelAccuracyChart = () => {
  const chartRef = useRef(null);
  let myChart = null;
  const [accuracyData, setAccuracyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getLevelData");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAccuracyData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chartRef && chartRef.current && accuracyData.length > 0) {
      if (myChart) {
        myChart.destroy();
      }

      const maxLevels = Array.from({ length: 10 }, (_, index) => index + 1); 
      const accuracies = maxLevels.map(level => {
        const accuracyItem = accuracyData.find(item => item.level_number === level);
        return accuracyItem ? accuracyItem.average_accuracy : null;
      });
      console.log(accuracies);
      const ctx = chartRef.current.getContext("2d");

      myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: maxLevels,
          datasets: [
            {
              label: "Accuracy per Level",
              data: accuracies,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Level",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Accuracy (%)",
              },
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
  }, [accuracyData]);

  return (
    <div className="w-full h-full bg-green-200 rounded-lg flex justify-center items-center">
      <canvas ref={chartRef} />
    </div>
  );
};

export default LevelAccuracyChart;
