import { useEffect, useRef, useState } from "react";
import { Header, Sidebar } from "../../components";
import ChatInput from "../../components/chat/ChatInput";
import ChatMessage from "../../components/chat/ChatMessage";
import { sendChat } from "../../services/chat";
import type { ChatMessageData } from "../../services/chat";

const IrisAI = () => {
    const [hide, setHide] = useState(false);
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setHide(!hide);
    };

    // Gulir otomatis ke pesan terbaru
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setInput("");
        setLoading(true);

        try {
            const reply = await sendChat(text);
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Maaf, jawaban gagal dimuat. Coba kirim ulang pesanmu." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const isEmpty = messages.length === 0;

    return (
        <div className="flex min-w-0">
            {/* Sidebar */}
            <Sidebar hide={hide} page={4} />

            <div className="flex-1 min-w-0 h-dvh flex flex-col">
                {/* Header */}
                <Header hide={hide} handleClick={handleClick} />

                {isEmpty ? (
                    // Keadaan kosong: sapaan dan input di tengah
                    <main className="flex-1 min-h-0 flex flex-col items-center justify-center gap-8 px-7">
                        <h1 className="text-3xl font-semibold text-black text-center">
                            Halo, mau bahas apa hari ini?
                        </h1>
                        <ChatInput value={input} onChange={setInput} onSubmit={handleSend} disabled={loading} />
                    </main>
                ) : (
                    // Keadaan chat: pesan bisa digulir, input menempel di bawah
                    <main className="flex-1 min-h-0 min-w-0 flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                            <div className="mx-auto w-full min-w-0 max-w-4xl space-y-8 px-7 py-8">
                                {messages.map((m, i) => (
                                    <ChatMessage key={i} role={m.role} content={m.content} />
                                ))}
                                {loading && <p className="animate-pulse text-gray-500">Iris sedang menjawab...</p>}
                                <div ref={bottomRef} />
                            </div>
                        </div>
                        <div className="flex justify-center px-7 pb-8 pt-2">
                            <ChatInput value={input} onChange={setInput} onSubmit={handleSend} disabled={loading} />
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
};

export default IrisAI;
