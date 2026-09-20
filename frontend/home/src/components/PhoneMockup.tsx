'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, CheckCircle2, Play, Pause, RotateCcw, ExternalLink, Sparkles } from 'lucide-react';

export default function PhoneMockup() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(0.76);
  const [iframeHeight, setIframeHeight] = useState(820);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isPausedByInteraction, setIsPausedByInteraction] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Measure container dimensions and compute responsive scale for 390px mobile viewport
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth > 0 && clientHeight > 0) {
        const computedScale = clientWidth / 390;
        setScale(computedScale);
        setIframeHeight(Math.ceil(clientHeight / computedScale));
      }
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Open invitation helper
  const ensureInvitationOpened = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const coverGate = doc.getElementById('cover-gate');
      const openBtn = doc.getElementById('btn-open-invitation');
      if (coverGate && !coverGate.classList.contains('-translate-y-full')) {
        // Mute music to prevent autoplay blocking
        const bgAudio = doc.getElementById('bg-music') as HTMLAudioElement | null;
        if (bgAudio) bgAudio.muted = true;
        if (openBtn) openBtn.click();
      }
    } catch {
      // Ignore cross-origin error if any
    }
  }, []);

  // Handle iframe load and attach interaction listeners for auto-pause
  const handleIframeLoad = () => {
    setIsLoaded(true);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Inject zero-gutter floating scrollbar into embedded iframe
      const styleEl = doc.createElement('style');
      styleEl.textContent = `
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          overflow-y: overlay !important;
        }
        ::-webkit-scrollbar {
          width: 0px !important;
          height: 0px !important;
          display: none !important;
          background: transparent !important;
        }
      `;
      doc.head.appendChild(styleEl);

      // Auto-open cover gate after 2.5s for seamless preview demo
      const autoOpenTimer = setTimeout(() => {
        ensureInvitationOpened();
      }, 2500);

      // Listen for user interactions inside iframe to pause auto-scroll
      let resumeTimeout: NodeJS.Timeout;
      const pauseScrolling = () => {
        setIsPausedByInteraction(true);
        clearTimeout(resumeTimeout);
      };

      const resumeScrolling = (delay = 3500) => {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          setIsPausedByInteraction(false);
        }, delay);
      };

      doc.addEventListener('mouseenter', pauseScrolling);
      doc.addEventListener('mouseleave', () => resumeScrolling(2000));
      doc.addEventListener('wheel', () => {
        pauseScrolling();
        resumeScrolling(3000);
      }, { passive: true });
      doc.addEventListener('touchstart', pauseScrolling, { passive: true });
      doc.addEventListener('touchend', () => resumeScrolling(3000), { passive: true });
      doc.addEventListener('scroll', () => {
        const win = iframeRef.current?.contentWindow;
        if (win && doc.documentElement) {
          const scrollY = win.scrollY || doc.documentElement.scrollTop;
          const maxScroll = doc.documentElement.scrollHeight - win.innerHeight;
          if (maxScroll > 0) {
            setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));
          }
        }
      }, { passive: true });

      return () => {
        clearTimeout(autoOpenTimer);
        clearTimeout(resumeTimeout);
      };
    } catch {
      // Ignore if access denied
    }
  };

  // Continuous auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling || isPausedByInteraction || !isLoaded) return;

    let animId: number;
    let isResetting = false;

    const scrollLoop = () => {
      try {
        const win = iframeRef.current?.contentWindow;
        const doc = iframeRef.current?.contentDocument;

        if (win && doc && doc.documentElement && !isResetting) {
          const scrollY = win.scrollY || doc.documentElement.scrollTop;
          const maxScroll = doc.documentElement.scrollHeight - win.innerHeight;

          if (maxScroll > 100) {
            // Update floating scroll progress (0 to 1)
            setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));

            // Reached near bottom, pause and loop back to top
            if (scrollY >= maxScroll - 10) {
              isResetting = true;
              setTimeout(() => {
                win.scrollTo({ top: 0, behavior: 'smooth' });
                setScrollProgress(0);
                setTimeout(() => {
                  isResetting = false;
                }, 1800);
              }, 1500);
            } else {
              // Gentle 60fps auto-scroll (~1.1px per frame)
              win.scrollBy(0, 1.1);
            }
          }
        }
      } catch {
        // Safe catch
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoScrolling, isPausedByInteraction, isLoaded]);

  const resetToTop = () => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (win) {
        win.scrollTo({ top: 0, behavior: 'smooth' });
        setScrollProgress(0);
      }
    } catch {
      // Safe catch
    }
  };

  return (
    <div className="relative mx-auto flex flex-col items-center select-none">

      {/* Cheerful Warm Ambient Glow behind Phone */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-rose-400/25 via-amber-300/30 to-orange-400/25 blur-3xl -z-10 rounded-[60px] animate-pulse"></div>

      {/* Phone Frame (iPhone 16 Pro Style) berada di z-10 di depan badge */}
      <div className="relative z-10 w-[285px] sm:w-[325px] h-[580px] sm:h-[630px] bg-stone-900 rounded-[50px] p-3.5 shadow-2xl ring-2 ring-stone-700/80 border-[3px] border-amber-400/30 flex flex-col">

        {/* Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-center shadow-xs pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mr-2"></div>
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
        </div>

        {/* Screen Container */}
        <div
          ref={containerRef}
          className="relative w-full flex-1 bg-[#1E1916] rounded-[38px] overflow-hidden flex flex-col justify-between text-slate-900 shadow-inner border border-stone-800"
          onMouseEnter={() => setIsPausedByInteraction(true)}
          onMouseLeave={() => {
            setTimeout(() => setIsPausedByInteraction(false), 2000);
          }}
        >
          {/* Status Bar Overlay */}
          <div className="absolute top-0 left-0 right-0 pt-2 px-6 flex justify-between items-center text-[10px] font-semibold text-stone-300 z-30 pointer-events-none bg-gradient-to-b from-black/60 to-transparent pb-3">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-rose-500/30 text-rose-200 px-1.5 py-0.2 rounded font-bold border border-rose-400/30">5G</span>
              <div className="w-4 h-2 border border-stone-400 rounded-sm p-0.5">
                <div className="h-full w-full bg-emerald-400 rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Embedded Scaled Mobile Iframe */}
          <div className="relative w-full h-full overflow-hidden">
            <iframe
              ref={iframeRef}
              src="/templates/wedding-rustic/index.html?to=Sahabat+Tercinta"
              title="Demo Undangan Pernikahan"
              onLoad={handleIframeLoad}
              className="border-0 select-auto w-full h-full"
              style={{
                width: '390px',
                height: `${iframeHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          </div>

          {/* Floating iOS-style Scroll Indicator (Mengambang di atas konten tanpa memakan space) */}
          <div className="absolute right-1 top-16 bottom-16 w-1 pointer-events-none z-40">
            <div
              className="w-1 bg-amber-400/80 backdrop-blur-xs rounded-full shadow-xs transition-transform duration-75 ease-out"
              style={{
                height: '36px',
                transform: `translateY(${scrollProgress * ((containerRef.current?.clientHeight || 580) - 150)}px)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
