import React, { useEffect, useMemo, useRef, useState } from "react";

const ChatWidget: React.FC = () => {
  // ✅ Set your deployed chat.html here or via env
  const CHAT_SRC =
    (import.meta as any)?.env?.VITE_CHAT_SRC ||
    "https://pangoai.app/chat/chat.html";

  // Derive the allowed origin from CHAT_SRC
  const CHAT_ORIGIN = useMemo(() => {
    try {
      return new URL(CHAT_SRC).origin;
    } catch {
      return "*";
    }
  }, [CHAT_SRC]);

  const [expanded, setExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // 🔒 Prevent background scroll when expanded
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (expanded) {
      const prevHtmlOverflow = html.style.overflow;
      const prevBodyOverflow = body.style.overflow;
      const prevTouchAction = (body.style as any).touchAction;

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      (body.style as any).touchAction = "none";

      return () => {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
        (body.style as any).touchAction = prevTouchAction;
      };
    }
  }, [expanded]);

  // 📏 Mobile 100vh fix using measured innerHeight
  useEffect(() => {
    const setMeasuredVh = () => {
      const vh = window.innerHeight; // visible viewport height
      document.documentElement.style.setProperty("--chat-vh", `${vh}px`);
    };
    setMeasuredVh();
    window.addEventListener("resize", setMeasuredVh);
    window.addEventListener("orientationchange", setMeasuredVh);
    return () => {
      window.removeEventListener("resize", setMeasuredVh);
      window.removeEventListener("orientationchange", setMeasuredVh);
    };
  }, []);

  // 📨 Listen for expand/shrink messages from chat.html
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (CHAT_ORIGIN !== "*" && event.origin !== CHAT_ORIGIN) return;
      const action = (event.data && (event.data as any).action) || "";
      if (action === "expandChat") setExpanded(true);
      if (action === "shrinkChat") setExpanded(false);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [CHAT_ORIGIN]);

  // ♻️ Keep full-screen sizing correct after rotation/resize
  useEffect(() => {
    const reapply = () => setExpanded((e) => e); // trigger rerender
    window.addEventListener("resize", reapply);
    window.addEventListener("orientationchange", reapply);
    return () => {
      window.removeEventListener("resize", reapply);
      window.removeEventListener("orientationchange", reapply);
    };
  }, []);

  // 🎯 Styles
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    border: "none",
    zIndex: 2147483647, // on top of everything
    background: "transparent",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    transition: "all 0.28s ease-in-out",
    pointerEvents: "auto",
  };

  const collapsedStyle: React.CSSProperties = {
    right: 16,
    bottom: 16,
    width: 120,
    height: 120,
    borderRadius: "50%",
  };

  // Full-screen (true viewport) with multiple fallbacks:
  // height uses measured var(--chat-vh) to avoid mobile 100vh bugs.
  const expandedStyle: React.CSSProperties = {
    top: 0,
    left: 0,
    width: "100vw",
    height: "var(--chat-vh)", // measured visible viewport height
    borderRadius: 0,
  };

  const style: React.CSSProperties = {
    ...baseStyle,
    ...(expanded ? expandedStyle : collapsedStyle),
  };

  return (
    <iframe
      ref={iframeRef}
      src={CHAT_SRC}
      allow="clipboard-write; clipboard-read; fullscreen"
      title="Pangolin AI Chat"
      aria-label="Pangolin AI Chat"
      style={style}
    />
  );
};

export default ChatWidget;
