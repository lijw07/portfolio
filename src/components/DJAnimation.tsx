import React from 'react';

const DJAnimation: React.FC = () => {
  return (
    <div className="dj-animation-container">
      {/* Laser behind DJ */}
      <img 
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_2_16x16.gif`}
        alt="Laser behind DJ"
        className="dj-laser laser-behind"
      />
      
      {/* DJ in the middle */}
      <img 
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_DJ_16x16.gif`}
        alt="DJ"
        className="dj-sprite"
      />
      
      {/* Laser under P */}
      <img 
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_White_Light_16x16.gif`}
        alt="Laser under P"
        className="dj-laser laser-p"
      />
      
      {/* Laser under ... */}
      <img 
        src={`${process.env.PUBLIC_URL}/assets/dj/Beach_Concert_Laser_Machine_White_Light_2_16x16.gif`}
        alt="Laser under dots"
        className="dj-laser laser-dots"
      />
    </div>
  );
};

export default React.memo(DJAnimation);