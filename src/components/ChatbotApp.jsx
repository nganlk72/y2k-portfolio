import React, { useState } from 'react';

// Scripted keyword response table directly from prompt
const SCRIPTED_RESPONSES = [
  {
    triggers: ['who are you', 'about you', 'ai la ban', 'gioi thieu'],
    response: {
      en: 'Officially an Economics major. Unofficially, a very organized gremlin who games too much. Pick your fighter.',
      vi: 'Chính thức: Sinh viên Kinh tế Quốc tế. Không chính thức: Một sinh viên ngăn nắp thích cày game thâu đêm. Bạn chọn phiên bản nào?',
    },
  },
  {
    triggers: ['study', 'major', 'hoc', 'nganh'],
    response: {
      en: 'International Business and Economics at FTU. I chose it at 18 because \'prosperous career\' sounded convincing. Jury\'s still out.',
      vi: 'Kinh tế Quốc tế tại Đại học Ngoại thương (FTU). Mình chọn ngành này lúc 18 tuổi vì nghe chữ \'sự nghiệp xán lạn\' rất thuyết phục. Kết quả ra sao thì hồi sau sẽ rõ.',
    },
  },
  {
    triggers: ['skills', 'what can you do', 'ky nang', 'lam duoc gi'],
    response: {
      en: 'Python, decent data handling, and an unreasonable talent for making a spreadsheet look like art. Also: formatting documents into submission.',
      vi: 'Python, xử lý dữ liệu cơ bản, và khả năng biến trang tính Excel thành một tác phẩm nghệ thuật. Kèm theo kỹ năng căn chỉnh văn bản răm rắp.',
    },
  },
  {
    triggers: ['game', 'play', 'choi game'],
    response: {
      en: 'League, TFT, some FPS on the side. Don\'t ask about my rank, I will deflect.',
      vi: 'Liên Minh Huyền Thoại, ĐTCL, thi thoảng bắn súng FPS. Đừng hỏi mức rank hiện tại nhé, mình sẽ lảng tránh câu trả lời ngay đấy.',
    },
  },
  {
    triggers: ['t1', 'esports', 'faker'],
    response: {
      en: 'Excuse me? T1 die-hard since middle school. This is not a debate, this is a personality trait.',
      vi: 'Xin lỗi nhé? Fan cứng T1 từ thời cấp 2 đấy. Đây không phải chủ đề để tranh luận, đây là một phần tính cách rồi.',
    },
  },
  {
    triggers: ['single', 'dating', 'nguoi yeu', 'hen ho'],
    response: {
      en: 'I came here to show you my resume, not my situationship history. Next question.',
      vi: 'Mình tạo trang web này để khoe CV chứ không phải để kể lịch sử mập mờ tình cảm. Xin mời câu hỏi tiếp theo.',
    },
  },
  {
    triggers: ['why should i hire you', 'tai sao nen tuyen'],
    response: {
      en: 'Because I alphabetize my downloads folder for fun. If that doesn\'t scream \'reliable,\' I don\'t know what does.',
      vi: 'Bởi vì mình sắp xếp thư mục Downloads theo thứ tự bảng chữ cái để giải trí. Nếu điều đó không chứng minh sự đáng tin cậy thì mình chịu luôn đấy.',
    },
  },
  {
    triggers: ['contact', 'hire', 'reach', 'lien he', 'tuyen dung'],
    response: {
      en: 'There\'s a Messenger window on the desktop for a reason — use it, I actually read those.',
      vi: 'Có cửa sổ Messenger/Contact ngay trên desktop đấy — gửi tin nhắn qua đó đi, mình thật sự đọc từng email đấy.',
    },
  },
];

const DEFAULT_NO_MATCH = {
  en: 'I don\'t have a scripted answer for that one — try the Messenger window, the real me reads those.',
  vi: 'Mình chưa có câu trả lời mẫu cho câu này đâu — hãy nhắn qua cửa sổ Contact/Messenger nhé, chính chủ đọc thật đấy!',
};

