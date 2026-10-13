import React, { useState } from 'react';

const DELETED_FILES = [
  {
    id: 'group_project',
    name: 'Failed_Group_Project.docx',
    icon: '📄',
    size: '1.4 MB',
    deletedDate: '10/04/2026 02:14 AM',
    joke: {
      en: 'Status: Permanently deleted. Some wounds don\'t heal, they just get archived.',
      vi: 'Trạng thái: Đã xóa vĩnh viễn. Có những vết thương lòng không bao giờ lành, chúng chỉ được lưu trữ vào thùng rác.',
    },
    meta: {
      en: 'Original path: C:\\Users\\Ngan\\Documents\\Group_Work_FINAL_v3_really_final.docx',
      vi: 'Đường dẫn gốc: C:\\Users\\Ngan\\Documents\\Bai_Tap_Nhom_FINAL_v3_ban_chot_that_su.docx',
    },
  },
  {
    id: 'switch_majors',
    name: 'Should_I_Switch_Majors.txt',
    icon: '📝',
    size: '42 KB',
    deletedDate: '09/15/2026 03:30 AM',
    joke: {
      en: 'Reviewed at 2am, every semester, never resolved. Sent to Recycle Bin for my own sanity.',
      vi: 'Được mở ra xem xét lại vào lúc 2 giờ sáng mỗi kỳ thi, chưa bao giờ giải quyết xong. Tống vào Thùng Rác để bảo vệ sự tỉnh táo của bản thân.',
    },
    meta: {
      en: 'Original path: C:\\Users\\Ngan\\Late_Night_Thoughts\\quarter_life_crisis.txt',
      vi: 'Đường dẫn gốc: C:\\Users\\Ngan\\Suy_Nghi_Dem_Khuya\\khung_hoang_tuoi_doi_muoi.txt',
    },
  },
  {
    id: 't1_game',
    name: 'Why_Did_I_Stay_Up_For_That_T1_Game.txt',
    icon: '🏆',
    size: '128 KB',
    deletedDate: '10/01/2026 04:45 AM',
    joke: {
      en: 'Worth it. No regrets. Would do it again tomorrow even with an 8am economics lecture.',
      vi: 'Đáng từng giây. Không hối hận. Kể cả ngày mai có tiết Kinh tế lúc 8h sáng thì vẫn sẽ thức xem tiếp.',
    },
    meta: {
      en: 'Original path: C:\\Users\\Ngan\\Esports\\Worlds_VOD_Heart_Attacks.txt',
      vi: 'Đường dẫn gốc: C:\\Users\\Ngan\\Esports\\Nhung_Tran_Dau_Dau_Tim_Cua_T1.txt',
    },
  },
  {
    id: 'untouched_excel',
    name: 'Macroeconomics_Final_Notes_REAL.xlsx',
    icon: '📊',
    size: '3.8 MB',
    deletedDate: '06/20/2026 11:59 PM',
    joke: {
      en: 'Spent 4 hours formatting color-coded formulas and 12 minutes actually studying.',
      vi: 'Dành 4 tiếng đồng hồ để phối màu và căn lề bảng tính cho đẹp như tác phẩm nghệ thuật, nhưng chỉ học bài đúng 12 phút.',
    },
    meta: {
      en: 'Original path: C:\\Users\\Ngan\\FTU\\K63_Kinh_Te_Quoc_Te\\Notes_That_Look_Pretty.xlsx',
      vi: 'Đường dẫn gốc: C:\\Users\\Ngan\\FTU\\K63_Kinh_Te_Quoc_Te\\Vo_Ghi_Dep_Nhung_Chua_Hoc.xlsx',
    },
  },
  {
    id: 'healthy_sleep',
    name: 'Healthy_Sleep_Schedule_2026.cal',
    icon: '⏰',
    size: '1 KB',
    deletedDate: '01/02/2026 01:00 AM',
    joke: {
      en: 'Corrupted on day 2. Replaced by a delicate balance of iced coffee, LoL queue timers, and raw willpower.',
      vi: 'File bị lỗi ngay từ ngày thứ 2 trong năm. Được thay thế bằng sự cân bằng mong manh giữa cà phê sữa đá, hàng chờ trận LMHT và ý chí sinh tồn.',
    },
    meta: {
      en: 'Original path: C:\\Users\\Ngan\\New_Year_Resolutions\\abandoned_promises.cal',
      vi: 'Đường dẫn gốc: C:\\Users\\Ngan\\Muc_Tieu_Nam_Moi\\loi_hua_gio_bay.cal',
    },
  },
];

