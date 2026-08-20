"use client";

/**
 * useTypewriter
 * --------------
 * A custom typewriter hook that types + deletes a rotating list of phrases.
 *
 * Behavior:
 *  - Types each character (TYPE_DELAY_MS = 50ms).
 *  - Pauses HOLD_MS (1.5s) at full phrase.
 *  - Deletes each character (DELETE_DELAY_MS = 30ms).
 *  - Pauses EMPTY_MS (0.5s) when empty, then advances to next phrase.
 *  - Loops forever through the phrase list.
 *
 * Accessibility:
 *  - If prefers-reduced-motion is set, returns the first phrase statically
 *    (no typing/deleting animation).
 *
 * @param phrases list of strings to cycle through.
 * @returns { text, phraseIndex } where `text` is the currently-typed substring.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const TYPE_DELAY_MS = 35;
const HOLD_MS = 2500;
const DELETE_DELAY_MS = 25;
const EMPTY_MS = 300;

type Phase = "typing" | "holding" | "deleting" | "empty";

export interface UseTypewriterResult {
  /** Currently-typed substring of the active phrase. */
  text: string;
  /** Index of the active phrase in the input list. */
  phraseIndex: number;
  /** True when a typing or deleting animation is in progress. */
  animating: boolean;
}

export function useTypewriter(phrases: string[]): UseTypewriterResult {
  const prefersReduced = useReducedMotion();
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Refs so we can mutate internal state without re-running the effect
  // (and so timers can read the latest values when they fire).
  const phaseRef = useRef<Phase>("typing");
  const posRef = useRef(0);
  const phraseRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending timer.
  const clear = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Schedule the next step. Each step:
  //  - typing: add a char, or transition to holding when full
  //  - holding: wait HOLD_MS, then transition to deleting
  //  - deleting: remove a char, or transition to empty when depleted
  //  - empty: wait EMPTY_MS, then advance phrase + start typing
  const step = () => {
    const phrase = phrases[phraseRef.current] ?? "";
    const phase = phaseRef.current;

    if (phase === "typing") {
      const nextPos = posRef.current + 1;
      posRef.current = nextPos;
      setText(phrase.slice(0, nextPos));
      setAnimating(true);
      if (nextPos >= phrase.length) {
        phaseRef.current = "holding";
        timerRef.current = setTimeout(step, HOLD_MS);
      } else {
        timerRef.current = setTimeout(step, TYPE_DELAY_MS);
      }
      return;
    }

    if (phase === "holding") {
      // Just wait — schedule the transition to deleting.
      phaseRef.current = "deleting";
      timerRef.current = setTimeout(step, 0);
      return;
    }

    if (phase === "deleting") {
      const nextPos = posRef.current - 1;
      posRef.current = nextPos;
      setText(phrase.slice(0, Math.max(0, nextPos)));
      if (nextPos <= 0) {
        phaseRef.current = "empty";
        setAnimating(false);
        timerRef.current = setTimeout(step, EMPTY_MS);
      } else {
        timerRef.current = setTimeout(step, DELETE_DELAY_MS);
      }
      return;
    }

    // empty — advance to next phrase, start typing
    const nextPhraseIdx = (phraseRef.current + 1) % phrases.length;
    phraseRef.current = nextPhraseIdx;
    setPhraseIndex(nextPhraseIdx);
    phaseRef.current = "typing";
    posRef.current = 0;
    setText("");
    timerRef.current = setTimeout(step, TYPE_DELAY_MS);
  };

  useEffect(() => {
    if (phrases.length === 0) return;

    if (prefersReduced) {
      // Static — show first phrase fully, no animation.
      // Defer setState to a microtask so we don't trigger cascading renders
      // inside the effect body.
      const id = setTimeout(() => {
        clear();
        setText(phrases[0]);
        setPhraseIndex(0);
        setAnimating(false);
      }, 0);
      return () => clearTimeout(id);
    }

    // Start with the first phrase FULLY TYPED (instant, no animation on load)
    // so the hero looks complete immediately. Only animate transitions
    // between phrases (delete → re-type).
    phaseRef.current = "holding";
    posRef.current = phrases[0]?.length ?? 0;
    phraseRef.current = 0;
    // Defer the initial state sync to avoid cascading renders.
    const initId = setTimeout(() => {
      setText(phrases[0] ?? "");
      setPhraseIndex(0);
      setAnimating(false);
    }, 0);
    // Schedule the first transition (after HOLD_MS, start deleting).
    timerRef.current = setTimeout(step, HOLD_MS);

    return () => {
      clearTimeout(initId);
      clear();
    };
  }, [prefersReduced, phrases.join("|")]);

  return { text, phraseIndex, animating };
}

export default useTypewriter;