export function getScriptedBotResponse(message, lang = 'EN') {
  const normalized = message.toLowerCase().trim();

  for (const entry of SCRIPTED_RESPONSES) {
    const matched = entry.triggers.some((trigger) => normalized.includes(trigger.toLowerCase()));
    if (matched) {
      return lang === 'EN' ? entry.response.en : entry.response.vi;
    }
  }

  return lang === 'EN' ? DEFAULT_NO_MATCH.en : DEFAULT_NO_MATCH.vi;
}

export default function ChatbotApp({ lang = 'EN', onOpenContact }) {
  const [messages, setMessages] = useState([
    {
      sender: 'Bot',
      text:
        lang === 'EN'
          ? 'Hi! I\'m Ngan\'s Virtual Assistant (Bot.exe). Ask me about her studies, skills, games, T1, or hiring!'
          : 'Xin chào! Mình là Trợ lý ảo của Ngân (Bot.exe). Hãy hỏi mình về học vấn, kỹ năng, game, T1 hoặc tuyển dụng nhé!',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    // Add user message immediately
    setMessages((prev) => [...prev, { sender: 'You', text: userText }]);

    // Match scripted canned response
    setTimeout(() => {
      const reply = getScriptedBotResponse(userText, lang);
      setMessages((prev) => [...prev, { sender: 'Bot', text: reply }]);
    }, 400);
  };

  const samplePrompts = [
    lang === 'EN' ? 'Who are you?' : 'Bạn là ai?',
    lang === 'EN' ? 'What skills do you have?' : 'Kỹ năng của bạn?',
    lang === 'EN' ? 'Are you a T1 fan?' : 'Fan T1 phải không?',
    lang === 'EN' ? 'Why should I hire you?' : 'Tại sao nên tuyển bạn?',
  ];

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#f0f0f0] text-black font-mono select-none">
      {/* Bot Header Profile */}
      <div className="p-2 border-b border-gray-400 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-purple-200 border border-purple-800 rounded-full flex items-center justify-center text-lg shadow-sm">
            🤖
          </div>
          <div>
            <div className="font-bold text-sm">Bot.exe (Scripted AI)</div>
            <div className="text-[11px] text-green-700 font-semibold">● Offline keyword engine ready</div>
          </div>
        </div>

        <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-400 px-1.5 py-0.5 rounded">
          v1.0
        </span>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-1.5 bg-[#e4e4e4] border-b border-gray-300 flex flex-wrap gap-1 text-[11px] shrink-0">
        <span className="text-gray-500 self-center text-[10px] mr-1">
          {lang === 'EN' ? 'Try:' : 'Gợi ý:'}
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(p);
            }}
            className="px-2 py-0.5 bg-white border border-gray-400 shadow-win-out active:shadow-win-in text-[10px] cursor-pointer hover:bg-yellow-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 min-h-[80px] p-2 bg-white overflow-y-auto space-y-2 border-b border-gray-300 text-xs select-text">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-2 rounded border leading-relaxed shadow-sm ${
                m.sender === 'You'
                  ? 'bg-blue-100 border-blue-400 text-blue-950'
                  : 'bg-purple-50 border-purple-300 text-purple-950'
              }`}
            >
              <div className="font-bold text-[10px] mb-0.5 opacity-70">
                {m.sender === 'You' ? 'Visitor' : 'Bot.exe'}
              </div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-1.5 bg-[#f0f0f0] flex flex-col gap-1 shrink-0">
        <div className="flex gap-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === 'EN'
                ? 'Ask about T1, skills, major, gaming, hiring...'
                : 'Hỏi về T1, kỹ năng, ngành học, game, tuyển dụng...'
            }
            className="flex-1 bg-white border border-gray-400 p-1.5 text-xs focus:outline-none focus:border-purple-600 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1 bg-win-gray border-2 shadow-win-out active:shadow-win-in font-bold text-xs cursor-pointer hover:bg-gray-200"
          >
            {lang === 'EN' ? 'Ask' : 'Gửi'}
          </button>
        </div>
      </form>
    </div>
  );
}
