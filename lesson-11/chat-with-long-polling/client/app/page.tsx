"use client";

import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:4000";
type ChatMessage = { id: number; author: string; text: string; createdAt: string };
type SubscriptionResponse = { messages: ChatMessage[]; reason: "message" | "timeout" };

export default function LongPollingChat() {
  const [author, setAuthor] = useState("Марина");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState("Відкриваємо довгий запит до сервера…");
  const lastMessageId = useRef(0);

  useEffect(() => {
    let isActive = true;
    async function subscribe(): Promise<void> {
      if (!isActive) return;
      setStatus("Запит відкритий: сервер чекає на нове повідомлення…");
      try {
        const { data } = await axios.get<SubscriptionResponse>(`${API_URL}/subscribe`, {
          params: { after: lastMessageId.current }, timeout: 30_000,
        });
        if (!isActive) return;
        if (data.messages.length > 0) {
          setMessages((current) => [...current, ...data.messages]);
          lastMessageId.current = data.messages.at(-1)!.id;
          setStatus("Сервер відповів новим повідомленням. Відкриваємо наступний запит…");
        } else {
          setStatus("Серверний таймаут. Відкриваємо наступний довгий запит…");
        }
      } catch {
        if (isActive) setStatus("З'єднання перервано. Повторна спроба за 1 секунду…");
        await new Promise((resolve) => window.setTimeout(resolve, 1_000));
      }
      await subscribe();
    }
    void subscribe();
    return () => { isActive = false; };
  }, []);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post(`${API_URL}/messages`, { author, text });
      setText("");
    } catch { setStatus("Не вдалося надіслати повідомлення"); }
  }

  return <main><section className="chat">
    <p className="eyebrow">Long polling · один відкритий GET на вкладку</p>
    <h1>Демонстраційний чат</h1>
    <p className="status" role="status">{status}</p>
    <div className="messages" aria-live="polite">
      {messages.length === 0 ? <p className="empty">Вкладка очікує відповідь від сервера…</p> : messages.map((message) => <article className="message" key={message.id}><strong>{message.author}</strong><time>{new Date(message.createdAt).toLocaleTimeString("uk-UA")}</time><p>{message.text}</p></article>)}
    </div>
    <form onSubmit={sendMessage}>
      <label>Ви<select value={author} onChange={(event) => setAuthor(event.target.value)}><option>Марина</option><option>Андрій</option></select></label>
      <label className="message-input">Повідомлення<input value={text} onChange={(event) => setText(event.target.value)} placeholder="Напишіть повідомлення" /></label>
      <button type="submit">Надіслати</button>
    </form>
  </section></main>;
}
