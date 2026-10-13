import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Pixel-art sleepy cat drawn with CSS box-shadows on a 1px base div ──────
// Grid is 16×16 @ 3px each. Colors:
//   #f5c99a  = fur (main)
//   #e8a87c  = fur shadow / inner ear
//   #3b2d2d  = dark outline / pupils
//   #1a1a1a  = eye closed line
//   #ffffff  = eye highlight / whisker
//   #f7b8b8  = nose / ear inner pink
//   #a0c4ff  = closed-eye highlight shine (tiny glint)
// Each entry: [col, row] in 0-based grid coords mapped to colour.
// We render these as a single div's box-shadow mosaic.

const PX = 3; // pixel size in real px

// Draw helpers
const C = (col, row, color) => `${col * PX}px ${row * PX}px 0 ${color}`;

// Cat pixel art – 16×16
// Row by row description comments omitted for brevity; just the data.
const SLEEPING_PIXELS = [
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
  // Face row 5 – closed eyes (sleeping ~~ lines)
  C(2,5,'#3b2d2d'), C(3,5,'#f5c99a'), C(4,5,'#f5c99a'),
  C(5,5,'#1a1a1a'), C(6,5,'#1a1a1a'), C(7,5,'#1a1a1a'), // left eye closed
  C(8,5,'#f5c99a'),
  C(9,5,'#1a1a1a'), C(10,5,'#1a1a1a'), C(11,5,'#1a1a1a'), // right eye closed
  C(12,5,'#f5c99a'), C(13,5,'#3b2d2d'),
  // Face row 6 – cheeks + nose
  C(2,6,'#3b2d2d'), C(3,6,'#f5c99a'), C(4,6,'#f5c99a'), C(5,6,'#f5c99a'),
  C(6,6,'#f5c99a'), C(7,6,'#f5c99a'), C(8,6,'#f7b8b8'), // nose
  C(9,6,'#f5c99a'), C(10,6,'#f5c99a'), C(11,6,'#f5c99a'),
  C(12,6,'#f5c99a'), C(13,6,'#3b2d2d'),
  // Mouth / whisker row 7
  C(2,7,'#3b2d2d'), C(3,7,'#f5c99a'),
  C(4,7,'#e8d5b0'), // whisker hint left
  C(5,7,'#f5c99a'), C(6,7,'#f5c99a'), C(7,7,'#f5c99a'), C(8,7,'#f5c99a'),
  C(9,7,'#f5c99a'), C(10,7,'#f5c99a'), C(11,7,'#f5c99a'),
  C(12,7,'#e8d5b0'), // whisker hint right
  C(13,7,'#3b2d2d'),
  // Body top row 8
  C(1,8,'#3b2d2d'), C(2,8,'#f5c99a'), C(3,8,'#f5c99a'), C(4,8,'#f5c99a'),
  C(5,8,'#f5c99a'), C(6,8,'#f5c99a'), C(7,8,'#f5c99a'), C(8,8,'#f5c99a'),
  C(9,8,'#f5c99a'), C(10,8,'#f5c99a'), C(11,8,'#f5c99a'), C(12,8,'#f5c99a'),
  C(13,8,'#f5c99a'), C(14,8,'#3b2d2d'),
  // Body rows 9-11 (rounded blob body)
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

// Awake version: eyes open (dots)
const AWAKE_OVERRIDE_ROWS = [
  C(5,5,'#3b2d2d'), C(6,5,'#ffffff'), // left eye open
  C(9,5,'#3b2d2d'), C(10,5,'#ffffff'), // right eye open
  C(7,5,'#f5c99a'), C(8,5,'#f5c99a'), // clear the middle
  C(11,5,'#f5c99a'), C(4,5,'#f5c99a'), // clear sides
];

function buildShadow(pixels) {
  return pixels.join(', ');
}

const SLEEPING_SHADOW = buildShadow(SLEEPING_PIXELS);
const AWAKE_PIXELS = [...SLEEPING_PIXELS.filter(p => {
  // remove rows 5 eye pixels (we'll override them)
  const eyeRowPixels = [
    C(5,5,'#1a1a1a'), C(6,5,'#1a1a1a'), C(7,5,'#1a1a1a'),
    C(9,5,'#1a1a1a'), C(10,5,'#1a1a1a'), C(11,5,'#1a1a1a'),
  ];
  return !eyeRowPixels.includes(p);
}), ...AWAKE_OVERRIDE_ROWS];
const AWAKE_SHADOW = buildShadow(AWAKE_PIXELS);

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

const CLICK_THRESHOLD = 5; // trigger after 5 clicks
const UNHINGED_COOLDOWN_MS = 6000;
const UNHINGED_SHOW_MS = 3000;

export default function DesktopPet({ lastOpenedWindow }) {
  const [phase, setPhase] = useState('sleep'); // 'sleep' | 'awake' | 'unhinged'
  const [breathe, setBreathe] = useState(false); // gentle breathing bob (alternates)
  const [earTwitch, setEarTwitch] = useState(false);
  const [speechBubble, setSpeechBubble] = useState(null);
  const [shake, setShake] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const unhingedCooldownRef = useRef(false);
  const hoverTimerRef = useRef(null);
  const timersRef = useRef([]);

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  // Cleanup all pending timers on unmount
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // ── Breathing bob animation (every 1.5s, only while sleeping) ──────────────
  useEffect(() => {
    if (phase !== 'sleep') return;
    const iv = setInterval(() => setBreathe(b => !b), 1500);
    return () => clearInterval(iv);
  }, [phase]);

  // ── Ear twitch (random-ish every 5s while sleeping) ──────────────────────
  useEffect(() => {
    if (phase !== 'sleep') return;
    const iv = setInterval(() => {
      setEarTwitch(true);
      setTimeout(() => setEarTwitch(false), 300);
    }, 5200);
    return () => clearInterval(iv);
  }, [phase]);

  // ── Wake up briefly when a window opens ──────────────────────────────────
  useEffect(() => {
    if (!lastOpenedWindow) return;
    setPhase('awake');
    setSpeechBubble('...zz? 👀');
    addTimer(() => {
      setPhase('sleep');
      setSpeechBubble(null);
    }, 2200);
  }, [lastOpenedWindow]);

  // ── Click escalation gag ─────────────────────────────────────────────────
  const handleClick = useCallback((e) => {
    e.stopPropagation();

    const next = clickCount + 1;
    setClickCount(next);

    if (next >= CLICK_THRESHOLD && !unhingedCooldownRef.current) {
      // ── Trigger unhinged reaction ──
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
      // ── Mild reaction (blink / stretch) ──
      setPhase('awake');
      const calms = ['z...z', '(=_=)', 'mrrp?', '...zz', '5 more min'];
      setSpeechBubble(calms[Math.min(next - 1, calms.length - 1)]);
      addTimer(() => {
        setPhase('sleep');
        setSpeechBubble(null);
      }, 1500);
    }
  }, [clickCount]);

  // ── Hover petting (gentle purring) ──────────────────────────────────────
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

  // ── Derived visuals ──────────────────────────────────────────────────────
  const isAsleep = phase === 'sleep';
  const isUnhinged = phase === 'unhinged';
  const shadow = isAsleep ? SLEEPING_SHADOW : AWAKE_SHADOW;

  // Vertical offset for breathing bob (only while asleep)
  const bobY = isAsleep && breathe ? -1 : 0;

  // Canvas size: 16 cols × 14 rows × PX px, plus 1px to avoid cutoff
  const canvasW = 16 * PX + PX;
  const canvasH = 14 * PX + PX;

  return (
    <div
      className={`absolute select-none z-30 ${shake ? 'animate-shake' : ''}`}
      style={{
        // Position: bottom-right, above taskbar, won't overlap left-side icons
        right: '90px',
        bottom: '48px',
      }}
    >
      {/* Speech bubble */}
      {speechBubble && (
        <div
          className={`
            absolute bottom-full mb-1 left-1/2 -translate-x-1/2
            whitespace-nowrap px-2 py-1 text-[11px] font-mono font-bold
            border-2 border-black bg-white text-black
            shadow-[2px_2px_0_#000]
            ${isUnhinged ? 'text-red-700 text-xs uppercase tracking-wide border-red-700 bg-red-50' : ''}
          `}
          style={{
            // Comic-book tail triangle pointing down toward cat
            imageRendering: 'pixelated',
          }}
        >
          {speechBubble}
          {/* Triangle tail */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: isUnhinged ? '7px solid #b91c1c' : '7px solid black',
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0"
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: isUnhinged ? '6px solid #fef2f2' : '6px solid white',
            }}
          />
        </div>
      )}

      {/* Pixel-art cat sprite via box-shadow mosaic */}
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={`Sleepy Cat: Hover to pet, click to poke! (${CLICK_THRESHOLD - clickCount} clicks to anger)`}
        className="cursor-pointer"
        style={{
          position: 'relative',
          width: `${canvasW}px`,
          height: `${canvasH}px`,
          transform: `translateY(${bobY}px) ${earTwitch ? 'rotate(-1deg)' : ''} ${isUnhinged ? 'scale(1.1)' : ''}`,
          transition: 'transform 0.3s ease',
          imageRendering: 'pixelated',
        }}
      >
        {/* The actual pixel mosaic — 1×1 div that casts all pixel shadows */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${PX}px`,
            height: `${PX}px`,
            boxShadow: shadow,
            imageRendering: 'pixelated',
          }}
        />

        {/* "Zzz" sleep particles (only while sleeping) */}
        {isAsleep && (
          <div
            className="absolute text-[10px] font-bold text-blue-400 animate-pulse"
            style={{ top: '-6px', right: '0px', letterSpacing: '-1px' }}
          >
            z
          </div>
        )}
      </div>
    </div>
  );
}
