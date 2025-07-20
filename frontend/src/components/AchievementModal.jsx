import React ,{useEffect,useState}from "react";
import Modal from "react-modal";
import { FaStar, FaTimes } from "react-icons/fa";

Modal.setAppElement("#root");

const AchievementModal = ({ isOpen, onClose }) => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {

    const fetchAchievements = async () => {
      const userEmail = localStorage.getItem("email");
      if (userEmail) {
        try {
          const response = await fetch("http://localhost:5000/getUserAchievements", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }),
          });
          if (response.ok) {
            const data = await response.json();
            setAchievements(data.achievements);
            console.log(data.achievements)  
          } else {
            console.error("Failed to fetch achievements");
          }
        } catch (error) {
          console.error("Error fetching achievements:", error);
        }
      } else {
        console.error("User email not found in localStorage");
      }
    };

    fetchAchievements();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content relative md:w-4/6 sm:w-5/6 h-4/5 flex justify-center p-12 bg-[#3C1A0B] border-yellow-500 border-4 text-white"
      overlayClassName="modal-overlay"
    >
      <div className="flex items-center justify-between flex-col xl:w-5/6">
        <div className="text-4xl flex gap-8 ">
          <FaStar className="text-yellow-200 " />
          <p>Achievements</p>
          <FaStar className="text-yellow-200 " />
        </div>
        <div className="grid lg:grid-cols-2 w-full lg:grid-rows-3 grid-rows-6  h-full p-8 gap-6 gap-x-8">
          {achievements.slice(0,6).map((achievement, index) => (
            <div
              key={index}
              className={`w-full flex rounded-2xl p-2 shadow-3xl bg-gradient-to-b from-[#4D2614]  to-[#3E1B0C] ${
                achievement.unlocked === true
                  ? ""
                  : "opacity-25 border-2 border-black"
              }`}
            >
              <img
                src={achievement.image}
                alt="img "
                className="lg:h-3/4 aspect-square object-cover object-center"
              />
              <div className="flex grow flex-col justify-between">
                <div className="">
                  <p className="p-3 text-lg text-center">{achievement.name}</p>
                  <div
                    className={`text-sm max-xl:hidden ${
                      achievement.unlocked === true ? "" : "hidden"
                    }`}
                  >
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked === true && (
                  <div className="text-sm text-end ">
                    {achievement.unlocked_date}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FaTimes
        className="text-red-500 absolute top-4 right-4 h-8 w-8 cursor-pointer "
        onClick={onClose}
      />
    </Modal>
  );
};

export default AchievementModal;
