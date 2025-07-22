"use client";
import { useEffect, useState, useRef } from "react";
import { X, Send } from "lucide-react";
import { getMovieRecommendations } from "@/app/api/chatbot/getMovieRecommendations";

const ChatWindow = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const t = useTranslations("gemini");

  useEffect(() => {
    scrollToBottom();
  }, [recommendations]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRecommendations([]);
    setIsLoading(true);
    try {
      const newRecommendations = await getMovieRecommendations(query);
      setRecommendations(newRecommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };
  return (
    <div
      className="fixed bottom-4 right-4 w-80 md:w-96 h-[450px]  rounded-lg shadow-xl flex flex-col font-sans"
      style={{ backgroundColor: "#1E1E1E" }}
    >
      <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">Movie Recommender</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {recommendations.length === 0 && !isLoading && !error && (
          <div className="text-white-500 text-center py-4">
            Enter a movie title, actor, or genre to get recommendations.
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Finding movies...</span>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {recommendations.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              We recommend these movies:
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              {recommendations.map((rec, index) => (
                <li key={index} className="mb-1">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 flex items-center"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter movie, actor, or genre..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50"
          disabled={isLoading}
          aria-label="Send query"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
