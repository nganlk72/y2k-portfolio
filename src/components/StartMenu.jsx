import React, { useState } from 'react';

export default function StartMenu({ 
  lang = 'EN',
  onOpenWindow, 
  onToggleLang,
  onShutDown, 
  onClose 
}) {
  const [showPrograms, setShowPrograms] = useState(false);

  const handleItemClick = (action) => {
    onClose();
    action();
  };

  return (
    <div 
      className="absolute bottom-10 left-0 w-64 bg-win-gray border-2 border-white shadow-win-out text-black z-50 flex select-none font-mono text-xs"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Windows 98 Vertical Gradient Banner */}
      <div 
        className="w-8 flex items-end justify-center py-3 shrink-0"
        style={{
          background: 'linear-gradient(to top, #000080 0%, #1084d0 100%)',
        }}
      >
        <span 
          className="text-white font-bold tracking-widest text-sm whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Ngan <span className="font-light text-cyan-200">98</span>
        </span>
      </div>

      {/* Main Menu List */}
      <div className="flex-1 py-1 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Programs item with flyout on hover */}
          <div 
            className="relative"
            onMouseEnter={() => setShowPrograms(true)}
            onMouseLeave={() => setShowPrograms(false)}
          >
            <div 
              className={`px-3 py-2 flex items-center justify-between cursor-pointer ${
                showPrograms ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📁</span>
                <span className="font-bold">{lang === 'EN' ? 'Programs' : 'Chương trình'}</span>
              </div>
              <span className="text-[10px]">▶</span>
            </div>

            {/* Programs Submenu */}
            {showPrograms && (
              <div 
                className="absolute left-full bottom-0 w-52 bg-win-gray border-2 border-white shadow-win-out text-black flex flex-col py-1 z-50 text-xs"
              >
                <button
                  onClick={() => handleItemClick(() => onOpenWindow('minesweeper'))}
                  className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
                >
                  <span className="text-sm">💣</span>
                  <span>Minesweeper.exe</span>
                </button>
                <button
                  onClick={() => handleItemClick(() => onOpenWindow('pacman'))}
                  className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
                >
                  <span className="text-sm">🍒</span>
                  <span>PacMan.exe</span>
                </button>
                <button
                  onClick={() => handleItemClick(() => onOpenWindow('winamp'))}
                  className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
                >
                  <span className="text-sm">⚡</span>
                  <span>WinAmp Player</span>
                </button>
                <button
                  onClick={() => handleItemClick(() => onOpenWindow('bot'))}
                  className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
                >
                  <span className="text-sm">🤖</span>
                  <span>Bot.exe (Assistant)</span>
                </button>
              </div>
            )}
          </div>

          {/* About Me */}
          <button
            onClick={() => handleItemClick(() => onOpenWindow('about'))}
            className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
          >
            <span className="text-base">📝</span>
            <span>About_Me.txt</span>
          </button>

          {/* Resume */}
          <button
            onClick={() => handleItemClick(() => onOpenWindow('resume'))}
            className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
          >
            <span className="text-base">📄</span>
            <span>Resume.exe</span>
          </button>

          {/* Contact / Messenger */}
          <button
            onClick={() => handleItemClick(() => onOpenWindow('contact'))}
            className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
          >
            <span className="text-base">💬</span>
            <span>Contact Messenger</span>
          </button>

          {/* Recycle Bin */}
          <button
            onClick={() => handleItemClick(() => onOpenWindow('recycleBin'))}
            className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
          >
            <span className="text-base">🗑️</span>
            <span>Recycle Bin</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => handleItemClick(onToggleLang)}
            className="px-3 py-2 flex items-center justify-between hover:bg-[#000080] hover:text-white text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🌐</span>
              <span>{lang === 'EN' ? 'Language: English' : 'Ngôn ngữ: Tiếng Việt'}</span>
            </div>
            <span className="text-[10px] font-bold px-1 bg-yellow-200 text-black border border-black">
              {lang}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400 border-b border-b-white my-1" />

        {/* Shut Down */}
        <button
          onClick={() => handleItemClick(onShutDown)}
          className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#000080] hover:text-white text-left cursor-pointer"
        >
          <span className="text-base">🔌</span>
          <span className="font-bold">{lang === 'EN' ? 'Shut Down...' : 'Tắt máy...'}</span>
        </button>
      </div>
    </div>
  );
}
