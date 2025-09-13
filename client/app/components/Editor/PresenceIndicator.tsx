import React, { useEffect, useState } from "react";

type PresenceUser = {
  id: string;
  name: string;
  color: string;
};

interface PresenceIndicatorProps {
  provider: any; 
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({ provider }) => {
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!provider.awareness) return;

   
    const awareness = provider.awareness;

    const updateUsers = () => {
      const states = Array.from(awareness.getStates().entries());
      const mapped = states.map(([clientId, state]: any) => ({
        id: String(clientId),
        name: state.user?.name || "Anonymous",
        color: state.user?.color || "#888",
      }));
      setUsers(mapped);
    };

    awareness.on("update", updateUsers);


    updateUsers();

    return () => {
      awareness.off("update", updateUsers);
    };
  }, [provider]);

  return (
    <div className="flex gap-2 items-center p-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
          style={{ backgroundColor: user.color }}
          title={user.name}
        >
          {user.name[0].toUpperCase()}
        </div>
      ))}
      {users.length === 0 && <span className="text-gray-500">No one online</span>}
    </div>
  );
};

export default PresenceIndicator;
