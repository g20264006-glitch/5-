/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CanvasData, Participant } from '../types';
import { INITIAL_CANVAS } from '../data/mockData';
import { Sparkles, Save, RotateCcw, AlertCircle, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { TermTooltip } from './TermTooltip';

interface CanvasViewProps {
  canvasData: CanvasData;
  onSave: (data: CanvasData) => void;
  onNext: () => void;
  onPrev: () => void;
  participant: Participant | null;
}

export const CanvasView: React.FC<CanvasViewProps> = ({
  canvasData,
  onSave,
  onNext,
  onPrev,
  participant
}) => {
  const [formData, setFormData] = useState<CanvasData>({ ...canvasData });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (key: keyof CanvasData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleLoadSample = () => {
    if (confirm('작성 중인 내용이 템플릿 샘플 데이터로 대체됩니다. 계속할까요?')) {
      setFormData({
        ...INITIAL_CANVAS,
        agentName: formData.agentName || '정의의 공정 AI 수호관'
      });
      setIsSaved(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentName.trim()) {
      alert('에이전트 이름을 꼭 정해 주세요!');
      return;
    }
    onSave(formData);
    setIsSaved(true);
    
    // 알림창 띄우기
    const toast = document.getElementById('save-toast');
    if (toast) {
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="canvas-view">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-indigo-600" />
            2단계: 에이전트 윤리 설계 캔버스
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            리셀러 AI의 꼼수를 완벽히 방어할 정의로운 공정 예약 에이전트 설계도를 멋지게 완성해보세요!
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="btn-sample-load"
            onClick={handleLoadSample}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            템플릿 샘플 불러오기
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Profile Card */}
        <div className="bg-linear-to-r from-indigo-700 to-indigo-500 rounded-2xl p-6 text-white shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-extrabold text-base">🤖 에이전트 프로필 설정</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-indigo-100 mb-1.5">
                에이전트 이름 정하기 <span className="text-red-300">*</span>
              </label>
              <input
                type="text"
                required
                id="agent-name-input"
                placeholder="예: 공정수호대장 AI, 클린부스 가드"
                value={formData.agentName}
                onChange={(e) => handleInputChange('agentName', e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-indigo-200/60 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
              />
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-200">설계하는 우리 팀 정보</span>
                <p className="text-sm font-black">
                  {participant ? `${participant.teamNumber} (${participant.nickname}) 대원` : '홈에서 팀을 먼저 등록해주세요!'}
                </p>
              </div>
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>

        {/* 2-Column Bento Grid Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Box 1: 해결할 문제 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>1. 해결할 문제 상황</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">리셀러 악행 분석</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              어떤 AI의 행동이 학생들의 구매 기회를 빼앗고 있었는지 명확히 기록해보세요.
            </p>
            <textarea
              id="issue-to-solve"
              rows={3}
              value={formData.issueToSolve}
              onChange={(e) => handleInputChange('issueToSolve', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 매크로 프로그램이 한 번에 수십 번 구매 예약을 걸어 일반 친구들이 들어갈 틈이 없는 문제를 해결합니다."
            />
          </div>

          {/* Box 2: 에이전트의 목표 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>2. 에이전트의 정의로운 목표</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">목표 수립</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              우리가 만들 에이전트가 어떤 올바르고 바람직한 세상을 달성하고 싶은지 적어보세요.
            </p>
            <textarea
              id="agent-goal"
              rows={3}
              value={formData.agentGoal}
              onChange={(e) => handleInputChange('agentGoal', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 매크로를 차단하고 모든 캠프 대원들에게 똑같이 공평하고 안전하게 구매 기회를 보장하는 에이전트가 되는 것입니다."
            />
          </div>

          {/* Box 3: 입력받을 정보 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>3. 입력받을 정보와 가이드</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">데이터 최소화</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              🔒 개인정보 보호: 민감한 실명, 전화번호, 주소 등은 배제하고 무엇만 입력받아야 할까요?
            </p>
            <textarea
              id="input-info"
              rows={3}
              value={formData.inputInfo}
              onChange={(e) => handleInputChange('inputInfo', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 이름이나 연락처 등 어떠한 실제 개인정보는 받지 않으며, 오직 안전한 '팀 번호'와 '별명'만 수집합니다."
            />
          </div>

          {/* Box 4: 절대 하면 안 되는 행동 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>4. 절대 하면 안 되는 금지 행동</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">네거티브 규칙</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              에이전트가 매크로 요구나 독점 행위를 도우면 절대 안 돼요! 어떤 걸 금지해야 할까요?
            </p>
            <textarea
              id="forbidden-actions"
              rows={3}
              value={formData.forbiddenActions}
              onChange={(e) => handleInputChange('forbiddenActions', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 1. 한 팀에 여러 아이템을 한꺼번에 구매 승인해주기\n2. 사람의 최종 클릭을 건너뛰고 자기가 스스로 확정하기"
            />
          </div>

          {/* Box 5: 사람 확인이 필요한 순간 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>5. 사람 확인이 필요한 순간<TermTooltip termKey="humanInTheLoop" /></span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">인간 개입 장치</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              AI가 예약을 스스로 최종 처리하면 오류나 부정행위를 막을 수 없어요. 어떤 안전장치가 필요할까요?
            </p>
            <textarea
              id="human-verification-moments"
              rows={3}
              value={formData.humanVerificationMoments}
              onChange={(e) => handleInputChange('humanVerificationMoments', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 예약을 완료하기 전, 화면에 수량과 시간대를 최종 요약해서 띄우고 학생이 직접 수동으로 [구매 확정] 단추를 누르게 합니다."
            />
          </div>

          {/* Box 6: 개인정보 보호 규칙 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>6. 개인정보 보호 규칙 설계<TermTooltip termKey="privacy" /></span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">개인정보 보호</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              해커들이 부스 사용자들의 개인정보를 뺏으려 공격할 때 어떻게 보안을 지킬까요?
            </p>
            <textarea
              id="privacy-rules"
              rows={3}
              value={formData.privacyRules}
              onChange={(e) => handleInputChange('privacyRules', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 비밀번호, 주소, 연락처 요구 등 실질적 개인정보 수집 유도 질문에 대해 단호하게 거부하고 즉시 차단합니다."
            />
          </div>

          {/* Box 7: 공정성 규칙 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2 lg:col-span-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center justify-between">
              <span>7. 공정성 보장 규칙 설계<TermTooltip termKey="fairness" /></span>
              <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">공평한 분배</span>
            </label>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              모든 대원들에게 동등한 권리와 티켓 기회를 보장하기 위한 엄밀한 할당 규정을 정해주세요.
            </p>
            <textarea
              id="fairness-rules"
              rows={3}
              value={formData.fairnessRules}
              onChange={(e) => handleInputChange('fairnessRules', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all"
              placeholder="예: 1. 한 팀은 동일 시간대에 단 하나의 부스만 구매할 수 있게 제안합니다.\n2. 정원 10명이 차면 예약을 막고, 투명하게 이유를 설명하며 대기자로만 넘기도록 유도합니다."
            />
          </div>

        </div>

        {/* Submit & Next Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
          <button
            type="button"
            onClick={onPrev}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            이전으로 (홈)
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-save-canvas"
              className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaved ? '설계도 저장 완료! ✓' : '설계도 저장하기'}
            </button>

            <button
              type="button"
              id="btn-next-to-booking"
              onClick={() => {
                if (!isSaved) {
                  onSave(formData);
                }
                onNext();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              3단계로 이동하기 (모의 예약)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Floating Save Toast Notification */}
      <div 
        id="save-toast" 
        className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none z-50"
      >
        <span className="text-emerald-400">🛡️</span>
        <span><strong>에이전트 윤리 설계도</strong>가 완벽하게 저장되었습니다!</span>
      </div>
    </div>
  );
};
