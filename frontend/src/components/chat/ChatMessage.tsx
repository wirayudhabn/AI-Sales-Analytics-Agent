import type { ChatMessageData } from "../../services/chat";

const ChatMessage = ({ role, content }: ChatMessageData) => {
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <p className="max-w-[80%] break-words rounded-lg bg-blue-600 px-4 py-2 text-white whitespace-pre-wrap leading-relaxed">
                {content}
            </p>
        </div>
    );
};

export default ChatMessage;
