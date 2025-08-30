import React, { useEffect, useMemo, useRef, useState } from "react";

const ChatWidget: React.FC = () => {
  const CHAT_SRC =
    (import.meta as any)?.env?.VITE_CHAT_SRC ||
    (process as any)?.env?.REACT_APP_CHAT_SRC ||
    "https://pangoai.app/chat/chat.html";

  const CHAT_ORIGIN = useMemo(() => {
    try {
      return new URL(CHAT_SRC).origin;
    } catch {
      return "*";
    }
  }, [CHAT_SRC]);

  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false);

  // lock background scroll when expanded
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

  // measure real viewport height for mobile fullscreen
  useEffect(() => {
    const setMeasuredVh = () => {
      const vh = window.innerHeight;
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

  // listen to expand/shrink from chat.html
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (CHAT_ORIGIN !== "*" && event.origin !== CHAT_ORIGIN) return;
      const action = (event.data && (event.data as any).action) || "";
      if (action === "expandChat") { setExpanded(true); expandedRef.current = true; }
      if (action === "shrinkChat") { setExpanded(false); expandedRef.current = false; }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [CHAT_ORIGIN]);

  useEffect(() => {
    const reapply = () => { if (expandedRef.current) setExpanded(e => e); };
    window.addEventListener("resize", reapply);
    window.addEventListener("orientationchange", reapply);
    return () => {
      window.removeEventListener("resize", reapply);
      window.removeEventListener("orientationchange", reapply);
    };
  }, []);

  // styles
  const base: React.CSSProperties = {
    position: "fixed",
    border: 0,
    zIndex: 2147483647,
    background: "transparent",
    overflow: "hidden",         // ✅ hard-clip contents to the circle
    transition: "all 0.28s ease-in-out",
    pointerEvents: "auto",
  };

  const collapsed: React.CSSProperties = {
    right: 16,
    bottom: 16,
    width: 120,
    height: 120,
    borderRadius: "50%",
    boxShadow: "none",          // ✅ no glow while collapsed
  };

  const expandedStyle: React.CSSProperties = {
    top: 0,
    left: 0,
    width: "100vw",
    height: "var(--chat-vh)",   // true fullscreen height
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
  };

  const style = { ...base, ...(expanded ? expandedStyle : collapsed) };

  return (
    <iframe
      src={CHAT_SRC}
      allow="clipboard-write; clipboard-read; fullscreen"
      title="Pangolin AI Chat"
      aria-label="Pangolin AI Chat"
      style={style}
    />
  );
};

export default ChatWidget;
