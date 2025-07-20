import React, { useState, useEffect } from "react";

const DeleteQuestion = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/questions/all");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        
        console.log(data);
      } else {
        console.error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      if (!questionId) {
        console.error("Invalid question ID");
        return;
      }
      const response = await fetch(`http://localhost:5000/questions/delete/${questionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchQuestions(); 
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Questions List</h2>
      {[...Array(10)].map((_, level) => (
        <div key={level} className="bg-[#EEEDFE] rounded-md p-4 mb-4">
          <h3 className="text-xl font-semibold mb-2">Level {level + 1}</h3>
          <div className="grid grid-cols-1 gap-4">
            {questions
              .filter((question) => question.levelNumber === level + 1)
              .map((question, index) => (
                <div key={index} className="bg-red-200 text-base rounded-md p-4 shadow-md relative">
                  <p className="font-semibold">Question: {question.question}</p>
                  <p>Expected Output: {question.output}</p>
                  <p>Difficulty: {question.difficulty}</p>
                  <p>Partially Filled Answer: {question.partialAnswer}</p>
                  <p>Correct Answer: {question.correctAnswer}</p>
      
                  <button
                    onClick={() => handleDelete(question.question)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeleteQuestion;
