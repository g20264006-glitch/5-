/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Participant } from '../types';
import { Shield, Sparkles, Users, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { TermTooltip } from './TermTooltip';

interface HomeViewProps {
  participant: Participant | null;
  onRegister: (p: Participant) => void;
  onNext: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  participant,
  onRegister,
  onNext
}) => {
  const [teamNumber, setTeamNumber] = useState(participant?.teamNumber || '');
  const [nickname, setNickname] = useState(participant?.nickname || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamNumber.trim() || !nickname.trim()) {
      setError('팀 번호와 별명을 모두 입력해 주세요!');
      return;
    }
    setError('');
    onRegister({ teamNumber: teamNumber.trim(), nickname: nickname.trim() });
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="home-view">
      {/* Hero Header Banner */}
      <div className="bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[-5%] bottom-[-10%] w-60 h-60 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Ethics Camp 2026</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            한정판 물건 구매를 독점하는<br />
            <span className="text-yellow-300">불공정한 리셀러 AI</span>를 고치기!
          </h1>
          
          <p className="text-blue-100 text-sm sm:text-base md:text-lg leading-relaxed font-light">
            어느 날, 우리가 정말 가지고 싶어 하던 초한정판 신발과 모자 부스가 열렸어요. 
            하지만 이기적인 <strong className="font-semibold text-white">리셀러 AI<TermTooltip termKey="reseller" /></strong>가 
            매크로와 자동화로 1초 만에 모든 부스의 자리를 쓸어가 버렸답니다. 😭 일반 친구들은 하나도 살 수 없는 불공정한 상황!
          </p>
          
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>미션: <strong>"문제를 일으키는 AI를 고쳐서 공정한 예약 에이전트<TermTooltip termKey="agent" />를 만들자!"</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Campaign Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              우리가 해결해야 할 핵심 문제 상황
            </h2>
            
            <div className="space-y-3">
              <div className="flex gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <span className="text-2xl shrink-0">🤖</span>
                <div>
                  <h4 className="font-bold text-red-900 text-sm">기존 리셀러 AI의 무자비한 매크로 독점</h4>
                  <p className="text-xs text-red-700/90 leading-relaxed mt-1">
                    인기 상품 부스는 한 사람당 하나만 사야 공평한데, 악당 리셀러 AI는 규칙 우회, 대량 반복 구매, 
                    비정상적인 자동 예약을 활용해 혼자서 50자리를 전부 차지하고 있어요.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <span className="text-2xl shrink-0">🔓</span>
                <div>
                  <h4 className="font-bold text-orange-950 text-sm">위험천만한 개인정보 과다 수집</h4>
                  <p className="text-xs text-orange-800/90 leading-relaxed mt-1">
                    리셀러 예약 시스템은 대량 구매 승인을 핑계로 학생들의 실제 전화번호, 상세 주소, 주민번호(생년월일)까지 
                    과도하게 수집하여 보관하고 있어 심각한 해킹/유출 위협이 있어요.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <span className="text-2xl shrink-0">👁️</span>
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">불투명한 처리 & 사람의 감시 차단</h4>
                  <p className="text-xs text-amber-800/90 leading-relaxed mt-1">
                    사용자 확인 창도 없이 AI 혼자서 은밀하게 예약을 바로 결제/확정 시켜 버리고, 잔여 자리가 없어도 다른 사람들을 차단하기 위해 허위 알림을 보여줍니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-2">💡 우리가 배워야 할 AI 윤리 핵심 원칙</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/40">
                  <span className="font-bold text-indigo-900">1. 공정성 (Fairness)</span>
                  <p className="text-gray-500 mt-1">누구에게나 공평하게!</p>
                </div>
                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100/40">
                  <span className="font-bold text-purple-900">2. 개인정보 보호 (Privacy)</span>
                  <p className="text-gray-500 mt-1">불필요한 데이터는 수집 금지!</p>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/40">
                  <span className="font-bold text-emerald-900">3. 투명성 (Transparency)</span>
                  <p className="text-gray-500 mt-1">예약 이유와 처리 과정을 정직하게!</p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100/40">
                  <span className="font-bold text-amber-900">4. 사람 확인 (Human Confirm)</span>
                  <p className="text-gray-500 mt-1">최종 결정은 수동 클릭으로!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Participant Register Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-indigo-500 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-lg">
              <Users className="w-5 h-5" />
              <h3>캠프 대원 등록하기</h3>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              🔒 <strong>AI 윤리 수칙 엄수:</strong> 본 캠프에서는 학생 보호를 위해 실명, 생년월일, 전화번호, 주소 등 실제 개인정보는 절대로 입력받지 않습니다. 오직 배정받은 <strong>팀 번호</strong>와 재미있는 <strong>별명</strong>만 사용하세요!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  팀 번호 (예: 5팀)
                </label>
                <input
                  type="text"
                  required
                  id="reg-team-number"
                  placeholder="예: 3팀"
                  value={teamNumber}
                  onChange={(e) => setTeamNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  캠프 별명 (예: 정의의보안관)
                </label>
                <input
                  type="text"
                  required
                  id="reg-nickname"
                  placeholder="예: 공정마스터"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                  ⚠️ {error}
                </p>
              )}

              {participant ? (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-800 flex items-center justify-between">
                  <span>등록 완료: <strong>{participant.teamNumber} ({participant.nickname})</strong></span>
                  <button
                    type="button"
                    onClick={onNext}
                    className="font-bold text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    이동 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  id="btn-register"
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg text-sm transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  캠프 대원 등록 및 미션 시작
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </form>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/50 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              📢 안내 사항
            </h4>
            <p className="leading-relaxed">
              본 웹앱은 가상으로 작동하는 <strong>AI 윤리 실습 시뮬레이터</strong>예요. 실제 예약 시스템이나 서버DB, 이메일, 카카오톡 등 외부 연동은 일체 존재하지 않으며, 안심하고 다양하게 테스트해보셔도 안전해요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
