/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TERMS_EXPLANATION } from '../data/mockData';
import { HelpCircle, X } from 'lucide-react';

interface TermTooltipProps {
  termKey: keyof typeof TERMS_EXPLANATION;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ termKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const term = TERMS_EXPLANATION[termKey];

  if (!term) return null;

  return (
    <span className="inline-flex items-center relative ml-1">
      <button
        type="button"
        id={`tooltip-btn-${termKey}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-blue-500 hover:text-blue-700 transition-colors cursor-help p-0.5"
        title="용어 설명 보기"
      >
        <HelpCircle className="w-4 h-4 inline" />
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-800">
            <span className="font-bold text-yellow-400">💡 {term.title}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="leading-relaxed font-normal text-slate-200">{term.desc}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
};
