import React, { useState, useEffect, useCallback, useRef } from 'react';

// 1: Wall, 0: Pellet, 2: Empty space
const MAZE_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 2, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const ROWS = MAZE_MAP.length;
const COLS = MAZE_MAP[0].length;

function getInitialPellets() {
  const pellets = new Set();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MAZE_MAP[r][c] === 0) {
        pellets.add(`${r},${c}`);
      }
    }
  }
  return pellets;
}

export default function PacmanApp({ lang = 'EN' }) {
  const [pacman, setPacman] = useState({ r: 9, c: 7, dir: 'LEFT' });
  const [ghosts, setGhosts] = useState([
    { r: 5, c: 6, color: '#ff0000', name: 'Blinky' },
    { r: 7, c: 6, color: '#00ffff', name: 'Inky' },
  ]);
  const [pellets, setPellets] = useState(getInitialPellets);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [totalPellets] = useState(() => getInitialPellets().size);

  const pacmanRef = useRef(pacman);
  pacmanRef.current = pacman;
  const ghostsRef = useRef(ghosts);
  ghostsRef.current = ghosts;
  const statusRef = useRef(status);
  statusRef.current = status;
  const pelletsRef = useRef(pellets);
  pelletsRef.current = pellets;

  const restartGame = () => {
    const initPellets = getInitialPellets();
    setPacman({ r: 9, c: 7, dir: 'LEFT' });
    setGhosts([
      { r: 5, c: 6, color: '#ff0000', name: 'Blinky' },
      { r: 7, c: 6, color: '#00ffff', name: 'Inky' },
    ]);
    setPellets(initPellets);
    setScore(0);
    setStatus('playing');
  };

  const movePacman = useCallback((dr, dc, dir) => {
    if (statusRef.current !== 'playing') return;

    setPacman(prev => {
      const nr = prev.r + dr;
      const nc = prev.c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev;
      if (MAZE_MAP[nr][nc] === 1) return prev; // hit wall

      // Check pellet eat
      const key = `${nr},${nc}`;
      if (pelletsRef.current.has(key)) {
        setPellets(p => {
          const next = new Set(p);
          next.delete(key);
          if (next.size === 0) {
            setStatus('won');
          }
          return next;
        });
        setScore(s => s + 10);
      }

      // Check collision with ghosts
      for (const g of ghostsRef.current) {
        if (g.r === nr && g.c === nc) {
          setStatus('lost');
        }
      }

      return { r: nr, c: nc, dir };
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = e => {
      if (statusRef.current !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePacman(-1, 0, 'UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePacman(1, 0, 'DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePacman(0, -1, 'LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePacman(0, 1, 'RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePacman]);

  // Ghosts movement loop (chase pacman simply)
  useEffect(() => {
    const interval = setInterval(() => {
      if (statusRef.current !== 'playing') return;

      const pPos = pacmanRef.current;

      setGhosts(prevGhosts =>
        prevGhosts.map(g => {
          // Available directions
          const candidateMoves = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 },
          ].filter(m => {
            const nr = g.r + m.dr;
            const nc = g.c + m.dc;
            return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && MAZE_MAP[nr][nc] !== 1;
          });

          if (candidateMoves.length === 0) return g;

          // Simple chase: pick move that minimizes Manhattan distance to pacman
          let bestMove = candidateMoves[0];
          let bestDist = Infinity;

          // Introduce 25% randomness so ghosts don't perfectly stack or get stuck
          if (Math.random() < 0.25) {
            bestMove = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
          } else {
            for (const m of candidateMoves) {
              const nr = g.r + m.dr;
              const nc = g.c + m.dc;
              const dist = Math.abs(nr - pPos.r) + Math.abs(nc - pPos.c);
              if (dist < bestDist) {
                bestDist = dist;
                bestMove = m;
              }
            }
          }

          const newR = g.r + bestMove.dr;
          const newC = g.c + bestMove.dc;

          // Check if caught pacman
          if (newR === pPos.r && newC === pPos.c) {
            setStatus('lost');
          }

          return { ...g, r: newR, c: newC };
        })
      );
    }, 450); // Ghost tick speed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center select-none p-1 bg-black text-white font-mono">
      {/* Portfolio Disclaimer Banner */}
      <div className="w-full text-xs bg-yellow-100 border border-yellow-500 p-1 mb-2 text-center text-gray-800">
        {lang === 'EN'
          ? '💡 Portfolio Project: Built with AI-assisted coding to demonstrate interactive retro arcade logic.'
          : '💡 Dự án Portfolio: Được tạo bằng AI-assisted coding nhằm minh họa logic game arcade cổ điển.'}
      </div>

      {/* Retro Arcade Header */}
      <div className="w-full flex justify-between items-center px-4 py-1.5 mb-1 bg-zinc-900 border-2 border-zinc-700 text-xs font-bold">
        <div className="text-yellow-400">
          {lang === 'EN' ? 'SCORE: ' : 'ĐIỂM: '}
          <span className="text-white text-sm">{score}</span>
        </div>
        <div className="text-cyan-400">
          {lang === 'EN' ? 'PELLETS: ' : 'MỒI: '}
          <span className="text-white text-sm">
            {totalPellets - pellets.size} / {totalPellets}
          </span>
        </div>
        <button
          onClick={restartGame}
          className="px-2 py-0.5 bg-win-gray text-black border shadow-win-out active:shadow-win-in text-xs font-bold cursor-pointer"
        >
          {lang === 'EN' ? 'RESTART' : 'CHƠI LẠI'}
        </button>
      </div>

      {/* Pac-Man Board */}
      <div
        className="relative bg-black border-4 border-blue-900 p-1 rounded-sm shadow-lg grid"
        style={{
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          width: '320px',
          height: '280px',
        }}
      >
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const isWall = MAZE_MAP[r][c] === 1;
            const hasPellet = pellets.has(`${r},${c}`);
            const isPacman = pacman.r === r && pacman.c === c;
            const ghost = ghosts.find(g => g.r === r && g.c === c);

            return (
              <div
                key={`${r}-${c}`}
                className={`relative flex items-center justify-center ${
                  isWall ? 'bg-blue-800 border-[1px] border-blue-950 rounded-[2px]' : 'bg-black'
                }`}
              >
                {/* Pellet */}
                {!isWall && hasPellet && !isPacman && !ghost && (
                  <div className="w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_4px_#ffeb3b]" />
                )}

                {/* Pacman */}
                {isPacman && (
                  <div
                    className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-black text-black shadow-[0_0_6px_#ffeb3b]"
                    title="Pacman"
                  >
                    😮
                  </div>
                )}

                {/* Ghost */}
                {ghost && !isPacman && (
                  <div
                    className="w-4 h-4 rounded-t-full flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: ghost.color }}
                    title={ghost.name}
                  >
                    👻
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Win / Lose Overlays */}
        {status !== 'playing' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 p-2 text-center">
            {status === 'won' ? (
              <>
                <div className="text-green-400 text-lg font-bold">
                  {lang === 'EN' ? '🌟 YOU WIN! ALL PELLETS EATEN!' : '🌟 BẠN THẮNG! ĐÃ ĂN HẾT MỒI!'}
                </div>
                <div className="text-xs text-yellow-300">
                  {lang === 'EN' ? `Final Score: ${score}` : `Tổng điểm: ${score}`}
                </div>
              </>
            ) : (
              <>
                <div className="text-red-500 text-lg font-bold">
                  {lang === 'EN' ? '💀 CAUGHT BY GHOST!' : '💀 ĐÃ BỊ MA BẮT!'}
                </div>
                <div className="text-xs text-gray-300">
                  {lang === 'EN' ? 'Better luck next time!' : 'Thử lại lần sau nhé!'}
                </div>
              </>
            )}

            <button
              onClick={restartGame}
              className="mt-2 px-3 py-1 bg-yellow-400 text-black font-bold text-xs border-2 border-white shadow-win-out active:shadow-win-in cursor-pointer hover:bg-yellow-300"
            >
              {lang === 'EN' ? 'PLAY AGAIN' : 'CHƠI LẠI'}
            </button>
          </div>
        )}
      </div>

      {/* Controls guide & Mobile Direction Buttons */}
      <div className="mt-2 text-center text-xs text-gray-400 flex flex-col items-center gap-1.5">
        <div>{lang === 'EN' ? 'Controls: Arrow Keys or W A S D' : 'Điều khiển: Phím mũi tên hoặc W A S D'}</div>

        {/* On-screen Direction Pad (great for mobile/touch or quick testing) */}
        <div className="grid grid-cols-3 gap-1 w-24">
          <div />
          <button
            onClick={() => movePacman(-1, 0, 'UP')}
            className="p-1 bg-zinc-800 border border-zinc-600 active:bg-zinc-700 text-xs text-white cursor-pointer"
          >
            ▲
          </button>
          <div />
          <button
            onClick={() => movePacman(0, -1, 'LEFT')}
            className="p-1 bg-zinc-800 border border-zinc-600 active:bg-zinc-700 text-xs text-white cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => movePacman(1, 0, 'DOWN')}
            className="p-1 bg-zinc-800 border border-zinc-600 active:bg-zinc-700 text-xs text-white cursor-pointer"
          >
            ▼
          </button>
          <button
            onClick={() => movePacman(0, 1, 'RIGHT')}
            className="p-1 bg-zinc-800 border border-zinc-600 active:bg-zinc-700 text-xs text-white cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
