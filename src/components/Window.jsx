import React, { useState } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';

export default function Window({ title, children, onClose, onMinimize, isMinimized, defaultPosition = { x: 0, y: 0 }, width = "w-[400px]" }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [pos, setPos] = useState(defaultPosition);
  const dragControls = useDragControls();

  return (
    <div style={{ display: isMinimized ? 'none' : 'block' }}>
      <motion.div 
        drag={!isMaximized}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        animate={isMaximized ? { x: 0, y: 0, width: '100vw', height: 'calc(100vh - 40px)' } : { x: pos.x, y: pos.y, width: undefined, height: undefined }}
        onDragEnd={(e, info) => {
          setPos({ x: pos.x + info.offset.x, y: pos.y + info.offset.y });
        }}
        className={`absolute bg-win-gray border-2 border-white shadow-win-out text-black flex flex-col z-10 ${isMaximized ? '' : width}`}
        style={isMaximized ? { top: 0, left: 0 } : { outline: '1px solid black', resize: 'both', overflow: 'hidden', minWidth: '250px', minHeight: '150px' }}
      >
        {/* Title Bar */}
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="bg-win-blue text-white flex justify-between items-center px-1 py-1 cursor-move select-none shrink-0"
        >
          <span className="font-bold text-sm ml-1 tracking-wider">{title}</span>
          <div className="flex gap-1">
            <button onClick={onMinimize} className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in cursor-pointer">
              <Minus size={12} />
            </button>
            <button onClick={() => setIsMaximized(!isMaximized)} className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in cursor-pointer">
              <Square size={10} />
            </button>
            <button onClick={onClose} className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in cursor-pointer">
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-2 grow overflow-auto bg-white m-[2px] shadow-win-in relative">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
