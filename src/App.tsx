/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewType, Participant, CanvasData, ItemBooth, RedTeamTest, ImprovementData, ItemId } from './types';
import { INITIAL_CANVAS, INITIAL_BOOTHS } from './data/mockData';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { CanvasView } from './components/CanvasView';
import { BookingView } from './components/BookingView';
import { RedTeamView } from './components/RedTeamView';
import { ImprovementView } from './components/ImprovementView';
import { PresentationView } from './components/PresentationView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [canvasData, setCanvasData] = useState<CanvasData>({ ...INITIAL_CANVAS });
  const [booths, setBooths] = useState<ItemBooth[]>(() => JSON.parse(JSON.stringify(INITIAL_BOOTHS)));
  const [redTeamTests, setRedTeamTests] = useState<RedTeamTest[]>([]);
  
  const [improvementData, setImprovementData] = useState<ImprovementData>({
    discoveredIssues: '',
    addedDefenseRules: '',
    finalImprovements: '',
    learningReflection: ''
  });

  // 현재 참가자 팀의 시간대별 예약 완료된 아이템 이름 기록 { [timeSlot]: itemName }
  const [currentTeamBookings, setCurrentTeamBookings] = useState<{ [slot: string]: string }>({});

  // 참가자 정보 등록 핸들러
  const handleRegisterParticipant = (p: Participant) => {
    setParticipant(p);
  };

  // 캔버스 설계 저장 핸들러
  const handleSaveCanvas = (data: CanvasData) => {
    setCanvasData(data);
  };

  // 예약 신청/대기 승인 확정 핸들러
  const handleBookingConfirm = (itemId: ItemId, slot: string, isWaitingList: boolean) => {
    if (!participant) return;

    setBooths((prevBooths) => {
      return prevBooths.map((booth) => {
        if (booth.id !== itemId) return booth;

        const updatedTimeSlots = { ...booth.timeSlots };
        const slotData = { ...updatedTimeSlots[slot] };

        if (isWaitingList) {
          // 대기자 추가
          if (!slotData.waitingTeams.includes(participant.teamNumber)) {
            slotData.waitingTeams = [...slotData.waitingTeams, participant.teamNumber];
          }
        } else {
          // 예약자 추가 (정원 10명 검증은 하위 뷰에서 완료됨)
          if (!slotData.reservedTeams.includes(participant.teamNumber)) {
            slotData.reservedTeams = [...slotData.reservedTeams, participant.teamNumber];
          }
        }

        updatedTimeSlots[slot] = slotData;
        return { ...booth, timeSlots: updatedTimeSlots };
      });
    });

    if (!isWaitingList) {
      // 예약 성공 시, 현재 팀의 해당 시간대 예약 현황에 아이템 이름 등록
      const item = booths.find((b) => b.id === itemId);
      if (item) {
        setCurrentTeamBookings((prev) => ({
          ...prev,
          [slot]: item.name
        }));
      }
    }
  };

  // 예약 데이터 초기화 핸들러
  const handleResetBooths = () => {
    setBooths(JSON.parse(JSON.stringify(INITIAL_BOOTHS)));
    setCurrentTeamBookings({});
  };

  // 레드팀 테스트 추가
  const handleAddRedTeamTest = (test: RedTeamTest) => {
    setRedTeamTests((prev) => [...prev, test]);
  };

  const handleClearRedTeamTests = () => {
    setRedTeamTests([]);
  };

  // 개선 기록장 저장
  const handleSaveImprovement = (data: ImprovementData) => {
    setImprovementData(data);
  };

  // 캠프 완전 초기화 및 리스타트
  const handleRestartCamp = () => {
    setParticipant(null);
    setCanvasData({ ...INITIAL_CANVAS });
    setBooths(JSON.parse(JSON.stringify(INITIAL_BOOTHS)));
    setRedTeamTests([]);
    setImprovementData({
      discoveredIssues: '',
      addedDefenseRules: '',
      finalImprovements: '',
      learningReflection: ''
    });
    setCurrentTeamBookings({});
    setCurrentView('home');
  };

  // 뷰 네비게이터 도우미
  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    // 페이지 최상단으로 스크롤 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 selection:bg-blue-500 selection:text-white" id="main-app-layout">
      {/* Dynamic camp status header forMiddle School Students */}
      {participant && (
        <div className="bg-slate-900 text-white py-2 px-4 text-center text-[11px] font-semibold border-b border-slate-800 flex justify-between items-center px-4 sm:px-6 lg:px-8 print:hidden" id="camp-top-banner">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>임무 수행 중: <strong>{participant.teamNumber} ({participant.nickname} 대원)</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span>설계 에이전트: <strong className="text-yellow-400 font-bold">{canvasData.agentName || '미지정'}</strong></span>
            <span>테스트 차단수: <strong className="text-red-400 font-bold">{redTeamTests.length}회</strong></span>
          </div>
        </div>
      )}

      {/* Navigation step bar */}
      <Navigation
        currentView={currentView}
        onViewChange={navigateTo}
        isParticipantRegistered={participant !== null}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:px-0">
        {currentView === 'home' && (
          <HomeView
            participant={participant}
            onRegister={handleRegisterParticipant}
            onNext={() => navigateTo('canvas')}
          />
        )}

        {currentView === 'canvas' && (
          <CanvasView
            canvasData={canvasData}
            onSave={handleSaveCanvas}
            onPrev={() => navigateTo('home')}
            onNext={() => navigateTo('booking')}
            participant={participant}
          />
        )}

        {currentView === 'booking' && (
          <BookingView
            booths={booths}
            participant={participant}
            canvasData={canvasData}
            onBookingConfirm={handleBookingConfirm}
            onResetBooths={handleResetBooths}
            onPrev={() => navigateTo('canvas')}
            onNext={() => navigateTo('redteam')}
            currentTeamBookings={currentTeamBookings}
          />
        )}

        {currentView === 'redteam' && (
          <RedTeamView
            canvasData={canvasData}
            tests={redTeamTests}
            onAddTest={handleAddRedTeamTest}
            onClearTests={handleClearRedTeamTests}
            onPrev={() => navigateTo('booking')}
            onNext={() => navigateTo('improvement')}
          />
        )}

        {currentView === 'improvement' && (
          <ImprovementView
            improvementData={improvementData}
            onSave={handleSaveImprovement}
            onPrev={() => navigateTo('redteam')}
            onNext={() => navigateTo('presentation')}
            participant={participant}
          />
        )}

        {currentView === 'presentation' && (
          <PresentationView
            canvasData={canvasData}
            improvementData={improvementData}
            participant={participant}
            tests={redTeamTests}
            onPrev={() => navigateTo('improvement')}
            onRestartCamp={handleRestartCamp}
          />
        )}
      </main>

      {/* Floating help brand footer */}
      <footer className="py-6 border-t border-slate-200/40 text-center text-xs text-slate-400 bg-white/50 print:hidden" id="main-footer">
        <p>© 2026 AI Ethics Educational Sandbox. "불공정 리셀러 AI를 타파하자!"</p>
        <p className="mt-1 text-[10px] font-mono text-slate-300">Design paired with Space Grotesk & Inter Typography</p>
      </footer>
    </div>
  );
}
