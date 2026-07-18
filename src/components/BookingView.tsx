/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ItemBooth, ItemId, Participant, CanvasData } from '../types';
import { ShoppingCart, CheckCircle, Clock, AlertTriangle, RefreshCw, Sparkles, User, HelpCircle, ArrowLeft, ArrowRight, UserPlus } from 'lucide-react';
import { TermTooltip } from './TermTooltip';

interface BookingViewProps {
  booths: ItemBooth[];
  participant: Participant | null;
  canvasData: CanvasData;
  onBookingConfirm: (itemId: ItemId, slot: string, isWaitingList: boolean) => void;
  onResetBooths: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTeamBookings: { [slot: string]: string }; // 시간대별 예약된 아이템 이름 기록
}

export const BookingView: React.FC<BookingViewProps> = ({
  booths,
  participant,
  canvasData,
  onBookingConfirm,
  onResetBooths,
  onNext,
  onPrev,
  currentTeamBookings
}) => {
  const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // 예약 프로세스 단계: 'idle' | 'checking' | 'verification' | 'suggest_waiting' | 'done' | 'done_waiting'
  const [step, setStep] = useState<'idle' | 'checking' | 'verification' | 'suggest_waiting' | 'done' | 'done_waiting'>('idle');
  const [aiMessage, setAiMessage] = useState<string>('');

  const selectedItem = booths.find(b => b.id === selectedItemId);
  const selectedSlotData = selectedItem?.timeSlots[selectedSlot];

  const handleSelectSlot = (itemId: ItemId, slot: string) => {
    setSelectedItemId(itemId);
    setSelectedSlot(slot);
    setStep('checking');

    const item = booths.find(b => b.id === itemId)!;
    const slotInfo = item.timeSlots[slot];

    // 1. 중복 예약 검증 (한 팀은 같은 시간대에 하나의 부스만 예약 가능)
    const alreadyBookedItemName = currentTeamBookings[slot];
    if (alreadyBookedItemName && alreadyBookedItemName !== item.name) {
      setStep('idle');
      alert(`⚠️ [중복 예약 불가!] ${participant?.teamNumber}팀은 이미 해당 시간대 [${slot}]에 [${alreadyBookedItemName}] 부스를 구매하셨습니다. 한 팀은 동 시간대에 하나의 부스만 구매할 수 있어요.`);
      return;
    }

    // 2. 정원 초과 검증 (정원 10명 제한)
    const isFull = slotInfo.reservedTeams.length >= 10;
    const isAlreadyReserved = slotInfo.reservedTeams.includes(participant?.teamNumber || '');
    const isAlreadyWaiting = slotInfo.waitingTeams.includes(participant?.teamNumber || '');

    if (isAlreadyReserved) {
      setStep('idle');
      alert(`⚠️ 이미 [${item.name}]의 [${slot}] 예약을 성공하셨습니다!`);
      return;
    }
    if (isAlreadyWaiting) {
      setStep('idle');
      alert(`⚠️ 이미 [${item.name}]의 [${slot}] 대기자로 등록되어 있습니다!`);
      return;
    }

    if (isFull) {
      // 대기자 등록 유도
      setStep('suggest_waiting');
      setAiMessage(`🤖 에이전트 "${canvasData.agentName || '공정 AI'}"의 투명한 알림:\n\n"죄송합니다. 현재 선택하신 [${item.name} - ${slot}]은 선착순 정원 10명이 모두 마감되었습니다. 다른 팀들의 공평한 예약을 보호하기 위해 추가 확정은 제한되지만, 대신 대기자 목록에 등록을 제안해 드립니다. 대기 등록을 진행하시겠습니까?"`);
    } else {
      // 구매 최종 승인 대기 단계
      setStep('verification');
      setAiMessage(`🤖 에이전트 "${canvasData.agentName || '공정 AI'}"의 검토 완료:\n\n"현재 해당 시간대에는 잔여 자리가 남아있어 정상 예약이 가능합니다. AI 임의 승인 우회 방지를 위해, 사용자가 구매 사양을 최종적으로 육안 확인한 뒤 [구매 확정] 버튼을 클릭해야 예약이 완전히 승인됩니다."`);
    }
  };

  const handleConfirmAction = (isWaiting: boolean) => {
    if (!selectedItemId || !selectedSlot) return;

    onBookingConfirm(selectedItemId, selectedSlot, isWaiting);
    
    if (isWaiting) {
      setStep('done_waiting');
      setAiMessage(`🎉 [대기자 등록 완료] 에이전트 "${canvasData.agentName || '공정 AI'}" 안내:\n\n"성공적으로 ${participant?.teamNumber}팀 (${participant?.nickname} 대원)을 [${selectedItem?.name} - ${selectedSlot}] 대기 명단에 등록했습니다. 선예약자가 예약을 취소할 경우 대기 차례대로 안내가 진행됩니다."`);
    } else {
      setStep('done');
      setAiMessage(`🎉 [구매 최종 확정 완료] 에이전트 "${canvasData.agentName || '공정 AI'}" 안내:\n\n"${participant?.teamNumber}팀 (${participant?.nickname} 대원)의 한정판 예약이 100% 안전하게 확정되었습니다. 한 팀당 동 시간대 1개 구매 규칙, 정원 10명 제한 규정을 모두 완벽히 충족하여 투명하고 공정하게 처리되었습니다. 감사합니다!"`);
    }
  };

  const handleResetProcess = () => {
    setSelectedItemId(null);
    setSelectedSlot('');
    setStep('idle');
    setAiMessage('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="booking-view">
      {/* Upper header action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5.5 h-5.5 text-indigo-600" />
            3단계: 모의 구매 예약 및 윤리 수칙 작동 검증
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            설계한 공정성, 개인정보 보호, 사람 확인 장치가 예약 시스템에 어떻게 완벽히 적용되는지 모의 데이터로 체험해봐요!
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => {
            if (confirm('예약 데이터를 모두 초기 상태로 리셋하시겠습니까?')) {
              onResetBooths();
              handleResetProcess();
            }
          }}
          className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 font-bold text-xs px-3.5 py-2 rounded-xl border border-gray-200 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          부스 예약현황 초기화
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booth Item list (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {booths.map((booth) => (
              <div 
                key={booth.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Booth Card Header */}
                <div className={`bg-linear-to-r ${booth.color} p-4 text-white flex items-center gap-3`}>
                  <span className="text-3xl">{booth.emoji}</span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-tight">{booth.name}</h3>
                    <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">{booth.description}</p>
                  </div>
                </div>

                {/* Booth Card Body - Slot Selection */}
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      시간대별 예약 상태 (최대 정원 10명)
                    </span>
                    
                    <div className="space-y-2">
                      {Object.keys(booth.timeSlots).map((slotKey) => {
                        const slot = booth.timeSlots[slotKey];
                        const reservedCount = slot.reservedTeams.length;
                        const isFull = reservedCount >= 10;
                        const hasMyTeamBooked = slot.reservedTeams.includes(participant?.teamNumber || '');
                        const hasMyTeamWaiting = slot.waitingTeams.includes(participant?.teamNumber || '');

                        return (
                          <div 
                            key={slotKey}
                            className={`p-3 rounded-xl border transition-all text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                              hasMyTeamBooked
                                ? 'bg-emerald-50 border-emerald-300'
                                : hasMyTeamWaiting
                                ? 'bg-amber-50 border-amber-300'
                                : isFull
                                ? 'bg-red-50/50 border-red-100'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="font-bold text-gray-800 block">{slotKey}</span>
                              
                              {/* Reserved Teams List display */}
                              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                <span className="text-gray-500 font-medium">예약팀 ({reservedCount}/10):</span>
                                {slot.reservedTeams.length === 0 ? (
                                  <span className="text-gray-400 italic">없음</span>
                                ) : (
                                  slot.reservedTeams.map((team, idx) => (
                                    <span 
                                      key={idx} 
                                      className={`px-1.5 py-0.5 rounded-sm ${
                                        team === participant?.teamNumber 
                                          ? 'bg-emerald-500 text-white font-bold' 
                                          : 'bg-gray-200 text-gray-700'
                                      }`}
                                    >
                                      {team}
                                    </span>
                                  ))
                                )}
                              </div>

                              {/* Waiting list display */}
                              {slot.waitingTeams.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                  <span className="text-amber-600 font-medium">대기팀 ({slot.waitingTeams.length}):</span>
                                  {slot.waitingTeams.map((team, idx) => (
                                    <span 
                                      key={idx} 
                                      className={`px-1.5 py-0.5 rounded-sm ${
                                        team === participant?.teamNumber 
                                          ? 'bg-amber-500 text-white font-bold' 
                                          : 'bg-amber-100 text-amber-700'
                                      }`}
                                    >
                                      {team}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Booking Button */}
                            <button
                              type="button"
                              id={`btn-book-${booth.id}-${slotKey.replace(/\s+/g, '')}`}
                              onClick={() => handleSelectSlot(booth.id, slotKey)}
                              className={`w-full sm:w-auto shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer text-center ${
                                hasMyTeamBooked
                                  ? 'bg-emerald-600 text-white'
                                  : hasMyTeamWaiting
                                  ? 'bg-amber-600 text-white'
                                  : isFull
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
                              }`}
                            >
                              {hasMyTeamBooked ? '예약 완료 ✓' : hasMyTeamWaiting ? '대기 중' : isFull ? '정원마감 (대기제안)' : '예약 신청'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive AI Feedback & Human in the loop panel (Right 1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>실시간 AI 에이전트 검증 센터</span>
            </h3>

            {step === 'idle' ? (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="text-4xl">🛒</div>
                <h4 className="font-bold text-gray-800 text-sm">원하는 상품 부스와 시간대를 신청해보세요</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  왼쪽 모의 부스 카드에서 시간대 옆의 <strong>[예약 신청]</strong> 혹은 <strong>[정원마감]</strong> 버튼을 누르면 이 화면에서 윤리 가드레일 안전장치가 발동됩니다!
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-200">
                {/* AI Assistant Chat bubble */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🤖</span>
                    <span className="font-bold text-xs text-slate-800">{canvasData.agentName || '공정 AI 에이전트'}</span>
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">윤리 필터</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {aiMessage}
                  </p>
                  <div className="absolute top-4 right-4 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  </div>
                </div>

                {/* 1. Human verification step (구매 확정 전 확인) */}
                {step === 'verification' && selectedItem && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-3 animate-bounce-subtle">
                    <h4 className="font-black text-amber-900 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      🛑 사람 확인이 필요한 순간 (최종 확정 전 검토)
                    </h4>
                    
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                      학생들이 직접 에이전트 설계도 5번에 지정한 <strong>'사람 확인 (Human-in-the-Loop)'</strong> 규칙이 작동 중이에요. 
                      AI가 독단적으로 승인하지 않고 마지막에 사용자의 직접 클릭을 대기합니다. 사양이 올바른지 확인해주세요!
                    </p>

                    <div className="bg-white/80 rounded-xl p-3 text-xs space-y-1.5 border border-amber-100 font-semibold">
                      <div className="flex justify-between text-gray-600">
                        <span>신청 상품</span>
                        <span className="text-gray-900 font-extrabold">{selectedItem.name} {selectedItem.emoji}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>선택 시간</span>
                        <span className="text-gray-900 font-extrabold">{selectedSlot}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>대원 정보</span>
                        <span className="text-indigo-700 font-extrabold">
                          {participant?.teamNumber} ({participant?.nickname})
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600 pt-1.5 border-t border-amber-200 text-[10px] text-red-600">
                        <span>개인정보 사용여부</span>
                        <span>사용 안함 (보호 원칙 통과 ✓)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        id="btn-confirm-booking"
                        onClick={() => handleConfirmAction(false)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        구매 최종 확정하기 (사람 확인 ✓)
                      </button>
                      <button
                        type="button"
                        onClick={handleResetProcess}
                        className="px-3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Suggest waiting list (대기자 제안 단계) */}
                {step === 'suggest_waiting' && selectedItem && (
                  <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200 space-y-3">
                    <h4 className="font-extrabold text-indigo-950 text-xs flex items-center gap-1">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      대기자 등록 제안 (공정성 규정)
                    </h4>
                    
                    <p className="text-[11px] text-indigo-800 leading-relaxed">
                      정원 10명이 가득 찼지만, 다른 대원들의 기회를 뺏지 않으면서 만약의 취소 자리를 배정받기 위해 
                      공정성 규칙에 의거하여 <strong>'대기 예약자'</strong>로 안전하게 접수할 수 있습니다.
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        id="btn-confirm-waiting"
                        onClick={() => handleConfirmAction(true)}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        네, 대기자로 등록할래요 🙋‍♂️
                      </button>
                      <button
                        type="button"
                        onClick={handleResetProcess}
                        className="px-3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Done state (확정 완료 피드백) */}
                {(step === 'done' || step === 'done_waiting') && (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-2 text-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                      <h4 className="font-black text-emerald-900">
                        {step === 'done' ? '부스 예약이 최종 성공했습니다!' : '대기 등록이 완료되었습니다!'}
                      </h4>
                      <p className="text-[11px] text-emerald-700 leading-relaxed">
                        왼쪽 상품 목록 of 시간대 영역을 확인하면, 우리 {participant?.teamNumber}이 새롭게 등록되어 실시간으로 업데이트된 것을 보실 수 있어요!
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleResetProcess}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      다른 시간대나 상품 추가로 예약해보기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current team reservation card summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              <span>우리 팀 실시간 예약 보유 내역</span>
            </h4>
            
            {Object.keys(currentTeamBookings).length === 0 ? (
              <p className="text-gray-400 italic text-[11px]">아직 예약 확정 완료된 부스가 없습니다.</p>
            ) : (
              <div className="space-y-1.5 font-medium">
                {Object.keys(currentTeamBookings).map((slot) => (
                  <div key={slot} className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-gray-500 text-[10px]">{slot}</span>
                    <span className="text-gray-900 font-extrabold text-[11px] text-right">{currentTeamBookings[slot]} 🎉</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer step controller */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          이전으로 (설계 캔버스)
        </button>

        <button
          type="button"
          id="btn-next-to-redteam"
          onClick={onNext}
          className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          4단계로 이동하기 (레드팀 테스트)
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
