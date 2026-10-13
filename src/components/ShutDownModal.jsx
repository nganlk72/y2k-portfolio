import React, { useState } from 'react';

export default function ShutDownModal({ 
  lang = 'EN', 
  onConfirmShutDown, 
  onRestart, 
  onCancel 
}) {
  const [selectedOption, setSelectedOption] = useState('shutdown');

  const handleOk = () => {
    if (selectedOption === 'shutdown') {
      onConfirmShutDown();
    } else {
      onRestart();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center select-none font-mono"
      onClick={onCancel}
    >
      <div 
        className="w-[360px] bg-win-gray border-2 border-white shadow-win-out text-black p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white flex justify-between items-center px-1 py-0.5 text-xs font-bold mb-3">
          <span>{lang === 'EN' ? 'Shut Down Windows' : 'Tắt máy tính Windows'}</span>
          <button 
            onClick={onCancel}
            className="w-4 h-4 bg-win-gray text-black shadow-win-out active:shadow-win-in flex items-center justify-center font-mono text-[10px] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-3 pb-3 flex gap-3 text-xs">
          <div className="text-3xl shrink-0 pt-1">💻</div>
          <div className="flex-1 flex flex-col gap-2">
            <p className="font-bold">
              {lang === 'EN' 
                ? 'What would you like the computer to do?' 
                : 'Bạn muốn máy tính làm gì?'}
            </p>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="shutdown-option" 
                  checked={selectedOption === 'shutdown'} 
                  onChange={() => setSelectedOption('shutdown')} 
                  className="accent-[#000080]"
                />
                <span>{lang === 'EN' ? 'Shut down' : 'Tắt nguồn (Shut down)'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="shutdown-option" 
                  checked={selectedOption === 'restart'} 
                  onChange={() => setSelectedOption('restart')} 
                  className="accent-[#000080]"
                />
                <span>{lang === 'EN' ? 'Restart' : 'Khởi động lại (Restart)'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                <input 
                  type="radio" 
                  name="shutdown-option" 
                  disabled 
                  className="accent-[#000080]"
                />
                <span>{lang === 'EN' ? 'Restart in MS-DOS mode' : 'Khởi động lại ở chế độ MS-DOS'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 px-3 pb-2 pt-1 border-t border-gray-400">
          <button 
            onClick={handleOk}
            className="px-4 py-1 bg-win-gray border-2 shadow-win-out active:shadow-win-in text-xs font-bold cursor-pointer hover:bg-gray-200"
          >
            OK
          </button>
          <button 
            onClick={onCancel}
            className="px-3 py-1 bg-win-gray border-2 shadow-win-out active:shadow-win-in text-xs cursor-pointer hover:bg-gray-200"
          >
            {lang === 'EN' ? 'Cancel' : 'Hủy'}
          </button>
          <button 
            onClick={() => alert(lang === 'EN' ? 'No help is available for shutting down. You are doing great!' : 'Không có trợ giúp cho việc tắt máy. Bạn làm rất tốt rồi!')}
            className="px-3 py-1 bg-win-gray border-2 shadow-win-out active:shadow-win-in text-xs cursor-pointer hover:bg-gray-200"
          >
            {lang === 'EN' ? 'Help' : 'Trợ giúp'}
          </button>
        </div>
      </div>
    </div>
  );
}
