"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { toastVariants } from "@/lib/motion";

type ToastItem = {
  id: string;
  message: string;
  tone: "success" | "error";
};

type ToastContextValue = {
  pushToast: (message: string, tone?: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, tone: "success" | "error" = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-4 z-[130] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 md:bottom-8 md:right-8 md:max-w-md">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              exit="exit"
              variants={reduceMotion ? undefined : toastVariants}
              className={`pointer-events-auto flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-semibold shadow-[0_18px_45px_-24px_rgba(47,58,61,0.28)] ${
                item.tone === "error"
                  ? "border-[var(--error)]/25 bg-[var(--surface-bright)] text-[var(--error)]"
                  : "border-[var(--primary-container)]/70 bg-white text-[var(--on-surface)]"
              }`}
            >
              <HiOutlineCheckCircle
                className={`text-[18px] ${
                  item.tone === "error" ? "text-[var(--error)]" : "text-[var(--primary)]"
                }`}
              />
              {item.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
