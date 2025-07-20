import React from 'react';

const VideoPlayer = () => {
  const videoSrc = '../images/pywizvideo.mp4'; 

  return (
    <div className="w-full max-w-2xl mx-auto">
      <video className="w-full h-96" controls>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
