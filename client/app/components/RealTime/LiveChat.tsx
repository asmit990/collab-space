import React, { useEffect, useState, useRef } from "react";

interface Message {
  id: string;
  user: string;
  text: string;
}

interface LiveChatProps {
  wsUrl: string; 
  username: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ wsUrl, username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket
  useEffect(() => {
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => {
      ws.current?.close();
    };
  }, [wsUrl]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current) return;

    const msg: Message = {
      id: Date.now().toString(),
      user: username,
      text: input.trim(),
    };

    ws.current.send(JSON.stringify(msg));
    setInput("");
  };

  return (
    <div className="flex flex-col border rounded h-80 w-80 bg-white">
      <div className="flex-1 p-2 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <span className="font-semibold">{msg.user}:</span> {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex p-2 border-t">
        <input
          className="flex-1 px-2 py-1 border rounded mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
