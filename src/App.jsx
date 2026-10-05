import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Window from './components/Window';

function App() {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [windows, setWindows] = useState({
    about: true,
    skills: false,
    messenger: false,
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (win) => {
    setWindows(prev => ({ ...prev, [win]: !prev[win] }));
  };

  if (!started) {
    return (
      <div className="w-screen h-screen crt bg-black text-white">
        <StartScreen onStart={() => setStarted(true)} />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen crt bg-[#008080] overflow-hidden relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
      {/* Desktop Icons */}
      <div className="p-4 flex flex-col gap-6 absolute top-0 left-0">
        <DesktopIcon name="My Computer" icon="💻" onClick={() => toggleWindow('about')} />
        <DesktopIcon name="Skills.exe" icon="⚔️" onClick={() => toggleWindow('skills')} />
        <DesktopIcon name="Yahoo! Messenger" icon="💬" onClick={() => toggleWindow('messenger')} />
      </div>

      {/* Windows */}
      {windows.about && (
        <Window title="About_Me.txt - Notepad" defaultPosition={{ x: 200, y: 50 }} onClose={() => toggleWindow('about')}>
          <div className="p-2 font-mono text-lg text-black">
            <h2 className="font-bold text-xl mb-2 text-y2k-pink">{"<Player 1>"}</h2>
            <p>Class: Web Developer</p>
            <p>Level: 99</p>
            <p>HP: 100/100</p>
            <p>MP: 50/100 (Cần nạp thêm cà phê)</p>
            <br />
            <p>Xin chào! Tôi là một nhà phát triển web với niềm đam mê tạo ra các trải nghiệm kỹ thuật số độc đáo. Tôi thích phong cách retro, Y2K và nghệ thuật pixel.</p>
          </div>
        </Window>
      )}

      {windows.skills && (
        <Window title="Skill_Tree.exe" defaultPosition={{ x: 250, y: 150 }} onClose={() => toggleWindow('skills')} width="w-[300px]">
          <div className="p-2 text-black">
            <h3 className="font-bold border-b-2 border-black mb-2 pb-1">Inventory</h3>
            <ul className="space-y-2">
              <SkillItem name="React.js" level="Lv.50" icon="⚛️" />
              <SkillItem name="JavaScript" level="Lv.60" icon="🟨" />
              <SkillItem name="Tailwind CSS" level="Lv.45" icon="🌊" />
              <SkillItem name="Nostalgia" level="MAX" icon="💾" />
            </ul>
          </div>
        </Window>
      )}

      {windows.messenger && (
        <Window title="Yahoo! Messenger" defaultPosition={{ x: 600, y: 100 }} onClose={() => toggleWindow('messenger')} width="w-[350px]">
          <div className="flex flex-col h-[400px] text-black">
            <div className="bg-[#f0f0f0] p-2 border-b border-gray-400 flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-300 rounded-full border border-black flex items-center justify-center text-xl">😎</div>
              <div>
                <div className="font-bold text-sm">Guest_123</div>
                <div className="text-xs text-gray-600">Đang rảnh...</div>
              </div>
            </div>
            <div className="flex-1 bg-white p-2 overflow-y-auto font-sans text-sm border-b border-gray-300">
              <div className="mb-2"><span className="text-blue-600 font-bold">You:</span> Buzz!!!</div>
              <div className="mb-2"><span className="text-red-600 font-bold">Admin:</span> Chào bạn, liên hệ với tôi qua email nhé!</div>
            </div>
            <div className="p-2 bg-[#f0f0f0] h-24">
              <textarea className="w-full h-full border border-gray-400 p-1 resize-none font-sans text-sm focus:outline-none focus:border-blue-500" placeholder="Type a message..."></textarea>
            </div>
            <div className="bg-[#f0f0f0] p-1 flex justify-end">
              <button className="px-4 py-1 bg-win-gray border-2 shadow-win-out active:shadow-win-in text-sm font-bold">Send</button>
            </div>
          </div>
        </Window>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-win-gray border-t-2 border-white shadow-win-out flex items-center px-1 z-50">
        <button className="h-8 px-2 flex items-center gap-2 bg-win-gray border-2 shadow-win-out active:shadow-win-in font-bold mr-2 text-black">
          <span className="text-blue-800 text-xl font-serif italic">W</span> Start
        </button>
        <div className="flex-1 flex gap-1 h-full py-1">
          {windows.about && <TaskbarBtn title="About_Me.txt" />}
          {windows.skills && <TaskbarBtn title="Skill_Tree.exe" />}
          {windows.messenger && <TaskbarBtn title="Yahoo! Messenger" />}
        </div>
        <div className="h-8 px-2 border-2 shadow-win-in flex items-center text-sm font-sans text-black">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({ name, icon, onClick }) {
  return (
    <div className="flex flex-col items-center w-20 cursor-pointer group" onClick={onClick} onDoubleClick={onClick}>
      <div className="text-4xl mb-1 drop-shadow-md group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-center text-sm bg-black/50 text-white px-1 leading-tight">{name}</div>
    </div>
  );
}

function SkillItem({ name, level, icon }) {
  return (
    <li className="flex items-center gap-2 text-sm text-black">
      <span className="text-lg">{icon}</span>
      <span className="flex-1 font-bold">{name}</span>
      <span className="text-blue-700 font-bold">{level}</span>
    </li>
  );
}

function TaskbarBtn({ title }) {
  return (
    <button className="h-full px-2 min-w-[100px] text-left bg-win-gray border-2 shadow-win-out active:shadow-win-in flex items-center text-sm truncate font-sans font-bold text-gray-800">
      {title}
    </button>
  );
}

export default App;
