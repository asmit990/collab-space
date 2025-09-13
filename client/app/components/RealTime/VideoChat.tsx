import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // your signaling server

export const VideoChat = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("offer", async (offer) => {
      if (!peerConnectionRef.current) createPeerConnection();
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer!);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", (candidate) => {
      peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection();

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const joinRoom = async () => {
    setJoined(true);
    createPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTrack(track, stream);
    });

    const offer = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(offer!);
    socket.emit("offer", offer);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {!joined ? (
        <button
          onClick={joinRoom}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Join Video Chat
        </button>
      ) : (
        <div className="flex gap-4">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-64 rounded-lg shadow-lg" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-64 rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};
