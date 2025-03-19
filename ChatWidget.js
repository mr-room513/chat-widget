import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "https://ai-sales-bot.onrender.com"; // Подставь свою ссылку

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socket = io(SERVER_URL);

  useEffect(() => {
    socket.on("botMessage", (message) => {
      setMessages((prev) => [...prev, { role: "bot", text: message }]);
      setIsTyping(false);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { role: "user", text: input }]);
    setIsTyping(true);
    socket.emit("userMessage", input);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl rounded-lg p-4">
      <div className="p-2 border-b font-semibold">Чат с AI-продавцом</div>
      <div className="h-64 overflow-y-auto p-3 flex flex-col">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right text-blue-500" : "text-left text-gray-700"}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="text-gray-500 italic">AI печатает...</div>}
      </div>
      <div className="flex border-t p-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg" onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}
