import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── Pixel-art sleepy cat drawn with CSS box-shadows on a 1px base div ──────
const PX = 3; // pixel size in real px

const C = (col, row, color) => `${col * PX}px ${row * PX}px 0 ${color}`;

// Cat base pixel art – 16×14
const BASE_BODY_PIXELS = [
  // Ears
  C(4,1,'#3b2d2d'), C(5,1,'#f5c99a'), C(10,1,'#f5c99a'), C(11,1,'#3b2d2d'),
  C(3,2,'#3b2d2d'), C(4,2,'#f7b8b8'), C(5,2,'#f5c99a'), C(6,2,'#3b2d2d'),
  C(9,2,'#3b2d2d'), C(10,2,'#f5c99a'), C(11,2,'#f7b8b8'), C(12,2,'#3b2d2d'),
  // Top of head
  C(3,3,'#3b2d2d'), C(4,3,'#f5c99a'), C(5,3,'#f5c99a'), C(6,3,'#f5c99a'),
  C(7,3,'#f5c99a'), C(8,3,'#f5c99a'), C(9,3,'#f5c99a'), C(10,3,'#f5c99a'),
  C(11,3,'#f5c99a'), C(12,3,'#3b2d2d'),
  // Head row 4
  C(2,4,'#3b2d2d'), C(3,4,'#f5c99a'), C(4,4,'#f5c99a'), C(5,4,'#f5c99a'),
  C(6,4,'#f5c99a'), C(7,4,'#f5c99a'), C(8,4,'#f5c99a'), C(9,4,'#f5c99a'),
  C(10,4,'#f5c99a'), C(11,4,'#f5c99a'), C(12,4,'#f5c99a'), C(13,4,'#3b2d2d'),
  // Face row 6 – cheeks + nose
  C(2,6,'#3b2d2d'), C(3,6,'#f5c99a'), C(4,6,'#f5c99a'), C(5,6,'#f5c99a'),
  C(6,6,'#f5c99a'), C(7,6,'#f5c99a'), C(8,6,'#f7b8b8'),
  C(9,6,'#f5c99a'), C(10,6,'#f5c99a'), C(11,6,'#f5c99a'),
  C(12,6,'#f5c99a'), C(13,6,'#3b2d2d'),
  // Mouth / whisker row 7
  C(2,7,'#3b2d2d'), C(3,7,'#f5c99a'),
  C(4,7,'#e8d5b0'),
  C(5,7,'#f5c99a'), C(6,7,'#f5c99a'), C(7,7,'#f5c99a'), C(8,7,'#f5c99a'),
  C(9,7,'#f5c99a'), C(10,7,'#f5c99a'), C(11,7,'#f5c99a'),
  C(12,7,'#e8d5b0'),
  C(13,7,'#3b2d2d'),
  // Body top row 8
  C(1,8,'#3b2d2d'), C(2,8,'#f5c99a'), C(3,8,'#f5c99a'), C(4,8,'#f5c99a'),
  C(5,8,'#f5c99a'), C(6,8,'#f5c99a'), C(7,8,'#f5c99a'), C(8,8,'#f5c99a'),
  C(9,8,'#f5c99a'), C(10,8,'#f5c99a'), C(11,8,'#f5c99a'), C(12,8,'#f5c99a'),
  C(13,8,'#f5c99a'), C(14,8,'#3b2d2d'),
  // Body rows 9-11
  C(1,9,'#3b2d2d'), C(2,9,'#e8a87c'), C(3,9,'#f5c99a'), C(4,9,'#f5c99a'),
  C(5,9,'#f5c99a'), C(6,9,'#f5c99a'), C(7,9,'#f5c99a'), C(8,9,'#f5c99a'),
  C(9,9,'#f5c99a'), C(10,9,'#f5c99a'), C(11,9,'#f5c99a'), C(12,9,'#f5c99a'),
  C(13,9,'#e8a87c'), C(14,9,'#3b2d2d'),

  C(1,10,'#3b2d2d'), C(2,10,'#f5c99a'), C(3,10,'#f5c99a'), C(4,10,'#f5c99a'),
  C(5,10,'#e8a87c'), C(6,10,'#f5c99a'), C(7,10,'#f5c99a'), C(8,10,'#f5c99a'),
  C(9,10,'#f5c99a'), C(10,10,'#e8a87c'), C(11,10,'#f5c99a'), C(12,10,'#f5c99a'),
  C(13,10,'#f5c99a'), C(14,10,'#3b2d2d'),

  C(2,11,'#3b2d2d'), C(3,11,'#f5c99a'), C(4,11,'#f5c99a'), C(5,11,'#f5c99a'),
  C(6,11,'#f5c99a'), C(7,11,'#f5c99a'), C(8,11,'#f5c99a'), C(9,11,'#f5c99a'),
  C(10,11,'#f5c99a'), C(11,11,'#f5c99a'), C(12,11,'#f5c99a'), C(13,11,'#3b2d2d'),
  // Paws / bottom row 12
  C(2,12,'#3b2d2d'), C(3,12,'#e8a87c'), C(4,12,'#f5c99a'), C(5,12,'#e8a87c'),
  C(6,12,'#3b2d2d'), C(7,12,'#f5c99a'), C(8,12,'#f5c99a'), C(9,12,'#3b2d2d'),
  C(10,12,'#e8a87c'), C(11,12,'#f5c99a'), C(12,12,'#e8a87c'), C(13,12,'#3b2d2d'),
  // Bottom edge
  C(3,13,'#3b2d2d'), C(4,13,'#3b2d2d'), C(5,13,'#3b2d2d'),
  C(10,13,'#3b2d2d'), C(11,13,'#3b2d2d'), C(12,13,'#3b2d2d'),
  // Tail
  C(14,9,'#3b2d2d'), C(15,10,'#f5c99a'), C(15,11,'#e8a87c'), C(14,12,'#f5c99a'),
  C(14,13,'#3b2d2d'),
];

