import React from 'react';

const DJAnimation: React.FC = () => {
  return (
    <div className="dj-animation-container">
      <img
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_2_16x16.gif`}
        alt=""
        className="dj-laser laser-behind"
      />

      <img
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_DJ_16x16.gif`}
        alt="DJ"
        className="dj-sprite"
      />

      <img
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_White_Light_16x16.gif`}
        alt=""
        className="dj-laser laser-near-left"
      />
      <img
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_White_Light_2_16x16.gif`}
        alt=""
        className="dj-laser laser-near-right"
      />

      <img
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_White_Light_2_16x16.gif`}
        alt=""
        className="dj-laser laser-far-left"
      />
      <img
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_White_Light_16x16.gif`}
        alt=""
        className="dj-laser laser-far-right"
      />
    </div>
  );
};

export default React.memo(DJAnimation);
