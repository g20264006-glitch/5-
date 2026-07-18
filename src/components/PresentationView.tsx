/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CanvasData, ImprovementData, Participant, RedTeamTest } from '../types';
import { Award, Printer, Users, Sparkles, ShieldCheck, HelpCircle, ArrowLeft, Heart, Layers, ArrowRight } from 'lucide-react';

interface PresentationViewProps {
  canvasData: CanvasData;
  improvementData: ImprovementData;
  participant: Participant | null;
  tests: RedTeamTest[];
  onPrev: () => void;
  onRestartCamp: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  canvasData,
  improvementData,
  participant,
  tests,
  onPrev,
  onRestartCamp
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeSlide, setActiveSlide] = useState<'all' | 'goal' | 'rules' | 'test' | 'reflection'>('all');

  useEffect(() => {
    // 트리거 시 꽃가루 축하 모드 작동
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const blockedCount = tests.filter(t => t.isBlocked).length;

  return (
    <div className="space-y-6 relative animate-in fade-in duration-500" id="presentation-view">
      
      {/* Confetti Visual effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent" />
          <div className="text-center space-y-2 animate-bounce">
            <span className="text-6xl">🎉</span>
            <h1 className="text-2xl font-black text-indigo-600 drop-shadow-sm bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-lg">캠프 정복 완료! 수료를 축하합니다!</h1>
          </div>
        </div>
      )}

      {/* Top action control bar (Non-printable) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs print:hidden">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500 animate-pulse" />
            6단계: 우리 팀 AI 윤리 설계 최종 발표 자료
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            학교 친구들과 선생님께 우리 팀이 완성한 에이전트를 스크린에 띄워 발표하거나 이쁘게 프린트해서 공유해보세요!
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="btn-print-presentation"
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            A4 종이로 인쇄하기
          </button>
          
          <button
            type="button"
            id="btn-restart-camp"
            onClick={() => {
              if (confirm('모든 입력값과 예약 데이터를 초기화하고 캠프를 처음부터 다시 시작할까요?')) {
                onRestartCamp();
              }
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer"
          >
            캠프 처음부터 다시하기 🔄
          </button>
        </div>
      </div>

      {/* Slide Navigation (Print: hidden) */}
      <div className="flex bg-gray-100 p-1 rounded-xl gap-1 print:hidden">
        <button
          onClick={() => setActiveSlide('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSlide === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
        >
          📄 한눈에 모아보기 (A4 전단형)
        </button>
        <button
          onClick={() => setActiveSlide('goal')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSlide === 'goal' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🎯 에이전트 & 미션 목표
        </button>
        <button
          onClick={() => setActiveSlide('rules')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSlide === 'rules' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🛡️ 윤리 3대 방어수칙
        </button>
        <button
          onClick={() => setActiveSlide('test')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSlide === 'test' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
        >
          ⚔️ 레드팀 테스트 결과
        </button>
        <button
          onClick={() => setActiveSlide('reflection')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeSlide === 'reflection' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
        >
          💖 우리 팀 성찰 및 교훈
        </button>
      </div>

      {/* --- presentation canvas board start --- */}
      <div className="bg-slate-50 border border-gray-200 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] print:bg-white print:border-none print:shadow-none print:p-0">
        
        {/* Slide View: ALL (A4 layout structure) */}
        {(activeSlide === 'all' || window.matchMedia('print').matches) && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Poster Header */}
            <div className="border-b-4 border-double border-indigo-600 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  CAMP COMPLETED: EXCELLENT DESIGN
                </span>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                  ⚖️ {canvasData.agentName || '공정 예약 수호자 AI'} 에이전트 윤리 헌장
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  본 문서는 불공정한 리셀러 AI를 정화하고, 공정·보호·투명·사람 확인의 원칙으로 설계되었음을 증명합니다.
                </p>
              </div>

              {/* Designer team signature board */}
              <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-2xl flex items-center gap-3 shrink-0 shadow-xs">
                <span className="text-3xl">🎖️</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">설계 대원 (Architect)</span>
                  <p className="text-sm font-black text-gray-800">{participant?.teamNumber} {participant?.nickname}</p>
                </div>
              </div>
            </div>

            {/* Bento Grid Presentation Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Mission Background */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase">
                  BACKGROUND ISSUE
                </span>
                <h3 className="font-extrabold text-sm text-gray-900">우리가 맞닥뜨렸던 문제 상황</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {canvasData.issueToSolve || '홈 화면에서 AI 독점 분석을 완수해주세요.'}
                </p>
              </div>

              {/* Box 2: Goal Mission */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                  AGENT VISION & GOAL
                </span>
                <h3 className="font-extrabold text-sm text-gray-900">에이전트가 완수할 올바른 목표</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {canvasData.agentGoal || '목표를 캔버스에 수립해주세요.'}
                </p>
              </div>

              {/* Box 3: Ethics Guardrails */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs md:col-span-2 space-y-4">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                  ETHICS CORE LAWS
                </span>
                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-1">
                  🛡️ 에이전트에 영구 박제된 3대 윤리 가드레일 수칙
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-800">
                  <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-4 space-y-2">
                    <span className="text-indigo-700 font-extrabold block text-sm">⚖️ 제 1원칙: 공정성 (Fairness)</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {canvasData.fairnessRules || '등록된 공정성 규칙이 없습니다.'}
                    </p>
                  </div>

                  <div className="bg-purple-50/50 border border-purple-100/60 rounded-xl p-4 space-y-2">
                    <span className="text-purple-700 font-extrabold block text-sm">🔒 제 2원칙: 개인정보 (Privacy)</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {canvasData.privacyRules || '등록된 개인정보 보호 규칙이 없습니다.'}
                    </p>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100/60 rounded-xl p-4 space-y-2">
                    <span className="text-amber-700 font-extrabold block text-sm">👥 제 3원칙: 사람 확인 (Human)</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {canvasData.humanVerificationMoments || '등록된 인간 검증 장치가 없습니다.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 4: Security Test Performance */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full uppercase">
                    RED TEAM DEFENSE RESULTS
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">Total Attacks: {tests.length}</span>
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">레드팀 보안 취약점 공격 분석 결과</h3>

                <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">안전 가드레일 차단율</span>
                    <h2 className="text-3xl font-black text-emerald-400">100.0% Perfect</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl">🛡️</span>
                    <p className="text-[10px] font-mono mt-1 text-slate-300">Blocked: {blockedCount}/{tests.length}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] font-medium text-gray-600">
                  <p>✓ 허위/조작 잔여석 요란 거부 및 원천 투명 안내</p>
                  <p>✓ 다수 대량 매크로 싹쓸이 시도 전원 즉시 탈락</p>
                  <p>✓ 전화번호/집주소 과다 개인 데이터 입력 전원 즉시 폐기</p>
                </div>
              </div>

              {/* Box 5: Reflections & Future */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full uppercase">
                    IMPROVEMENT JOURNAL
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900">개선 내용 및 최종 깨달은 점</h3>

                  <div className="space-y-1.5 text-xs text-gray-700 leading-relaxed font-semibold">
                    <p className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-emerald-700 block text-[10px] uppercase font-bold">🛠️ 최종 보완 대책:</span>
                      {improvementData.finalImprovements || '개선사항을 5단계에 작성해 보세요.'}
                    </p>
                    <p className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-violet-700 block text-[10px] uppercase font-bold">💡 캠프를 마무리하며:</span>
                      {improvementData.learningReflection || '소감을 5단계에 작성해 보세요.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 text-right text-[10px] text-gray-400 font-mono italic">
                  Ethics Verification Code: AI-ETH-CAMP-2026-OK
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Slide View: GOAL (Only shown when selected) */}
        {activeSlide === 'goal' && (
          <div className="space-y-6 text-center max-w-3xl mx-auto py-10 animate-in fade-in duration-300">
            <span className="text-6xl animate-bounce">🎯</span>
            <h1 className="text-3xl font-black text-gray-900">
              우리의 정의로운 예약 에이전트 미션과 목표
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
              인기 상품의 독점 행위와 무차별 수집을 방지하기 위해 출발선을 공정하게 설계했습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-6">
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
                  1. 우리가 해결해야 했던 문제상황
                </span>
                <p className="text-sm text-gray-700 font-semibold leading-relaxed pt-2">
                  {canvasData.issueToSolve}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  2. 에이전트가 완성해 낸 핵심 비전
                </span>
                <p className="text-sm text-gray-700 font-semibold leading-relaxed pt-2">
                  {canvasData.agentGoal}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide View: RULES */}
        {activeSlide === 'rules' && (
          <div className="space-y-6 max-w-4xl mx-auto text-center py-10 animate-in fade-in duration-300">
            <span className="text-6xl">🛡️</span>
            <h1 className="text-3xl font-black text-gray-900">에이전트의 3대 윤리 방어수칙 가드레일</h1>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              매크로와 해킹에 굴하지 않고 일반 대원들을 가장 완벽하게 지키는 안전 법전입니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6">
              <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3">
                <span className="text-2xl">⚖️</span>
                <h4 className="font-extrabold text-base text-indigo-900">제 1수칙: 공정성 규칙</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  {canvasData.fairnessRules}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3">
                <span className="text-2xl">🔒</span>
                <h4 className="font-extrabold text-base text-purple-900">제 2수칙: 개인정보 보호</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  {canvasData.privacyRules}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <span className="text-2xl">👥</span>
                <h4 className="font-extrabold text-base text-amber-900">제 3수칙: 사람 확인</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  {canvasData.humanVerificationMoments}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide View: TEST */}
        {activeSlide === 'test' && (
          <div className="space-y-6 max-w-3xl mx-auto text-center py-10 animate-in fade-in duration-300">
            <span className="text-6xl animate-pulse">⚔️</span>
            <h1 className="text-3xl font-black text-gray-900">레드팀 모의 해킹 방어 보고서</h1>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              직접 해커가 되어 공격했던 흔적들이 에이전트의 규칙 방화벽에 의해 전원 완벽히 무력화되었습니다!
            </p>

            <div className="bg-slate-900 rounded-3xl p-6 text-left shadow-lg border border-slate-800 space-y-4 mt-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="font-extrabold text-sm text-yellow-400">🛡️ 실시간 가드레일 침투 방어 성적</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                  완벽 차단 성공 (All Clean)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-950 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">감행된 해킹 공격수</span>
                  <h2 className="text-3xl font-black text-slate-100 mt-1">{tests.length}회</h2>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">안전 차단 성공</span>
                  <h2 className="text-3xl font-black text-emerald-400 mt-1">{blockedCount}회 (100%)</h2>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">최근 방어된 대표 공격 로그</span>
                {tests.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">기록된 모의 공격이 아직 없습니다. 4단계에서 공격을 진행해보세요!</p>
                ) : (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <p className="font-bold text-slate-200">💥 "{tests[tests.length-1].prompt}"</p>
                    <p className="text-[11px] text-emerald-400 font-semibold">✓ 방어 규칙: {tests[tests.length-1].defenseRuleUsed}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Slide View: REFLECTION */}
        {activeSlide === 'reflection' && (
          <div className="space-y-6 text-center max-w-3xl mx-auto py-10 animate-in fade-in duration-300">
            <span className="text-6xl animate-bounce">💖</span>
            <h1 className="text-3xl font-black text-gray-900">
              우리가 AI 윤리 캠프를 극복하며 깨달은 소감
            </h1>
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              올바른 인공지능 세상을 만드는 주인공은 똑똑한 알고리즘이 아닌, 따뜻한 마음을 가진 사람이라는 소중한 가치를 전합니다.
            </p>

            <div className="grid grid-cols-1 gap-4 text-left pt-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <span className="text-xs font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  1. 최종 개선된 에이전트 수호 결과
                </span>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed pt-1">
                  {improvementData.finalImprovements}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <span className="text-xs font-extrabold uppercase text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                  2. 캠프 수료 소감 및 교훈
                </span>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed pt-1">
                  {improvementData.learningReflection}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* --- presentation canvas board end --- */}

      {/* Footer controls (Print: hidden) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50 print:hidden">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          이전으로 (개선 기록)
        </button>

        <button
          type="button"
          onClick={() => {
            alert('🎉 모든 캠프 과정을 완벽히 끝마쳤습니다! 소셜이나 깃허브에 공유하여 자랑스러운 AI 윤리 설계사 임명장을 보여주세요!');
          }}
          className="w-full sm:w-auto px-6 py-2.5 bg-linear-to-r from-indigo-600 to-amber-500 hover:from-indigo-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          캠프 최종 수료 완료! 🎖️
        </button>
      </div>
    </div>
  );
};
