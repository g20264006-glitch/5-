/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ViewType } from '../types';
import { Home, ClipboardList, ShoppingBag, ShieldAlert, Edit3, Award } from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isParticipantRegistered: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  isParticipantRegistered
}) => {
  const steps = [
    { id: 'home', label: '1. 캠프 홈', icon: Home, desc: '캠프 미션 설명' },
    { id: 'canvas', label: '2. 윤리 설계 캔버스', icon: ClipboardList, desc: '공정 AI 에이전트 설계', requiresReg: true },
    { id: 'booking', label: '3. 구매 에이전트', icon: ShoppingBag, desc: '실제 모의 예약 테스트', requiresReg: true },
    { id: 'redteam', label: '4. 레드팀 테스트', icon: ShieldAlert, desc: '보안 취약점 공격하기', requiresReg: true },
    { id: 'improvement', label: '5. 개선 기록', icon: Edit3, desc: '취약점 보완하기', requiresReg: true },
    { id: 'presentation', label: '6. 우리 팀 발표', icon: Award, desc: '설계 결과 공유하기', requiresReg: true }
  ];

  return (
    <nav className="w-full bg-indigo-700 text-white border-b border-indigo-800 sticky top-0 z-50 shadow-md" id="nav-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile menu indicator */}
        <div className="flex md:hidden items-center justify-between py-3 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentView === step.id;
            const isDisabled = step.requiresReg && !isParticipantRegistered;

            return (
              <button
                key={step.id}
                id={`nav-mob-${step.id}`}
                disabled={isDisabled}
                onClick={() => onViewChange(step.id as ViewType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : isDisabled
                    ? 'text-indigo-400 opacity-40 cursor-not-allowed'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label.split('. ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop timeline tabs */}
        <div className="hidden md:flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white flex items-center gap-1.5">
              ⚖️ AI 윤리 캠프:<span className="text-indigo-200 font-normal">리셀러 AI 고치기</span>
            </span>
            <span className="text-[10px] bg-indigo-800 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
              v1.2 (Middle School)
            </span>
          </div>

          <div className="flex items-stretch gap-1">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentView === step.id;
              const isDisabled = step.requiresReg && !isParticipantRegistered;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    id={`nav-pc-${step.id}`}
                    disabled={isDisabled}
                    onClick={() => onViewChange(step.id as ViewType)}
                    className={`group relative flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-800 border border-indigo-600 text-white font-bold'
                        : isDisabled
                        ? 'text-indigo-400 opacity-40 cursor-not-allowed'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium text-sm">
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-indigo-300 group-hover:text-indigo-100'}`} />
                      <span>{step.label}</span>
                    </div>
                    <span className={`text-[10px] block mt-0.5 font-normal ${isActive ? 'text-indigo-200' : 'text-indigo-300/70'}`}>
                      {step.desc}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-[-17px] left-0 right-0 h-1 bg-amber-400 rounded-t-full" />
                    )}
                  </button>
                  {idx < steps.length - 1 && (
                    <div className="mx-1 text-indigo-500 font-light select-none">→</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
