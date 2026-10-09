import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Window from './components/Window';

function App() {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [lang, setLang] = useState('EN'); // 'EN' or 'VI'
  const [windows, setWindows] = useState({
    about: true,
    resume: false,
    contact: false,
  });

  // Resume Sections State
  const [resumeExpanded, setResumeExpanded] = useState({
    edu: true,
    exp: false,
    skills: false
  });

  // Contact Form State
  const [contactChat, setContactChat] = useState([
    { sender: 'Admin', text: lang === 'EN' ? 'Hello! How can I help you?' : 'Chào bạn! Mình có thể giúp gì cho bạn?' }
  ]);
  const [contactMsg, setContactMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (win) => {
    setWindows(prev => ({ ...prev, [win]: !prev[win] }));
  };

  const toggleResumeSection = (section) => {
    setResumeExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleLang = () => {
    setLang(prev => prev === 'EN' ? 'VI' : 'EN');
  };

  const handleSendContact = async (e) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;

    const userMsg = contactMsg;
    setContactChat(prev => [...prev, { sender: 'You', text: userMsg }]);
    setContactMsg('');
    setIsSending(true);

    try {
      const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mock_endpoint';
      
      if (endpoint.includes('mock_endpoint')) {
        console.warn('VITE_FORMSPREE_ENDPOINT is not set in .env. Using mock submission.');
      } else {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMsg, _replyto: 'visitor@portfolio.com' })
        });
      }

      setTimeout(() => {
        setContactChat(prev => [...prev, { 
          sender: 'Admin', 
          text: lang === 'EN' ? "Thanks for reaching out! I'll get back to you soon." : "Cảm ơn bạn đã liên hệ! Mình sẽ phản hồi sớm." 
        }]);
        setIsSending(false);
      }, 1000);

    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setContactChat(prev => [...prev, { 
          sender: 'System', 
          text: 'Error sending message. Please try again later.' 
        }]);
        setIsSending(false);
      }, 1000);
    }
  };

  if (!started) {
    return (
      <div className="w-screen h-screen crt bg-black text-white">
        <StartScreen onStart={() => setStarted(true)} />
      </div>
    );
  }

  // Define fonts
  const contentFont = lang === 'VI' ? { fontFamily: "'Be Vietnam Pro', sans-serif" } : {};

  return (
    <div className="w-screen h-screen crt bg-[#008080] overflow-hidden relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
      {/* Desktop Icons */}
      <div className="p-4 flex flex-col gap-6 absolute top-0 left-0">
        <DesktopIcon name="My Computer" icon="💻" onClick={() => toggleWindow('about')} />
        <DesktopIcon name="Resume.exe" icon="📁" onClick={() => toggleWindow('resume')} />
        <DesktopIcon name="Contact.exe" icon="💬" onClick={() => toggleWindow('contact')} />
      </div>

      {/* Windows */}
      {windows.about && (
        <Window title="About_Me.txt - Notepad" defaultPosition={{ x: 100, y: 50 }} width="w-[450px]" onClose={() => toggleWindow('about')}>
          <div className="p-2 text-black" style={contentFont}>
            <h2 className="font-bold text-xl mb-2 text-y2k-pink font-pixel">Le Kim Ngan</h2>
            <p className="italic font-bold mb-4">
              {lang === 'EN' 
                ? `"Looks like the 'perfect student'. Plays like a menace on the Rift."`
                : `"Trông có vẻ giống 'học sinh gương mẫu'. Chơi game trên Rift thì như một mối đe dọa."`}
            </p>
            <p className="mb-2">
              {lang === 'EN'
                ? `Officially an International Economics major, mostly because 'prosperous career' sounded convincing at 18. Unofficially: the person who keeps every file on their computer meticulously in place, still rewatches childhood HBO marathons, and has been a T1 die-hard since middle school.`
                : `Chính thức là sinh viên chuyên ngành Kinh tế Quốc tế, phần lớn vì cụm từ 'sự nghiệp xán lạn' nghe khá thuyết phục ở tuổi 18. Không chính thức: là người giữ mọi tệp trên máy tính ngăn nắp tỉ mỉ, vẫn xem lại các phim dài tập thời thơ ấu trên HBO và là fan cứng của T1 từ hồi cấp 2.`}
            </p>
            <p>
              {lang === 'EN'
                ? `I bring a clean, structured approach to chaotic ideas because someone has to make sure the math and the mood both check out.`
                : `Mình mang đến cách tiếp cận gọn gàng, có cấu trúc cho những ý tưởng hỗn loạn vì phải có ai đó đảm bảo cả tính toán và cảm xúc đều hợp lý.`}
            </p>
          </div>
        </Window>
      )}

      {windows.resume && (
        <Window title="Resume.exe" defaultPosition={{ x: 200, y: 150 }} width="w-[500px]" onClose={() => toggleWindow('resume')}>
          <div className="p-2 text-black" style={contentFont}>
            {/* Education Section */}
            <div className="mb-2 border border-gray-400 p-1 bg-[#f0f0f0]">
              <div 
                className="font-bold flex items-center cursor-pointer select-none font-pixel text-sm py-1"
                onClick={() => toggleResumeSection('edu')}
              >
                <span className="mr-2 w-4 inline-block text-center">{resumeExpanded.edu ? '-' : '+'}</span>
                📁 {lang === 'EN' ? 'Education' : 'Học vấn'}
              </div>
              {resumeExpanded.edu && (
                <div className="pl-6 pr-2 py-2 bg-white border-t border-gray-400 text-sm mt-1">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>
                      <strong>{lang === 'EN' ? 'Foreign Trade University (FTU)' : 'Đại học Ngoại thương (FTU)'}</strong><br/>
                      {lang === 'EN' 
                        ? 'High-Quality Program, International Economics (K63), 2024-2027. Core coursework in economics and programming — algorithmic thinking and Python-based data processing.' 
                        : 'Chương trình Chất lượng cao, Kinh tế Quốc tế (K63), 2024-2027. Các môn học cốt lõi về kinh tế và lập trình — tư duy thuật toán và xử lý dữ liệu với Python.'}
                    </li>
                    <li>
                      <strong>{lang === 'EN' ? 'Ha Tinh High School for the Gifted' : 'Trường THPT Chuyên Hà Tĩnh'}</strong><br/>
                      {lang === 'EN' 
                        ? 'Specialized English Class 1 (K27), 2021-2024. 1st Prize Provincial English Olympiad (2022-23 & 2023-24), 2nd Prize (2021-22). IELTS 8.0 (Reading 8.5, Listening 9.0, Speaking 7.5, Writing 6.5).' 
                        : 'Chuyên Anh 1 (K27), 2021-2024. Giải Nhất HSG Tỉnh môn Tiếng Anh (2022-23 & 2023-24), Giải Nhì (2021-22). IELTS 8.0 (Reading 8.5, Listening 9.0, Speaking 7.5, Writing 6.5).'}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="mb-2 border border-gray-400 p-1 bg-[#f0f0f0]">
              <div 
                className="font-bold flex items-center cursor-pointer select-none font-pixel text-sm py-1"
                onClick={() => toggleResumeSection('exp')}
              >
                <span className="mr-2 w-4 inline-block text-center">{resumeExpanded.exp ? '-' : '+'}</span>
                📁 {lang === 'EN' ? 'Experience/Activities' : 'Kinh nghiệm/Hoạt động'}
              </div>
              {resumeExpanded.exp && (
                <div className="pl-6 pr-2 py-2 bg-white border-t border-gray-400 text-sm mt-1">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>
                      <strong>FBLC (FTU book-lovers club)</strong><br/>
                      {lang === 'EN' 
                        ? 'Head of Specialized Committee, Gen 4. Organized reading-culture events, built content, developed team operating procedures.' 
                        : 'Trưởng ban Chuyên môn, Gen 4. Tổ chức các sự kiện văn hóa đọc, xây dựng nội dung, phát triển quy trình vận hành đội nhóm.'}
                    </li>
                    <li>
                      <strong>CEPM (School of Economics & Public Management)</strong><br/>
                      {lang === 'EN' 
                        ? 'Training Dept. Collaborator. Data processing and academic document/records management.' 
                        : 'Cộng tác viên Ban Đào tạo. Xử lý dữ liệu và quản lý hồ sơ/tài liệu học thuật.'}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="mb-2 border border-gray-400 p-1 bg-[#f0f0f0]">
              <div 
                className="font-bold flex items-center cursor-pointer select-none font-pixel text-sm py-1"
                onClick={() => toggleResumeSection('skills')}
              >
                <span className="mr-2 w-4 inline-block text-center">{resumeExpanded.skills ? '-' : '+'}</span>
                📁 {lang === 'EN' ? 'Skills' : 'Kỹ năng'}
              </div>
              {resumeExpanded.skills && (
                <div className="pl-6 pr-2 py-2 bg-white border-t border-gray-400 text-sm mt-1">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>
                      <strong>{lang === 'EN' ? 'Technical:' : 'Kỹ thuật:'}</strong> {lang === 'EN' ? 'Python (basic data handling, logic problem-solving), AI tools (ChatGPT, Claude, Gemini, Gemini Notebook), Canva' : 'Python (xử lý dữ liệu cơ bản, giải quyết vấn đề logic), Công cụ AI (ChatGPT, Claude, Gemini, Gemini Notebook), Canva'}
                    </li>
                    <li>
                      <strong>{lang === 'EN' ? 'Languages:' : 'Ngôn ngữ:'}</strong> {lang === 'EN' ? 'English (fluent, IELTS 8.0), Chinese (basic)' : 'Tiếng Anh (lưu loát, IELTS 8.0), Tiếng Trung (cơ bản)'}
                    </li>
                    <li>
                      <strong>{lang === 'EN' ? 'Soft skills:' : 'Kỹ năng mềm:'}</strong> {lang === 'EN' ? 'problem-solving & critical thinking, organization & project management, teamwork, bilingual EN-VN translation/communication' : 'giải quyết vấn đề & tư duy phản biện, tổ chức & quản lý dự án, làm việc nhóm, biên phiên dịch/giao tiếp song ngữ Anh-Việt'}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Window>
      )}

      {windows.contact && (
        <Window title="Contact - Messenger" defaultPosition={{ x: 600, y: 100 }} width="w-[350px]" onClose={() => toggleWindow('contact')}>
          <div className="flex flex-col h-[400px] text-black">
            <div className="bg-[#f0f0f0] p-2 border-b border-gray-400 flex flex-col gap-1 text-sm font-sans">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-yellow-300 rounded-full border border-black flex items-center justify-center text-xl">😎</div>
                <div>
                  <div className="font-bold text-sm">Le Kim Ngan</div>
                  <div className="text-xs text-gray-600">Online</div>
                </div>
              </div>
              <div className="text-xs border-t border-gray-300 pt-1 mt-1">
                <div>📧 ngan.lekim726@gmail.com</div>
                <div>📱 0911579388</div>
                <div>🌐 <a href="https://github.com/nganlk72" target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">github.com/nganlk72</a></div>
              </div>
            </div>
            
            <div className="flex-1 bg-white p-2 overflow-y-auto font-sans text-sm border-b border-gray-300" style={contentFont}>
              {contactChat.map((msg, i) => (
                <div key={i} className="mb-2">
                  <span className={`font-bold ${msg.sender === 'You' ? 'text-blue-600' : msg.sender === 'Admin' ? 'text-red-600' : 'text-gray-500'}`}>
                    {msg.sender}:
                  </span> {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendContact} className="flex flex-col">
              <div className="p-2 bg-[#f0f0f0] h-20">
                <textarea 
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full h-full border border-gray-400 p-1 resize-none font-sans text-sm focus:outline-none focus:border-blue-500" 
                  placeholder={lang === 'EN' ? "Type a message..." : "Nhập tin nhắn..."}
                  style={contentFont}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendContact(e);
                    }
                  }}
                />
              </div>
              <div className="bg-[#f0f0f0] p-1 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-1 bg-win-gray border-2 shadow-win-out active:shadow-win-in text-sm font-bold disabled:opacity-50"
                >
                  {isSending ? (lang === 'EN' ? 'Sending...' : 'Đang gửi...') : (lang === 'EN' ? 'Send' : 'Gửi')}
                </button>
              </div>
            </form>
          </div>
        </Window>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-win-gray border-t-2 border-white shadow-win-out flex items-center px-1 z-50">
        <button className="h-8 px-2 flex items-center gap-2 bg-win-gray border-2 shadow-win-out active:shadow-win-in font-bold mr-2 text-black">
          <span className="text-blue-800 text-xl font-serif italic">W</span> Start
        </button>
        <div className="flex-1 flex gap-1 h-full py-1 overflow-x-auto">
          {windows.about && <TaskbarBtn title="About_Me.txt" />}
          {windows.resume && <TaskbarBtn title="Resume.exe" />}
          {windows.contact && <TaskbarBtn title="Contact.exe" />}
        </div>
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button 
            onClick={toggleLang}
            className="h-8 px-2 border-2 shadow-win-out active:shadow-win-in flex items-center text-sm font-sans font-bold text-black bg-win-gray"
            title="Toggle Language"
          >
            {lang}
          </button>
          <div className="h-8 px-2 border-2 shadow-win-in flex items-center text-sm font-sans text-black whitespace-nowrap">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({ name, icon, onClick }) {
  return (
    <div className="flex flex-col items-center w-20 cursor-pointer group" onClick={onClick} onDoubleClick={onClick}>
      <div className="text-4xl mb-1 drop-shadow-md group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-center text-sm bg-black/50 text-white px-1 leading-tight font-pixel">{name}</div>
    </div>
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