// Eye variations (Row 5)
const SLEEP_EYES = [
  C(2,5,'#3b2d2d'), C(3,5,'#f5c99a'), C(4,5,'#f5c99a'),
  C(5,5,'#1a1a1a'), C(6,5,'#1a1a1a'), C(7,5,'#1a1a1a'),
  C(8,5,'#f5c99a'),
  C(9,5,'#1a1a1a'), C(10,5,'#1a1a1a'), C(11,5,'#1a1a1a'),
  C(12,5,'#f5c99a'), C(13,5,'#3b2d2d'),
];

const AWAKE_EYES = [
  C(2,5,'#3b2d2d'), C(3,5,'#f5c99a'), C(4,5,'#f5c99a'),
  C(5,5,'#3b2d2d'), C(6,5,'#ffffff'), C(7,5,'#f5c99a'),
  C(8,5,'#f5c99a'),
  C(9,5,'#3b2d2d'), C(10,5,'#ffffff'), C(11,5,'#f5c99a'),
  C(12,5,'#f5c99a'), C(13,5,'#3b2d2d'),
];

const HAPPY_EYES = [
  C(2,5,'#3b2d2d'), C(3,5,'#f5c99a'), C(4,5,'#f5c99a'),
  C(5,5,'#e11d48'), C(6,5,'#e11d48'), C(7,5,'#f5c99a'),
  C(8,5,'#f5c99a'),
  C(9,5,'#e11d48'), C(10,5,'#e11d48'), C(11,5,'#f5c99a'),
  C(12,5,'#f5c99a'), C(13,5,'#3b2d2d'),
];

// Accessories
const HEADPHONES_OVERLAY = [
  C(5,0,'#1e293b'), C(6,0,'#1e293b'), C(7,0,'#1e293b'), C(8,0,'#1e293b'), C(9,0,'#1e293b'), C(10,0,'#1e293b'),
  C(2,4,'#06b6d4'), C(2,5,'#06b6d4'), C(13,4,'#06b6d4'), C(13,5,'#06b6d4'),
  C(3,4,'#0891b2'), C(12,4,'#0891b2'),
];

const T1_HEADBAND_OVERLAY = [
  C(4,3,'#e11d48'), C(5,3,'#e11d48'), C(6,3,'#e11d48'), C(7,3,'#ffffff'),
  C(8,3,'#e11d48'), C(9,3,'#e11d48'), C(10,3,'#e11d48'), C(11,3,'#e11d48'),
];

function buildShadow(pixels) {
  return pixels.join(', ');
}

