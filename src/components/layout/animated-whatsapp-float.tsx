"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi2";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const REMOVE_RADIUS = 92;
const DRAG_CLICK_THRESHOLD = 10;

type AnimatedWhatsAppFloatProps = {
  phoneInternational: string;
};

export function AnimatedWhatsAppFloat({
  phoneInternational,
}: AnimatedWhatsAppFloatProps) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [overRemoveZone, setOverRemoveZone] = useState(false);
  const reduceMotion = useReducedMotion();
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const movedRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (closed) return;

    function onScroll() {
      const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = Math.max(maxScrollable * 0.3, 220);
      setVisible(window.scrollY > threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [closed]);

  function isInsideRemoveZone() {
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (!rect) {
      return false;
    }

    const bubbleCenterX = rect.left + rect.width / 2;
    const bubbleCenterY = rect.top + rect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const distance = Math.hypot(bubbleCenterX - viewportCenterX, bubbleCenterY - viewportCenterY);

    return distance <= REMOVE_RADIUS;
  }

  if (closed) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <>
          <AnimatePresence>
            {dragging ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none fixed inset-0 z-[117] hidden md:block"
              >
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed backdrop-blur-sm transition-all duration-200 ${
                      overRemoveZone
                        ? "scale-110 border-red-300 bg-red-500/18 text-red-500"
                        : "border-[var(--outline-variant)] bg-white/82 text-[var(--muted)]"
                    }`}
                  >
                    <HiOutlineTrash className="text-[2rem]" aria-hidden="true" />
                  </div>
                  <p
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      overRemoveZone ? "text-red-500" : "text-[var(--on-surface-variant)]"
                    }`}
                  >
                    Remove bubble chat
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.div
            ref={bubbleRef}
            drag
            dragMomentum={false}
            dragElastic={0.08}
            style={{ x, y }}
            onDragStart={() => {
              movedRef.current = false;
              setDragging(true);
              setOverRemoveZone(false);
            }}
            onDrag={(_, info) => {
              if (
                !movedRef.current &&
                (Math.abs(info.offset.x) > DRAG_CLICK_THRESHOLD ||
                  Math.abs(info.offset.y) > DRAG_CLICK_THRESHOLD)
              ) {
                movedRef.current = true;
              }

              setOverRemoveZone(isInsideRemoveZone());
            }}
            onDragEnd={() => {
              const shouldRemove = isInsideRemoveZone();
              setDragging(false);
              setOverRemoveZone(false);

              if (shouldRemove) {
                setClosed(true);
              }
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    scale: dragging ? 1.02 : 1,
                  }
            }
            exit={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[118] hidden cursor-grab active:cursor-grabbing md:block"
          >
            <div className="relative">
              <motion.div
                animate={
                  reduceMotion || dragging
                    ? undefined
                    : { y: [0, -3, 0], scale: [0.985, 1, 1] }
                }
                transition={{
                  duration: 1.2,
                  repeat: dragging ? 0 : 1,
                  repeatDelay: 0.2,
                }}
              >
                <Link
                  href={buildWhatsAppUrl(
                    buildGeneralWhatsAppMessage(),
                    phoneInternational,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => {
                    if (movedRef.current) {
                      event.preventDefault();
                      window.setTimeout(() => {
                        movedRef.current = false;
                      }, 0);
                    }
                  }}
                  className={`flex items-center gap-3 rounded-full bg-[#25D366] py-2 pl-2 pr-5 font-bold text-white shadow-2xl transition-all duration-300 ${
                    dragging
                      ? "shadow-[0_24px_50px_-24px_rgba(37,211,102,0.95)]"
                      : "hover:scale-[1.03] hover:shadow-[0_22px_45px_-18px_rgba(37,211,102,0.7)]"
                  }`}
                  aria-label="Tanya Admin via WhatsApp"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                    <FaWhatsapp className="text-[24px]" aria-hidden="true" />
                  </span>
                  <span className="pr-2">Tanya Admin</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
