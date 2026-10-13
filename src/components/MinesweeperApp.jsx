import React, { useState, useEffect } from 'react';

const GRID_SIZE = 9;
const MINE_COUNT = 10;

// Number colors classic Windows Minesweeper
const NUMBER_COLORS = [
  '',
  'text-blue-700',   // 1
  'text-green-700',  // 2
  'text-red-600',    // 3
  'text-indigo-900', // 4
  'text-amber-800',  // 5
  'text-teal-700',   // 6
  'text-black',      // 7
  'text-gray-600',   // 8
];

function createBoard() {
  const board = Array.from({ length: GRID_SIZE }, (_, r) =>
    Array.from({ length: GRID_SIZE }, (_, c) => ({
      r,
      c,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );

  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * GRID_SIZE);
    const c = Math.floor(Math.random() * GRID_SIZE);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            if (board[nr][nc].isMine) count++;
          }
        }
      }
      board[r][c].neighborMines = count;
    }
  }

  return board;
}

export default function MinesweeperApp({ lang = 'EN' }) {
  const [board, setBoard] = useState(createBoard);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive && status === 'playing') {
      interval = setInterval(() => {
        setTimer(t => Math.min(999, t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, status]);

  const resetGame = () => {
    setBoard(createBoard());
    setStatus('playing');
    setTimer(0);
    setTimerActive(false);
  };

  const remainingFlags = () => {
    let flags = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isFlagged) flags++;
      });
    });
    return MINE_COUNT - flags;
  };

  const revealCell = (r, c) => {
    if (status !== 'playing') return;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (!timerActive) setTimerActive(true);

    const newBoard = board.map(row => row.map(c => ({ ...c })));

    if (cell.isMine) {
      // Hit a mine -> lost
      newBoard.forEach(row => {
        row.forEach(cl => {
          if (cl.isMine) cl.isRevealed = true;
        });
      });
      newBoard[r][c].hit = true;
      setBoard(newBoard);
      setStatus('lost');
      return;
    }

    // Flood fill reveal
    const queue = [[r, c]];
    newBoard[r][c].isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift();
      const currCell = newBoard[currR][currC];

      if (currCell.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
              const neighbor = newBoard[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    // Check win condition (all non-mine tiles revealed)
    let nonMineUnrevealed = 0;
    newBoard.forEach(row => {
      row.forEach(cl => {
        if (!cl.isMine && !cl.isRevealed) nonMineUnrevealed++;
      });
    });

    if (nonMineUnrevealed === 0) {
      // Auto-flag all mines
      newBoard.forEach(row => {
        row.forEach(cl => {
          if (cl.isMine) cl.isFlagged = true;
        });
      });
      setStatus('won');
    }

    setBoard(newBoard);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (status !== 'playing') return;
    if (board[r][c].isRevealed) return;

    if (!timerActive) setTimerActive(true);

    setBoard(prev =>
      prev.map(row =>
        row.map(cell => {
          if (cell.r === r && cell.c === c) {
            return { ...cell, isFlagged: !cell.isFlagged };
          }
          return cell;
        })
      )
    );
  };

  // Face icon
  const faceEmoji = status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂';

  return (
    <div className="flex flex-col items-center select-none p-1 bg-win-gray text-black font-mono">
      {/* Project Disclaimer Banner */}
      <div className="w-full text-xs bg-yellow-100 border border-yellow-500 p-1 mb-2 text-center text-gray-800">
        {lang === 'EN'
          ? '💡 Portfolio Project: Built with AI-assisted coding to demonstrate rapid retro game development.'
          : '💡 Dự án Portfolio: Được tạo bằng AI-assisted coding nhằm minh họa quy trình làm game retro.'}
      </div>

      {/* Main Minesweeper Frame */}
      <div className="border-4 border-white shadow-win-out p-2 bg-win-gray flex flex-col items-center">
        {/* Header Bar: Score, Face, Timer */}
        <div className="w-full flex justify-between items-center mb-2 p-1.5 border-2 border-gray-600 shadow-win-in bg-[#c0c0c0]">
          {/* Mine count LED display */}
          <div className="bg-black text-red-600 font-bold px-1.5 py-0.5 text-lg tracking-widest border border-gray-700 shadow-win-in min-w-[45px] text-center">
            {String(Math.max(-99, Math.min(999, remainingFlags()))).padStart(3, '0')}
          </div>

          {/* Reset smiley face */}
          <button
            onClick={resetGame}
            className="w-8 h-8 text-xl flex items-center justify-center bg-win-gray border-2 shadow-win-out active:shadow-win-in cursor-pointer"
            title={lang === 'EN' ? 'New Game' : 'Chơi lại'}
          >
            {faceEmoji}
          </button>

          {/* Timer display */}
          <div className="bg-black text-red-600 font-bold px-1.5 py-0.5 text-lg tracking-widest border border-gray-700 shadow-win-in min-w-[45px] text-center">
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* 9x9 Grid */}
        <div className="border-2 border-gray-600 shadow-win-in bg-gray-400 p-[2px] grid grid-cols-9 gap-[1px]">
          {board.map((row, r) =>
            row.map((cell, c) => {
              if (!cell.isRevealed) {
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => revealCell(r, c)}
                    onContextMenu={e => toggleFlag(e, r, c)}
                    className="w-6 h-6 sm:w-7 sm:h-7 bg-win-gray border-2 shadow-win-out active:shadow-win-in flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    {cell.isFlagged ? '🚩' : ''}
                  </button>
                );
              }

              // Revealed cell
              const isHitMine = cell.hit;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-6 h-6 sm:w-7 sm:h-7 border border-gray-400 flex items-center justify-center font-bold text-sm ${
                    isHitMine ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                >
                  {cell.isMine ? (
                    '💣'
                  ) : cell.neighborMines > 0 ? (
                    <span className={NUMBER_COLORS[cell.neighborMines]}>
                      {cell.neighborMines}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Status text */}
        <div className="mt-2 text-center text-xs font-bold">
          {status === 'won' && (
            <span className="text-green-700">
              {lang === 'EN' ? '🎉 YOU WIN! GREAT JOB!' : '🎉 BẠN ĐÃ THẮNG! XUẤT SẮC!'}
            </span>
          )}
          {status === 'lost' && (
            <span className="text-red-700">
              {lang === 'EN' ? '💥 GAME OVER! CLICK FACE TO RETRY.' : '💥 THUA RỒI! BẤM MẶT CƯỜI ĐỂ THỬ LẠI.'}
            </span>
          )}
          {status === 'playing' && (
            <span className="text-gray-600">
              {lang === 'EN'
                ? 'Left-click: Reveal | Right-click: Flag'
                : 'Chuột trái: Mở ô | Chuột phải: Cắm cờ'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