export default function RecycleBinApp({ lang = 'EN' }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleOpenPreview = (file) => {
    setSelectedFile(file.id);
    setPreviewFile(file);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-win-gray text-black font-mono select-none">
      {/* Explorer Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-0.5 border-b border-gray-400 text-xs bg-win-gray">
        <span className="hover:bg-win-blue hover:text-white px-1 cursor-default">File</span>
        <span className="hover:bg-win-blue hover:text-white px-1 cursor-default">Edit</span>
        <span className="hover:bg-win-blue hover:text-white px-1 cursor-default">View</span>
        <span className="hover:bg-win-blue hover:text-white px-1 cursor-default">Help</span>
      </div>

      {/* Explorer Address Bar */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-400 bg-win-gray text-xs">
        <span className="text-gray-600 font-bold">Address:</span>
        <div className="flex-1 bg-white px-2 py-0.5 border border-gray-500 shadow-win-in flex items-center gap-1 truncate text-xs">
          <span>🗑️</span>
          <span>C:\Recycle Bin\</span>
        </div>
      </div>

      {/* File List Grid & View Pane */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden m-1 border-2 border-gray-600 shadow-win-in bg-white">
        {/* Left: Files Table */}
        <div className="flex-1 overflow-auto p-2">
          <div className="text-[11px] text-gray-500 mb-2 border-b border-gray-200 pb-1">
            {lang === 'EN' ? 'Double-click or click a file to inspect deleted contents:' : 'Bấm vào một tệp để xem nội dung đã xóa:'}
          </div>
          
          <div className="space-y-1">
            {DELETED_FILES.map((file) => {
              const isSelected = selectedFile === file.id;
              return (
                <div
                  key={file.id}
                  onClick={() => handleOpenPreview(file)}
                  className={`flex items-center justify-between px-2 py-1.5 cursor-pointer text-xs border ${
                    isSelected
                      ? 'bg-win-blue text-white border-blue-900 outline-1 outline-dotted outline-yellow-300'
                      : 'hover:bg-gray-100 border-transparent text-black'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{file.icon}</span>
                    <span className="font-bold truncate">{file.name}</span>
                  </div>
                  <div className={`text-[10px] whitespace-nowrap ml-2 ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                    {file.size}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right / Bottom: File Content Preview Dialog */}
        {previewFile && (
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-300 bg-[#f8f8f8] p-2.5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xl">{previewFile.icon}</span>
                  <span className="font-bold text-xs truncate">{previewFile.name}</span>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="text-xs px-1.5 py-0.2 bg-win-gray border shadow-win-out active:shadow-win-in cursor-pointer font-bold"
                  title="Close Preview"
                >
                  ✕
                </button>
              </div>

              {/* Meta details */}
              <div className="text-[10px] text-gray-500 mb-2 space-y-0.5">
                <div>Deleted: {previewFile.deletedDate}</div>
                <div className="truncate" title={lang === 'EN' ? previewFile.meta.en : previewFile.meta.vi}>
                  {lang === 'EN' ? previewFile.meta.en : previewFile.meta.vi}
                </div>
              </div>

              {/* Joke content */}
              <div className="bg-white p-2 border border-gray-400 shadow-win-in text-xs leading-relaxed text-gray-900">
                <p className="font-semibold italic">
                  "{lang === 'EN' ? previewFile.joke.en : previewFile.joke.vi}"
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-1.5 pt-2 border-t border-gray-300">
              <button
                onClick={() => alert(lang === 'EN' ? 'Error 404: Emotion cannot be restored.' : 'Lỗi 404: Cảm xúc này không thể khôi phục.')}
                className="px-2 py-0.5 bg-win-gray border shadow-win-out active:shadow-win-in text-xs cursor-pointer font-bold"
              >
                {lang === 'EN' ? 'Restore' : 'Khôi phục'}
              </button>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-2 py-0.5 bg-win-gray border shadow-win-out active:shadow-win-in text-xs cursor-pointer"
              >
                {lang === 'EN' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-0.5 border-t border-gray-400 bg-win-gray text-[11px] flex justify-between text-gray-700">
        <span>{DELETED_FILES.length} object(s) in Recycle Bin</span>
        <span>Disk Space Saved: 5.3 MB</span>
      </div>
    </div>
  );
}
