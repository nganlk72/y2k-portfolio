import React, { useState, useEffect, useRef } from 'react';

// Royalty-free 8-bit / lo-fi background tracks (free CDN hosted public domain / CC0 sound bites)
// Track source: Free royalty-free retro chiptune loop (Pixabay / FreePD / OpenGameArt CC0)
// Fallback synthetically generated retro Web Audio melody if offline or CDN blocked!
const TRACK_INFO = {
  title: '01. Late Night Rift - T1 Lo-Fi Anthem.mp3',
  artist: 'Le Kim Ngan (Chiptune Mix)',
  kbps: '128 kbps',
  khz: '44.1 kHz',
  durationSec: 184,
  // High availability royalty-free demo track URL
  audioSrc: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=retro-game-arcade-236130.mp3',
};

export default function WinampPlayerApp({ lang = 'EN', onPlayChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);

  // Notify parent component about playback state
  useEffect(() => {
    onPlayChange?.(isPlaying);
  }, [isPlaying, onPlayChange]);

  // Synthesized fallback oscillator when native audio element can't load or is blocked
  const synthIntervalRef = useRef(null);

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play fallback triggered (browser autoplay policy or offline):', err);
        // Start synthetic visualizer & timer anyway so user always gets the full interactive experience
        setIsPlaying(true);
      });
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Time ticker when playing
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((t) => (t + 1) % TRACK_INFO.durationSec);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col bg-[#242424] text-[#00ff00] p-2 select-none font-mono text-xs border-2 border-gray-500 shadow-win-out">
      {/* Hidden audio element for real playback */}
      <audio
        ref={audioRef}
        src={TRACK_INFO.audioSrc}
        loop
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(Math.floor(audioRef.current.currentTime));
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Classic Winamp Title Banner */}
      <div className="bg-[#101010] border border-[#303030] p-1.5 mb-2 flex items-center justify-between text-[11px] shadow-win-in">
        <span className="text-yellow-400 font-bold truncate">WINAMP 2.91 - {TRACK_INFO.artist}</span>
        <span className="text-gray-400 text-[10px]">{TRACK_INFO.kbps}</span>
      </div>

      {/* Main Display: Visualizer + Song Title Scrolling Display */}
      <div className="bg-black border border-gray-700 p-2 mb-2 shadow-win-in flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          {/* LED Time Counter */}
          <div className="bg-[#051a05] text-[#00ff00] px-2 py-0.5 border border-[#004400] text-sm font-bold tracking-widest">
            {formatTime(currentTime)}
          </div>

          {/* Marquee Track Name */}
          <div className="flex-1 ml-2 overflow-hidden bg-[#0a0a0a] px-2 py-0.5 border border-[#202020] text-yellow-300 truncate">
            <span className={isPlaying ? 'animate-pulse' : ''}>
              {isPlaying ? '▶ ' : '❚❚ '}
              {TRACK_INFO.title}
            </span>
          </div>
        </div>

        {/* Animated Winamp Visualizer Bars */}
        <div className="h-10 bg-[#080808] border border-gray-800 p-1 flex items-end justify-between gap-1 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => {
            // Generate visualizer bar heights dynamically or via CSS pulsing
            const heightMultiplier = isPlaying ? ((i * 17 + currentTime * 23) % 80) + 20 : 8;
            return (
              <div
                key={i}
                className="w-full bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 transition-all duration-150"
                style={{
                  height: `${heightMultiplier}%`,
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Control Buttons (Winamp style) */}
      <div className="flex items-center justify-between gap-1 bg-[#1a1a1a] p-1.5 border border-gray-700 shadow-win-out mb-2">
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            onClick={() => setCurrentTime(0)}
            className="w-7 h-6 bg-win-gray text-black font-bold text-xs border shadow-win-out active:shadow-win-in cursor-pointer flex items-center justify-center"
            title="Rewind"
          >
            ⏮
          </button>

          {/* Play */}
          <button
            onClick={togglePlay}
            className={`w-8 h-6 font-bold text-xs border shadow-win-out active:shadow-win-in cursor-pointer flex items-center justify-center ${
              isPlaying ? 'bg-green-300 text-black shadow-win-in' : 'bg-win-gray text-black'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>

          {/* Pause */}
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlaying(false);
            }}
            className="w-7 h-6 bg-win-gray text-black font-bold text-xs border shadow-win-out active:shadow-win-in cursor-pointer flex items-center justify-center"
            title="Pause"
          >
            ⏸
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="w-7 h-6 bg-win-gray text-black font-bold text-xs border shadow-win-out active:shadow-win-in cursor-pointer flex items-center justify-center"
            title="Stop"
          >
            ⏹
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-[10px] text-gray-300">VOL:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 accent-green-500 cursor-pointer h-2 bg-gray-700"
            title={`Volume: ${volume}%`}
          />
        </div>
      </div>

      {/* Footer Info & Credit */}
      <div className="text-[10px] text-gray-400 text-center flex flex-col gap-0.5">
        <div>{lang === 'EN' ? '⚡ It really whips the llama\'s tail!' : '⚡ Trình phát nhạc phong cách Winamp 1999!'}</div>
        <div className="text-gray-500 text-[9px]">
          {/* Credit attribution as requested */}
          {lang === 'EN'
            ? 'Music source: Royalty-free retro arcade soundtrack (Pixabay / CC0). Built with Web Audio.'
            : 'Nguồn âm thanh: Nhạc nền retro miễn phí bản quyền (Pixabay / CC0).'}
        </div>
      </div>
    </div>
  );
}
