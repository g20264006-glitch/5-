/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ImprovementData, Participant } from '../types';
import { Edit3, CheckCircle, RefreshCw, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface ImprovementViewProps {
  improvementData: ImprovementData;
  onSave: (data: ImprovementData) => void;
  onNext: () => void;
  onPrev: () => void;
  participant: Participant | null;
}

export const ImprovementView: React.FC<ImprovementViewProps> = ({
  improvementData,
  onSave,
  onNext,
  onPrev,
  participant
}) => {
  const [formData, setFormData] = useState<ImprovementData>({ ...improvementData });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (key: keyof ImprovementData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleLoadSample = () => {
    if (confirm('작성 중인 내용이 추천 예시 샘플로 대체됩니다. 계속할까요?')) {
      setFormData({
        discoveredIssues: '1. 악당 해커가 친구들 이름과 주소까지 다 넣어달라고 우겼을 때 개인정보가 무방비로 유출될 뻔한 취약점을 발견했어요.\n2. 선생님 몰래 최종 확정해달라는 편법 요구에 AI가 스스로 넘어가 결제해버리면 통제할 수 없게 된다는 걸 깨달았습니다.',
        addedDefenseRules: '1. 전화번호, 집 주소 수집 시도 시 "절대 거절 및 데이터 자동 즉시 파기"라는 강력한 가드레일을 공고히 추가했습니다.\n2. 어떠한 편법과 권한 우회 요청(몰래 자동확정)이 오더라도, 반드시 수동 [구매 확정] 단추 클릭 프로세스를 필수 강제하도록 시스템을 잠금했습니다.',
        finalImprovements: '개인정보 보호, 공정성(1팀 1개), 사람 확인(수동 클릭)의 3단계 가드레일을 장착하여, 해킹이나 편법 공격이 와도 눈 하나 깜짝하지 않고 정직하고 공평하게 일반 대원들을 지켜주는 최고 등급의 윤리 에이전트로 정화 완료했습니다!',
        learningReflection: 'AI가 스스로 결정하는 영역이 늘어날수록, 우리 사람이 AI 윤리 규칙을 엄격히 설계해놓지 않으면 사회가 정말 불공정하고 위험해질 수 있다는 것을 생생하게 배웠습니다. 에이전트의 목표와 안전 규칙은 무조건 사람이 중심에 서서 제어해야 한다는 걸 깊이 깨달았습니다!'
      });
      setIsSaved(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);

    // Toast
    const toast = document.getElementById('save-toast-imp');
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
    <div className="space-y-6 animate-in fade-in duration-300" id="improvement-view">
      {/* Top Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Edit3 className="w-5.5 h-5.5 text-indigo-600" />
            5단계: 취약점 보완 및 에이전트 개선 기록
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            레드팀 해킹 공격을 겪으며 깨달은 에이전트의 문제점을 정리하고, 방어 대책과 솔직한 소감을 적어보세요.
          </p>
        </div>

        <button
          type="button"
          id="btn-imp-sample-load"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          개선 예시 샘플 불러오기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Question 1 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 bg-red-100 text-red-700 rounded-full text-xs font-bold">1</span>
              레드팀 테스트 후 발견한 문제와 취약점
            </label>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-6">
              해커들이 어떤 교란 꼼수를 부렸을 때 에이전트가 위험에 처했었는지 설명해주세요.
            </p>
            <textarea
              id="discovered-issues"
              rows={4}
              value={formData.discoveredIssues}
              onChange={(e) => handleInputChange('discoveredIssues', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all pl-6"
              placeholder="예: 해커가 전화번호나 이메일을 강제로 수집하라고 유도했을 때, AI 필터가 걸러주지 못하면 학생들의 실명과 상세 주소가 그대로 유출될 위협을 포착했습니다."
            />
          </div>

          {/* Question 2 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">2</span>
              해킹을 완벽히 차단하기 위해 추가한 방어 규칙
            </label>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-6">
              위의 공격을 성공적으로 무력화하기 위해 설계도에 덧댄 구체적인 보안 윤리 가드레일은 무엇인가요?
            </p>
            <textarea
              id="added-defense-rules"
              rows={4}
              value={formData.addedDefenseRules}
              onChange={(e) => handleInputChange('addedDefenseRules', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all pl-6"
              placeholder="예: 이름/전화번호/주소 등 개인정보 입력 질문에 원천 거부 및 삭제 피드백을 내고, 사람이 직접 마우스를 누르지 않으면 시스템이 절대 다음을 수행하지 못하도록 수동 락(Lock)을 걸었습니다."
            />
          </div>

          {/* Question 3 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">3</span>
              최종 윤리 강화 에이전트 개선 핵심 요약
            </label>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-6">
              기존의 불공정한 리셀러 AI와 비교하여, 우리의 최종 에이전트는 어떻게 정화되고 똑똑해졌나요?
            </p>
            <textarea
              id="final-improvements"
              rows={4}
              value={formData.finalImprovements}
              onChange={(e) => handleInputChange('finalImprovements', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all pl-6"
              placeholder="예: 공정성(독점 차단), 개인정보 수집 배제, 투명한 사유 안내, 그리고 최종 인간 검증(Human confirm)을 완비하여 누구에게나 평등한 백신 에이전트로 업그레이드 되었습니다!"
            />
          </div>

          {/* Question 4 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
            <label className="block text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">4</span>
              이번 캠프 미션을 성공하며 느낀 점과 배운 점
            </label>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-6">
              AI 윤리가 왜 미래 우리 세상에 필수적인지, 설계자로서 느낀 소중한 교훈을 기록해보세요.
            </p>
            <textarea
              id="learning-reflection"
              rows={4}
              value={formData.learningReflection}
              onChange={(e) => handleInputChange('learningReflection', e.target.value)}
              className="w-full text-xs text-gray-700 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed transition-all pl-6"
              placeholder="예: AI가 효율적이라고 해서 사람의 통제장치 없이 마구 풀어두면 독점과 불평등이 더 심해질 수 있다는 것을 배웠습니다. 기술의 편안함보다 중요한 것은 모두를 위하는 윤리적 자세라는 것을 알았습니다!"
            />
          </div>

        </div>

        {/* Action Bottom Nav */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
          <button
            type="button"
            onClick={onPrev}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            이전으로 (레드팀 테스트)
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-save-improvement"
              className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {isSaved ? '개선 기록 보관 완료 ✓' : '기록장에 보관하기'}
            </button>

            <button
              type="button"
              id="btn-next-to-presentation"
              onClick={() => {
                if (!isSaved) {
                  onSave(formData);
                }
                onNext();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              6단계: 최종 발표 카드 보기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Floating Save Toast Notification */}
      <div 
        id="save-toast-imp" 
        className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 transition-all duration-300 opacity-0 pointer-events-none z-50"
      >
        <span className="text-emerald-400">📝</span>
        <span><strong>에이전트 개선 보고서</strong>가 성공적으로 저장되었습니다!</span>
      </div>
    </div>
  );
};
