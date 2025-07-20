import React, { useState } from 'react';

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    levelNumber: "",
    question: "",
    output: "",
    difficulty: "",
    partialAnswer: "",
    correctAnswer: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "levelNumber") {
      const levelNum = parseInt(value);
      if (levelNum >= 1 && levelNum <= 10) {
        setFormData({ ...formData, [name]: levelNum });
      } else {
        setFormData({ ...formData, [name]: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/questions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setShowError(false);
        setFormData({
          levelNumber: "",
          question: "",
          output: "",
          difficulty: "", 
          partialAnswer: "",
          correctAnswer: "",
        });
      } else {
        setShowSuccess(false);
        setShowError(true);
      }
    } catch (error) {
      setShowSuccess(false);
      setShowError(true);
    }
  };

  const difficultyLevels = ["Easy", "Medium", "Hard"];

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-[#EEEDFE] shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Questions</h2>
      {showSuccess && (
        <p className="text-green-500 mb-4">Question added successfully!</p>
      )}
      {showError && (
        <p className="text-red-500 mb-4">
          Error adding level. Please try again.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((fieldName) => (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium text-gray-700"
            >
              {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
            </label>
            {fieldName === 'difficulty' ? (
              <select
                id={fieldName}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-4" 
                required
              >
                <option disabled value="">Select</option>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            ) : (
              <input
                type={fieldName === 'levelNumber' ? 'number' : 'text'}
                id={fieldName}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-4" 
                required
                min={1} 
                max={10} 
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Level
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
