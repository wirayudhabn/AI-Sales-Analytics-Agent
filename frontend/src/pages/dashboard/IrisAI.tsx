import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    content: "Pilih satu produk yang harus aku perhatikan?",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Berdasarkan analisis performa produk dalam 30 hari terakhir, ada 1 produk yang memerlukan perhatian khusus karena tren penjualannya mengalami penurunan atau memiliki potensi risiko stok, yaitu Coca Cola.\nCatatan: Penjualan turun 35% dibanding bulan lalu.\nSaran: Kemungkinan besar pengunjung mengurungkan niat beli karena olahraga lari sedang tren atau kompetitor menawarkan harga lebih kompetitif. Coba tinjau ulang harga atau hentikan penjualan produk ini untuk sementara waktu.\nMau kita bedah lebih dalam strategi perbaikan untuk produk di tersebut?",
  },
];

const bodyTextClass =
  "font-body font-[number:var(--body-font-weight)] text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]";

const headingTextClass =
  "font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] [font-style:var(--heading-6-font-style)]";

export const IrisAI = (): ReactElement => {
  const [messageDraft, setMessageDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = messageDraft.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: "user",
        content: trimmedMessage,
      },
    ]);
    setMessageDraft("");
  };

  return (
    <div className="iris-chat relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-bg-primary">
      <main
        className="absolute left-[10%] right-[10%] top-11 flex flex-col items-end gap-8"
        aria-label="Iris AI conversation"
      >
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className="relative inline-flex flex-[0_0_auto] items-center justify-center rounded-[8px_0px_8px_8px] bg-accent-primary p-3"
              >
                <p
                  className={`${bodyTextClass} relative mt-[-1px] w-fit text-center text-bg-primary`}
                >
                  {message.content}
                </p>
              </div>
            );
          }

          return (
            <p
              key={message.id}
              className={`${bodyTextClass} relative self-stretch whitespace-pre-line text-text-primary`}
            >
              {message.content}
            </p>
          );
        })}
      </main>
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-6 left-1/2 flex w-[min(640px,calc(100%-3rem))] -translate-x-1/2 items-center justify-between rounded-[100px] border border-solid border-border bg-white px-4 py-5"
      >
        <div className="relative inline-flex min-w-0 flex-[0_0_auto] flex-1 items-center gap-2">
          <svg
            className="relative h-6 w-6 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <label htmlFor="message-input" className="sr-only">
            Message Iris
          </label>
          <input
            id="message-input"
            type="text"
            value={messageDraft}
            onChange={(event) => setMessageDraft(event.target.value)}
            placeholder="Tanya apa saja terkait bisnismu.."
            className={`${headingTextClass} relative w-full text-text-secondary placeholder:text-text-secondary`}
          />
        </div>
        <button
          type="submit"
          aria-label="Send message"
          className="relative h-6 w-6 shrink-0 text-accent-primary"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 20 18-8L3 4l3 8-3 8Zm3-8h15" />
          </svg>
        </button>
      </form>
    </div>
  );
};
