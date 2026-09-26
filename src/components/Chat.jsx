import { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const chatThreadRef = useRef(null);
  const textareaRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt) return;

    setChatActive(true);
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API Error: ${response.status}`);

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setMessages(prev => [...prev, { role: 'ai', text: data.candidates[0].content.parts[0].text }]);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `Neural Core Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdown = (text) => {
    return text
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };

  const closeChat = () => {
    setChatActive(false);
    setMessages([]);
  };

  return (
    <div className={`chat-wrapper ${chatActive ? 'chat-active' : ''}`}>
      <div className="chat-results-container" id="chat-thread" ref={chatThreadRef} style={{ display: chatActive ? 'block' : 'none' }}>
        <button className="close-chat-btn" id="close-chat" title="Exit Chat" onClick={closeChat}>&times;</button>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message message-${msg.role}`}>
            {msg.role === 'user' ? (
              <div className="user-content">{msg.text}</div>
            ) : (
              <>
                <div className="ai-avatar"><img src="/logo.png" alt="Aparox AI" className="avatar-logo" />Aparox</div>
                <div className="ai-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="search-container reveal-text">
        <div className="search-input-wrapper">
          <textarea 
            ref={textareaRef}
            placeholder="Describe your business or project needs for a quick AI consultation..." 
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          ></textarea>
        </div>
        <div className="search-toolbar">
          <div className="toolbar-left">
            <button className="tool-icon" title="Image"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
            <button className="tool-icon" title="Code"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></button>
            <button className="tool-icon" title="Reference"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></button>
            <div className="model-picker">
              <span className="gemini-icon">G</span>
              <span>Gemini 3 pro</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <div className="toolbar-right">
            <div className="design-system-picker">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
              <span>Use Design System</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <button className="send-btn" onClick={handleSend} disabled={loading}>
              {loading ? <div className="loader-dot"></div> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
