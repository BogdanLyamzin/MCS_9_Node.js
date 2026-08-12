"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";
const POLLING_INTERVAL_MS = 2_000;

type ChatMessage = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
};

export default function ChatPage() {
  const [author, setAuthor] = useState("Марина");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState("Перевіряємо нові повідомлення…");
  const lastMessageId = useRef(0);

  const poll = useCallback(async () => {
    try {
      const { data } = await axios.get<{ messages: ChatMessage[] }>(
        `${API_URL}/messages`,
        { params: { after: lastMessageId.current } },
      );
      if (data.messages.length > 0) {
        setMessages((current) => [...current, ...data.messages]);
        lastMessageId.current = data.messages.at(-1)!.id;
        setStatus(`Отримано ${data.messages.length} нове(их) повідомлення(нь)`);
      } else {
        setStatus("Нових повідомлень немає — але запит вже відбувся");
      }
    } catch {
      setStatus("Сервер недоступний. Наступна спроба — за 2 секунди");
    }
  }, []);

  useEffect(() => {
    void poll();
    const timer = window.setInterval(() => void poll(), POLLING_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [poll]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(`${API_URL}/messages`, { author, text });
    } catch {
      setStatus("Не вдалося надіслати повідомлення");
      return;
    }

    setText("");
    // Автор теж не отримує повідомлення напряму: UI чекає на наступний GET.
  }

  async function resetChat() {
    try {
      await axios.delete(`${API_URL}/messages`);
      setMessages([]);
      lastMessageId.current = 0;
      setStatus("Чат очищено");
    } catch {
      setStatus("Не вдалося очистити чат");
    }
  }

  return (
    <main>
      <section className="chat">
        <p className="eyebrow">Short polling · кожні {POLLING_INTERVAL_MS / 1000} секунди</p>
        <h1>Демонстраційний чат</h1>
        <p className="status" role="status">{status}</p>

        <div className="messages" aria-live="polite">
          {messages.length === 0 ? (
            <p className="empty">Повідомлень поки немає. Сервер все одно відповідає на кожен GET.</p>
          ) : messages.map((message) => (
            <article className="message" key={message.id}>
              <strong>{message.author}</strong>
              <time>{new Date(message.createdAt).toLocaleTimeString("uk-UA")}</time>
              <p>{message.text}</p>
            </article>
          ))}
        </div>

        <form onSubmit={sendMessage}>
          <label>
            Ви
            <select value={author} onChange={(event) => setAuthor(event.target.value)}>
              <option>Марина</option>
              <option>Андрій</option>
            </select>
          </label>
          <label className="message-input">
            Повідомлення
            <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Напишіть повідомлення" />
          </label>
          <button type="submit">Надіслати</button>
          <button type="button" className="secondary" onClick={() => void resetChat()}>Очистити чат</button>
        </form>
      </section>
    </main>
  );
}
