'use client';

import React from 'react';

/**
 * A realistic Discord-style preview component.
 */
export default function DiscordPreview({ 
  title = 'Support Tickets', 
  description = 'Klicke auf den Button, um ein Ticket zu erstellen.', 
  color = '#5865F2', 
  buttonText = 'Ticket erstellen',
  useSelectMenu = false
}) {
  return (
    <div className="w-full bg-[#313338] rounded-lg overflow-hidden border border-[#1e1f22] font-['gg sans', 'Noto Sans', sans-serif] text-[15px] select-none pointer-events-none">
      <div className="p-4 flex gap-4">
        {/* Bot Profile Picture Placeholder */}
        <div className="w-10 h-10 rounded-full bg-[#5865f2] flex-shrink-0 flex items-center justify-center text-white font-bold text-xs uppercase">
          NB
        </div>

        <div className="flex-1 min-w-0">
          {/* Bot Name and Tag */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-white text-[15.5px]">Nexus OS</span>
            <span className="bg-[#5865f2] text-white text-[10px] px-1 rounded-[3px] font-medium leading-[15px] h-[15px] mt-0.5">BOT</span>
            <span className="text-[#949ba4] text-xs mt-0.5 ml-1">heute um 01:23</span>
          </div>

          {/* Embed */}
          <div className="flex mb-2">
            <div 
              className="w-1 rounded-l-[4px]" 
              style={{ backgroundColor: color }} 
            />
            <div className="bg-[#2b2d31] rounded-r-[4px] p-4 flex-1 border border-l-0 border-transparent">
              <div className="font-bold text-white text-base mb-2">{title}</div>
              <div className="text-[#dbdee1] whitespace-pre-wrap leading-[1.375rem]">{description}</div>
            </div>
          </div>

          {/* Components Area */}
          <div className="flex flex-wrap gap-2 mt-4">
            {useSelectMenu ? (
              <div className="w-full max-w-[400px] bg-[#1e1f22] border border-[#1e1f22] rounded-[4px] px-2.5 py-2 flex items-center justify-between">
                <span className="text-[#949ba4] text-sm">Kategorie auswählen...</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b5bac1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            ) : (
              <div className="bg-[#4e5058] hover:bg-[#6d6f78] text-white px-4 py-1.5 rounded-[3px] text-sm font-medium flex items-center gap-2 transition-colors">
                <span>🎫</span>
                {buttonText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
