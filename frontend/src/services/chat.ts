import axios from "axios";

export type ChatRole = "user" | "assistant";

export type ChatMessageData = {
    role: ChatRole;
    content: string;
};

// Isi VITE_API_URL di frontend/.env, contoh: VITE_API_URL=http://localhost:8000
// Kalau kosong, chat memakai jawaban tiruan supaya UI tetap bisa dicoba tanpa backend.
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const api = axios.create({ baseURL: API_URL });

export async function sendChat(message: string): Promise<string> {
    if (!API_URL) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        return `Ini jawaban contoh untuk: "${message}".\nHubungkan backend lewat VITE_API_URL untuk jawaban asli.`;
    }

    // TODO: sesuaikan path dan bentuk body/response dengan endpoint backend kamu.
    const { data } = await api.post("/chat", { message });
    return data.reply;
}
