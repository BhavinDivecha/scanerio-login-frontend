"use client";

import React, { useEffect, useRef, useState } from "react";

const ExplosiveBurstAnimation: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const typeWrapRef = useRef<HTMLSpanElement | null>(null);
  const textElRef = useRef<HTMLSpanElement | null>(null);
  const tickRef = useRef<HTMLSpanElement | null>(null);
  const [ready, setReady] = useState(false);

  // Burst looper for the tick "O"
  const loopBurst = (el: HTMLElement, interval = 2300): NodeJS.Timeout => {
    const run = () => {
      const tickPaths = el.querySelectorAll(".tickpath");
      tickPaths.forEach((p) => ((p as SVGPathElement).style.strokeDashoffset = "1"));
      el.classList.remove("burst");
      void el.offsetWidth; // reflow to restart keyframes
      el.classList.add("burst");
    };
    run(); // immediate first burst
    return setInterval(run, interval);
  };

  useEffect(() => {
    const textEl = textElRef.current!;
    const tick = tickRef.current!;
    let intervalId: NodeJS.Timeout | null = null;

    // Attach BEFORE starting animations to avoid missing 'animationend'
    const onTypingEnd = (e: AnimationEvent) => {
      if (e.animationName !== "typing") return;
      typeWrapRef.current?.classList.add("done");
      if (tick) {
        // Fire first burst EXACTLY when last char shows
        intervalId = loopBurst(tick, 2300);
      }
    };

    textEl.addEventListener("animationend", onTypingEnd, { once: true });

    // Start all animations next frame (ensures listener is active)
    requestAnimationFrame(() => setReady(true));

    return () => {
      textEl.removeEventListener("animationend", onTypingEnd);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .scenario-line,
.scenario-word {
  align-items: center !important; /* keep the icon centered with the text line */
}
        .wrap { display: grid; gap: 24px; justify-items: center; max-width: 980px; }
        .scenario-line { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .logo-left .wrap { justify-items: start; }
        .logo-left .scenario-line { justify-content: flex-start; }
        .scenario-word {
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.05;
  color: #fff;
  display: flex;
}
        /* ---- Pause/Run gate to avoid race on reload ---- */
        .paused .typewriter .text,
        .paused .scenario-word .o-tick,
        .paused .scenario-word .o-tick::before,
        .paused .scenario-word .o-tick::after,
        .paused .scenario-word .o-tick .icon,
        .paused .scenario-word .o-tick .bits,
        .paused .scenario-word .o-tick .tickpath {
          animation-play-state: paused !important;
        }
        .run .typewriter .text,
        .run .scenario-word .o-tick,
        .run .scenario-word .o-tick::before,
        .run .scenario-word .o-tick::after,
        .run .scenario-word .o-tick .icon,
        .run .scenario-word .o-tick .bits,
        .run .scenario-word .o-tick .tickpath {
          animation-play-state: running !important;
        }

        /* ---- Typewriter ---- */
        .typewriter {
          --chars: 8;           /* 7 letters + tick as the 8th "char" */
          --typing-dur: 0.6s;   /* total typing duration */
          display: inline-block;
          vertical-align: baseline;
        }
        .typewriter .text {
          display: flex;
          align-items: center;
          justify-items:center;
          gap: 7px;
          overflow: visible;
          white-space: nowrap;
          
          width: 0ch;
          border-right: 0; /* caret removed */
          padding-right: 2px;
          animation:
            typing var(--typing-dur) steps(var(--chars)) forwards;
        }
        .typewriter.done .text {
          border-right-color: transparent;
          animation: none;
          width: 130px;
        }
        @keyframes typing { to { width: calc(var(--chars) * 1ch); } }
        @keyframes caret-blink { 50% { border-right-color: transparent; } }

        /* ---- Tick "O" (inside typed span, becomes visible on last step) ---- */
       
       
        .scenario-word .o-tick {
          bottom: 0.2rem;
          --size: 1.05em;
          --burst: #22c55e;
          --ray-gap: 32%;
          --ray-spread: 28deg;

          /* keyframe durations */
          --burst-dur: .6s;
          --rays-dur: .7s;
          --pop-dur: .4s;
          --bits-dur: .5s;

          position: relative;
          display: inline-grid;
          width: var(--size);
          height: var(--size);
          place-items: center;
          color: #fff;
          isolation: isolate;
          vertical-align: -0.05em;
          margin-left: -0.35em;
           vertical-align: -0.05em;
           bottom: 0.2rem;
        }


        
        .icon { transition: transform .2s; }

        .scenario-word .o-tick .icon {
  width: 1em;
  height: 1em;
  display: block;
}


        /* --- Burst keyframes are triggered by adding .burst via JS on typing end --- */
        .scenario-word .o-tick.burst::before {
          content:""; position:absolute; inset:0; border-radius:50%;
          background: radial-gradient(circle at center,
            color-mix(in srgb, var(--burst) 50%, transparent) 0 45%,
            transparent 62%);
          transform: scale(.1); opacity: 0; z-index: -1;
          animation: pulse var(--burst-dur) ease-out both;
        }
        .scenario-word .o-tick.burst::after {
          content:""; position:absolute; inset:-55%;
          background: conic-gradient(from 0deg,
            var(--burst) 0 7deg, transparent 7deg var(--ray-spread));
          -webkit-mask: radial-gradient(circle at center, transparent 0 var(--ray-gap), #000 calc(var(--ray-gap) + 1%));
                  mask: radial-gradient(circle at center, transparent 0 var(--ray-gap), #000 calc(var(--ray-gap) + 1%));
          transform: scale(.15) rotate(0deg); opacity: 0; z-index: -1;
          animation: rays var(--rays-dur) ease-out both;
        }
        .scenario-word .o-tick.burst .icon   { animation: pop  var(--pop-dur)  ease-out both; }
        .scenario-word .o-tick.burst .bits   { animation: bits var(--bits-dur) cubic-bezier(.2,.8,.2,1) both; }
        .tickpath { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .scenario-word .o-tick.burst .tickpath { animation: draw .55s ease-out .12s forwards; }

        @keyframes pop { 0% { transform: scale(1); } 40% { transform: scale(1.22); } 100% { transform: scale(1); } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes pulse { 0% { opacity: 0; transform: scale(.1); } 30% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2); } }

        @media (prefers-reduced-motion: reduce) {
          .scenario-word .o-tick::before,
          .scenario-word .o-tick::after,
          .scenario-word .o-tick .icon,
          .scenario-word .o-tick .bits,
          .scenario-word .o-tick .tickpath {
            animation: none !important; transition: none !important;
          }
        }
      `}</style>

      <div
        ref={wrapRef}
        className={`animation-container logo-left ${ready ? "run" : "paused"}`}
      >
        <div className="wrap">
          <div className="scenario-line">
            <div className="scenario-word">
              {/* Typewritten: 7 letters + tick as the 8th "character" */}
              <span className="typewriter" ref={typeWrapRef}>
                <span className="text mr-2" ref={textElRef}>
                  Scaneri
                  {/* Tick is inside the typed span; appears on last step */}
                  <span className="o-tick mt-2" ref={tickRef} aria-hidden="true">
                    <span className="bits" aria-hidden="true"></span>
                    <svg className="icon"  viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" >
                      <circle
                        cx="12" cy="12" r="9"
                        fill="#22c55e"
                        stroke="currentColor"
                        opacity=".75"
                        strokeWidth="2"
                      />
                      <path
                        className="tickpath"
                        pathLength="1"
                        d="M7 12.5l3.2 3.2L17.5 8.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplosiveBurstAnimation;