// Unhinged messages for the click gag
const UNHINGED_MSGS = [
  'ARE YOU TRYING TO 1v9 ME',
  'BRO I WAS SLEEPING',
  'DO I LOOK LIKE A CLICKER GAME',
  'FAKER WOULD NEVER',
  'I WILL INT YOUR LANE',
  'T1 FIGHTING BUT ALSO STOP',
  'THIS IS HARASSMENT',
];

const CLICK_THRESHOLD = 5;
const UNHINGED_COOLDOWN_MS = 6000;
const UNHINGED_SHOW_MS = 3000;

export default function DesktopPet({ 
  lastOpenedWindow, 
  isMusicPlaying = false, 
  isGameActive = false 
}) {
  const [phase, setPhase] = useState('sleep'); // 'sleep' | 'awake' | 'eating' | 'unhinged'
  const [breathe, setBreathe] = useState(false);
  const [earTwitch, setEarTwitch] = useState(false);
  const [speechBubble, setSpeechBubble] = useState(null);
  const [shake, setShake] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Custom user modes
  const [t1Mode, setT1Mode] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [pouncing, setPouncing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const petRef = useRef(null);
  const unhingedCooldownRef = useRef(false);
  const hoverTimerRef = useRef(null);
  const timersRef = useRef([]);

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // ── Breathing bob animation (sleep only) ──────────────────────────────────
  useEffect(() => {
    if (phase !== 'sleep' && !isMusicPlaying) return;
    const interval = isMusicPlaying ? 500 : 1500;
    const iv = setInterval(() => setBreathe(b => !b), interval);
    return () => clearInterval(iv);
  }, [phase, isMusicPlaying]);

  // ── Ear twitch ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'sleep') return;
    const iv = setInterval(() => {
      setEarTwitch(true);
      setTimeout(() => setEarTwitch(false), 300);
    }, 5200);
    return () => clearInterval(iv);
  }, [phase]);

  // ── Wake up briefly on window open ───────────────────────────────────────
  useEffect(() => {
    if (!lastOpenedWindow) return;
    setPhase('awake');
    setSpeechBubble('...zz? 👀');
    addTimer(() => {
      setPhase('sleep');
      setSpeechBubble(null);
    }, 2200);
  }, [lastOpenedWindow]);

  // ── Winamp reactive mode ────────────────────────────────────────────────
  useEffect(() => {
    if (isMusicPlaying) {
      setPhase('awake');
      setSpeechBubble('♪ Vibing to T1 Lo-Fi ♫');
    } else if (phase === 'awake' && !t1Mode && !isGameActive) {
      addTimer(() => {
        setPhase('sleep');
        setSpeechBubble(null);
      }, 1500);
    }
  }, [isMusicPlaying]);

  // ── Gamer mode reaction ─────────────────────────────────────────────────
  useEffect(() => {
    if (isGameActive && phase === 'sleep') {
      setPhase('awake');
      setSpeechBubble('Gamer Mode: ON 🎮');
      addTimer(() => setSpeechBubble(null), 3000);
    }
  }, [isGameActive]);

  // ── Laser Pointer mouse tracking ─────────────────────────────────────────
  useEffect(() => {
    if (!laserActive) return;

    const handleMouseMove = (e) => {
      setLaserPos({ x: e.clientX, y: e.clientY });

      if (petRef.current) {
        const rect = petRef.current.getBoundingClientRect();
        const petCenterX = rect.left + rect.width / 2;
        const petCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - petCenterX, e.clientY - petCenterY);

        if (dist < 90 && !pouncing) {
          setPouncing(true);
          setSpeechBubble('*POUNCE!* 🐾 GOTCHA!');
          setTimeout(() => {
            setPouncing(false);
            setSpeechBubble(null);
          }, 900);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [laserActive, pouncing]);

  // ── Treat / Feed function ────────────────────────────────────────────────
  const handleFeed = (e) => {
    e.stopPropagation();
    setPhase('eating');
    setSpeechBubble('(=^Q^=) *nom nom* 🐟 so tasty!');
    addTimer(() => {
      setSpeechBubble('*purrrr* Tummy full! ❤️');
    }, 2000);
    addTimer(() => {
      setSpeechBubble(null);
      setPhase('sleep');
    }, 4000);
  };

  // ── T1 Toggle ───────────────────────────────────────────────────────────
  const handleToggleT1 = (e) => {
    e.stopPropagation();
    const next = !t1Mode;
    setT1Mode(next);
    if (next) {
      setPhase('awake');
      setSpeechBubble('T1 FIGHTING! 🏆 FAKER G.O.A.T!');
      addTimer(() => setSpeechBubble(null), 3500);
    } else {
      setSpeechBubble('T1 fans rest well 💤');
      addTimer(() => {
        setSpeechBubble(null);
        setPhase('sleep');
      }, 1500);
    }
  };

  // ── Click escalation gag ─────────────────────────────────────────────────
  const handleClick = useCallback((e) => {
    e.stopPropagation();

    // If shift clicked: quick toggle T1
    if (e.shiftKey) {
      handleToggleT1(e);
      return;
    }

    const next = clickCount + 1;
    setClickCount(next);

    if (next >= CLICK_THRESHOLD && !unhingedCooldownRef.current) {
      unhingedCooldownRef.current = true;
      setClickCount(0);
      setPhase('unhinged');
      setShake(true);
      const msg = UNHINGED_MSGS[Math.floor(Math.random() * UNHINGED_MSGS.length)];
      setSpeechBubble(msg);

      addTimer(() => setShake(false), 500);
      addTimer(() => {
        setSpeechBubble(null);
        setPhase('sleep');
      }, UNHINGED_SHOW_MS);
      addTimer(() => { unhingedCooldownRef.current = false; }, UNHINGED_COOLDOWN_MS);
    } else if (next < CLICK_THRESHOLD) {
      setPhase('awake');
      const calms = ['z...z', '(=_=)', 'mrrp?', '...zz', '5 more min'];
      setSpeechBubble(calms[Math.min(next - 1, calms.length - 1)]);
      addTimer(() => {
        if (!isMusicPlaying && !t1Mode) setPhase('sleep');
        setSpeechBubble(null);
      }, 1500);
    }
  }, [clickCount, isMusicPlaying, t1Mode]);

  // ── Hover petting ────────────────────────────────────────────────────────
  const handleMouseEnter = () => {
    if (phase !== 'sleep') return;
    hoverTimerRef.current = setTimeout(() => {
      setSpeechBubble('*purrrrr* ❤️');
    }, 700);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (speechBubble === '*purrrrr* ❤️') {
      setSpeechBubble(null);
    }
  };

  // ── Pixel Art Construction ───────────────────────────────────────────────
  const isAsleep = phase === 'sleep' && !isMusicPlaying && !t1Mode && !isGameActive;
  const isUnhinged = phase === 'unhinged';
  const isHappy = phase === 'eating';

  const eyePixels = isHappy ? HAPPY_EYES : isAsleep ? SLEEP_EYES : AWAKE_EYES;
  let activePixels = [...BASE_BODY_PIXELS, ...eyePixels];

  // Headphone overlay for music or gaming
  if (isMusicPlaying || isGameActive) {
    activePixels = [...activePixels, ...HEADPHONES_OVERLAY];
  }

  // T1 headband overlay
  if (t1Mode) {
    activePixels = [...activePixels, ...T1_HEADBAND_OVERLAY];
  }

  const currentShadow = buildShadow(activePixels);

  // Vertical bob offset
  const bobY = isMusicPlaying
    ? (breathe ? -3 : 0)
    : (isAsleep && breathe ? -1 : 0);

  const canvasW = 16 * PX + PX;
  const canvasH = 14 * PX + PX;

  return (
    <>
      {/* Laser Pointer Red Dot (Desktop overlay) */}
      {laserActive && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75"
          style={{
            left: laserPos.x - 6,
            top: laserPos.y - 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#ff0033',
            boxShadow: '0 0 10px 4px rgba(255, 0, 50, 0.8), 0 0 20px 8px rgba(255, 0, 0, 0.4)',
          }}
        />
      )}

      {/* Draggable Desktop Pet Mascot Container */}
      <motion.div
        ref={petRef}
        drag
        dragMomentum={false}
        dragConstraints={{
          top: 0,
          left: -window.innerWidth + 200,
          right: 50,
          bottom: 20,
        }}
        onDragStart={() => {
          setIsDragging(true);
          setSpeechBubble('wheee! 🐾');
        }}
        onDragEnd={() => {
          setIsDragging(false);
          setSpeechBubble(null);
        }}
        className={`absolute select-none z-30 flex flex-col items-center ${shake ? 'animate-shake' : ''}`}
        style={{
          right: '85px',
          bottom: '46px',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Floating Speech bubble */}
        {speechBubble && (
          <div
            className={`
              absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2
              whitespace-nowrap px-2 py-1 text-[11px] font-mono font-bold
              border-2 border-black bg-white text-black
              shadow-[2px_2px_0_#000] z-40
              ${isUnhinged ? 'text-red-700 text-xs uppercase tracking-wide border-red-700 bg-red-50' : ''}
              ${t1Mode ? 'border-red-600 text-red-950 bg-rose-50' : ''}
            `}
            style={{ imageRendering: 'pixelated' }}
          >
            {speechBubble}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: isUnhinged ? '7px solid #b91c1c' : t1Mode ? '7px solid #e11d48' : '7px solid black',
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0"
              style={{
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: isUnhinged ? '6px solid #fef2f2' : t1Mode ? '6px solid #fff1f2' : '6px solid white',
              }}
            />
          </div>
        )}

        {/* Music Notes Floating Effect */}
        {isMusicPlaying && (
          <div className="absolute -top-6 flex gap-2 text-xs font-bold text-yellow-300 animate-bounce pointer-events-none">
            <span>♪</span>
            <span className="delay-100">♫</span>
          </div>
        )}

        {/* Pixel-art Cat Sprite Canvas */}
        <div
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          title={`Desktop Pet Cat:\n• Drag me anywhere!\n• Hover gently to pet\n• Click to poke (${CLICK_THRESHOLD - clickCount} clicks to anger)\n• Shift-Click for T1 Mode`}
          style={{
            position: 'relative',
            width: `${canvasW}px`,
            height: `${canvasH}px`,
            transform: `translateY(${bobY}px) ${earTwitch ? 'rotate(-2deg)' : ''} ${isUnhinged ? 'scale(1.15)' : ''} ${pouncing ? 'scale(1.25) translateY(-6px)' : ''}`,
            transition: 'transform 0.15s ease',
            imageRendering: 'pixelated',
          }}
        >
          {/* Base Pixel Box-Shadow Sprite */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${PX}px`,
              height: `${PX}px`,
              boxShadow: currentShadow,
              imageRendering: 'pixelated',
            }}
          />

          {/* Sleeping "zzz" particle */}
          {isAsleep && (
            <div
              className="absolute text-[10px] font-bold text-blue-400 animate-pulse pointer-events-none"
              style={{ top: '-8px', right: '-2px', letterSpacing: '-1px' }}
            >
              z
            </div>
          )}
        </div>

        {/* Pet Mini Controls Dock */}
        <div 
          onPointerDown={(e) => e.stopPropagation()} 
          className="mt-1.5 flex items-center gap-1 bg-[#d4d0c8] border border-black p-0.5 shadow-win-out text-[10px] font-mono shrink-0"
        >
          <button
            onClick={handleFeed}
            title="Feed a fish snack"
            className="px-1 py-0.2 bg-win-gray border border-gray-400 shadow-win-out active:shadow-win-in hover:bg-yellow-100 cursor-pointer text-[10px]"
          >
            🐟
          </button>
          <button
            onClick={handleToggleT1}
            title="Toggle T1 Fan Mode"
            className={`px-1 py-0.2 border border-gray-400 shadow-win-out active:shadow-win-in cursor-pointer text-[10px] font-bold ${
              t1Mode ? 'bg-red-600 text-white' : 'bg-win-gray text-red-700 hover:bg-red-50'
            }`}
          >
            🏆T1
          </button>
          <button
            onClick={() => setLaserActive(l => !l)}
            title="Toggle Laser Pointer toy"
            className={`px-1 py-0.2 border border-gray-400 shadow-win-out active:shadow-win-in cursor-pointer text-[10px] ${
              laserActive ? 'bg-red-600 text-white animate-pulse' : 'bg-win-gray hover:bg-red-100'
            }`}
          >
            🔴
          </button>
        </div>
      </motion.div>
    </>
  );
}
