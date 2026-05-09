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
};

type ToastContextValue = {
  pushToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[130] flex flex-col items-center gap-3 px-4 md:bottom-8 md:items-end">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              exit="exit"
              variants={reduceMotion ? undefined : toastVariants}
              className="pointer-events-auto flex items-center gap-3 rounded-full border border-[var(--primary-container)]/70 bg-white px-5 py-3 text-sm font-semibold text-[var(--on-surface)] shadow-[0_18px_45px_-24px_rgba(47,58,61,0.28)]"
            >
              <HiOutlineCheckCircle className="text-[18px] text-[var(--primary)]" />
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
