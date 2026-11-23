import type { ChatMessageData } from "../../services/chat";

const ChatMessage = ({ role, content }: ChatMessageData) => {
    return (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
            <p
                className={
                    role === "user"
                        ? "max-w-[80%] break-words rounded-lg bg-blue-600 px-4 py-2 text-white whitespace-pre-wrap leading-relaxed"
                        : "max-w-[80%] break-words whitespace-pre-wrap leading-relaxed text-gray-900"
                }
            >
                {content}
            </p>
        </div>
    );
};

export default ChatMessage;
