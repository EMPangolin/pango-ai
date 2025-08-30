import React, { useEffect, useState } from "react";

const ChatIntegration = () => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.action === "expandChat") setExpanded(true);
      if (event.data.action === "shrinkChat") setExpanded(false);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <iframe
      src="https://pangoai.app/chat/chat.html"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: expanded ? "448px" : "120px",   // video size
        height: expanded ? "80vh" : "120px",  // expands to chat
        border: "none",
        zIndex: 10000,
        borderRadius: expanded ? "12px" : "50%", // round video, square chat
        background: "transparent",
        transition: "all 0.3s ease-in-out",
      }}
      allow="clipboard-write; clipboard-read"
      title="PangoAI Chat"
    />
  );
};

export default ChatIntegration;
