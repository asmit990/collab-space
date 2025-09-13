import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  color: string; // each user gets a color
}

interface UserPresenceProps {
  wsUrl: string; // WebSocket URL for presence updates
  currentUserId: string;
}

const UserPresence: React.FC<UserPresenceProps> = ({ wsUrl, currentUserId }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    // Listen for presence updates
    ws.onmessage = (event) => {
      const onlineUsers: User[] = JSON.parse(event.data);
      setUsers(onlineUsers);
    };

    // Notify server of current user joining
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
