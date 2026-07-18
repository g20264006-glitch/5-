/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Participant {
  teamNumber: string;
  nickname: string;
}

export interface CanvasData {
  agentName: string;
  issueToSolve: string;
  agentGoal: string;
  inputInfo: string;
  forbiddenActions: string;
  humanVerificationMoments: string;
  privacyRules: string;
  fairnessRules: string;
}

export type ItemId = 'sneakers' | 'shoes' | 'hat' | 'tshirt';

export interface TimeSlotData {
  time: string;
  reservedTeams: string[]; // 예약한 팀 번호 리스트 (최대 10명)
  waitingTeams: string[];  // 대기자 리스트
}

export interface ItemBooth {
  id: ItemId;
  name: string;
  emoji: string;
  color: string;
  description: string;
  timeSlots: { [slot: string]: TimeSlotData };
}

export interface RedTeamTest {
  id: string;
  prompt: string;
  aiResponse: string;
  defenseRuleUsed: string;
  isBlocked: boolean;
  timestamp: string;
}

export interface ImprovementData {
  discoveredIssues: string;
  addedDefenseRules: string;
  finalImprovements: string;
  learningReflection: string;
}

export type ViewType = 'home' | 'canvas' | 'booking' | 'redteam' | 'improvement' | 'presentation';
