import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  color: string; 
}

interface UserPresenceProps {
  wsUrl: string; 
  currentUserId: string;
}

const UserPresence: React.FC<UserPresenceProps> = ({ wsUrl, currentUserId }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);


    ws.onmessage = (event) => {
      const onlineUsers: User[] = JSON.parse(event.data);
      setUsers(onlineUsers);
    };

   
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", userId: currentUserId }));
    };

    return () => {
      ws.close();
    };
  }, [wsUrl, currentUserId]);

  return (
    <div className="flex items-center space-x-2">
      {users.map((user) => (
        <div
          key={user.id}
          className={`w-4 h-4 rounded-full`}
          style={{ backgroundColor: user.color }}
          title={user.name}
        ></div>
      ))}
    </div>
  );
};

export default UserPresence;
