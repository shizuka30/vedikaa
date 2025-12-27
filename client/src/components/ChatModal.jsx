// client/src/components/ChatModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IoMdSend } from 'react-icons/io';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000");

const ChatModal = ({ managerName, bookingId, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const chatBodyRef = useRef(null);
  const room = bookingId;

  // This hook runs ONLY ONCE when the component mounts.
  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
      
      const receiveMessageHandler = (data) => {
        // All messages, including our own, will come from the server.
        setMessageList((list) => [...list, data]);
      };
      
      socket.on("receive_message", receiveMessageHandler);
      
      // Cleanup function to remove the listener when the modal closes.
      return () => {
        socket.off("receive_message", receiveMessageHandler);
      };
    }
  }, []); // The empty array [] is crucial.

  // This effect scrolls to the bottom when new messages are added.
  useEffect(() => {
    chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
  }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: userInfo.user.name,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      // 1. Send the message to the server.
      await socket.emit("send_message", messageData);
      
      // 2. DO NOT add the message manually. The server will send it back to us.
      // THIS IS THE KEY FIX that removes the duplicate message.
      
      // 3. Clear the input.
      setCurrentMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end sm:items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[70vh] flex flex-col">
        <header className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Chat with {managerName}</h2>
          <button onClick={onClose} className="text-2xl font-bold leading-none">×</button>
        </header>
        <main ref={chatBodyRef} className="flex-grow p-4 overflow-y-auto bg-gray-100">
          {messageList.map((msg, i) => (
            <div key={i} className={`flex mb-4 ${msg.author === userInfo.user.name ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-xs ${msg.author === userInfo.user.name ? 'bg-primary text-white' : 'bg-gray-300 text-black'}`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 text-right ${msg.author === userInfo.user.name ? 'text-gray-200' : 'text-gray-600'}`}>{msg.author} at {msg.time}</p>
              </div>
            </div>
          ))}
        </main>
        <footer className="p-4 border-t flex gap-2">
          <input 
            type="text" 
            value={currentMessage}
            placeholder="Type a message..." 
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => { e.key === "Enter" && sendMessage(); }}
            className="flex-grow border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
          />
          <button onClick={sendMessage} className="bg-primary text-white p-3 rounded-md hover:bg-primary-dark transition-colors"><IoMdSend size={24} /></button>
        </footer>
      </div>
    </div>
  );
};
export default ChatModal;