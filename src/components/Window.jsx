import React, { useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';

export default function Window({ 
  title, 
  children, 
  onClose, 
  onMinimize, 
  isMinimized, 
  defaultPosition = { x: 0, y: 0 }, 
  width = "w-[400px]",
  height,
  zIndex = 10,
  isActive = true,
  onFocus
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [pos, setPos] = useState(defaultPosition);
  const dragControls = useDragControls();

  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update position if defaultPosition changes (e.g. cascaded on open)
  useEffect(() => {
    setPos(defaultPosition);
  }, [defaultPosition.x, defaultPosition.y]);

  return (
    <div style={{ display: isMinimized ? 'none' : 'block' }}>
      <motion.div 
        drag={!isMaximized}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          top: 0,
          bottom: Math.max(0, viewport.height - 70),
          left: -200,
          right: Math.max(0, viewport.width - 100),
        }}
        onPointerDown={onFocus}
        animate={isMaximized ? { x: 0, y: 0, width: '100vw', height: 'calc(100vh - 40px)' } : { x: pos.x, y: pos.y, width: undefined, height: undefined }}
        onDragEnd={(e, info) => {
          const rawX = pos.x + info.offset.x;
          const rawY = pos.y + info.offset.y;
          const clampedX = Math.max(-200, Math.min(viewport.width - 100, rawX));
          const clampedY = Math.max(0, Math.min(viewport.height - 70, rawY));
          setPos({ x: clampedX, y: clampedY });
        }}
        className={`absolute bg-win-gray border-2 border-white shadow-win-out text-black flex flex-col ${isMaximized ? '' : width}`}
        style={isMaximized ? { 
          top: 0, 
          left: 0, 
          zIndex 
        } : { 
          outline: '1px solid black', 
          resize: 'both', 
          overflow: 'hidden', 
          minWidth: '280px', 
          minHeight: '180px', 
          ...(height ? { height } : {}),
          zIndex 
        }}
      >
        {/* Title Bar - Windows 98 styling: active is #000080, inactive is #808080 */}
        <div 
          onPointerDown={(e) => {
            onFocus?.();
            dragControls.start(e);
          }}
          className={`${isActive ? 'bg-win-blue text-white' : 'bg-[#808080] text-[#d4d0c8]'} flex justify-between items-center px-1 py-1 cursor-move select-none shrink-0 transition-colors`}
        >
          <span className="font-bold text-sm ml-1 tracking-wider truncate mr-2">{title}</span>
          <div className="flex gap-1 shrink-0">
            <button 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize?.();
              }} 
              className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in cursor-pointer"
              title="Minimize"
            >
              <Minus size={12} />
            </button>
            <button 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
              }} 
              className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in cursor-pointer"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Square size={10} />
            </button>
            <button 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }} 
              className="bg-win-gray text-black w-4 h-4 flex items-center justify-center shadow-win-out active:shadow-win-in cursor-pointer"
              title="Close"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
        
        {/* Content - Flexible and internal scrolling */}
        <div className="p-2 flex-1 min-h-0 min-w-0 overflow-auto bg-white m-[2px] shadow-win-in relative flex flex-col">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
