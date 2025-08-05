import React from 'react';

const Servers: React.FC = () => {
  return (
    <div className="servers-container">
      <img 
        src={`${process.env.PUBLIC_URL}/assets/sprites/servers/animated_control_room_server.gif`}
        alt="Server Left"
        className="server server-left"
      />
      <img 
        src={`${process.env.PUBLIC_URL}/assets/sprites/servers/animated_control_room_screens_16x16.gif`}
        alt="Computer"
        className="server server-center"
      />
      <img 
        src={`${process.env.PUBLIC_URL}/assets/sprites/servers/animated_control_room_server.gif`}
        alt="Server Right"
        className="server server-right"
      />
    </div>
  );
};

export default React.memo(Servers);