import type { FormEvent } from "react";

type ChatInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
};

const ChatInput = ({ value, onChange, onSubmit, disabled = false }: ChatInputProps) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full min-w-0 max-w-4xl flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-4"
        >
            <button type="button" aria-label="Tambah lampiran" className="cursor-pointer text-gray-800">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
            </button>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Tanya apa saja terkait bisnismu.."
                className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-gray-500"
            />

            <button
                type="submit"
                aria-label="Kirim pesan"
                disabled={disabled || value.trim() === ""}
                className="cursor-pointer text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                    <path d="m21.854 2.147-10.94 10.939" />
                </svg>
            </button>
        </form>
    );
};

export default ChatInput;
