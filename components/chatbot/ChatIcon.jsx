import { Bot} from 'lucide-react';
const ChatIcon = ({ toggleChat }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
      aria-label="Open chat"
    >
      <Bot size={28} />
    </button>
  );
};

export default ChatIcon;