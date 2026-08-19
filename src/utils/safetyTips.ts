import type { RiskLevel, CommunicationMode } from '../types';

export interface SafetyTip {
  id: string;
  category: 'offline' | 'high_risk' | 'general' | 'location';
  title: string;
  advice: string;
  priority: number; // 1 = Highest
}

const SAFETY_TIPS_DATABASE: SafetyTip[] = [
  {
    id: 'tip-1',
    category: 'high_risk',
    title: 'Move to a Well-Lit Public Space',
    advice: 'If safe to do so, move toward open, populated areas or well-lit storefronts while emergency alerts are active.',
    priority: 1,
  },
  {
    id: 'tip-2',
    category: 'offline',
    title: 'Keep Bluetooth & Location ON',
    advice: 'Maintain active Bluetooth and Location services so nearby Save Shield relay nodes can detect and forward your SOS packet.',
    priority: 1,
  },
  {
    id: 'tip-3',
    category: 'offline',
    title: 'Conserve Battery Life',
    advice: 'Reduce screen brightness and close background apps. Save Shield mesh relay requires minimal energy to broadcast.',
    priority: 2,
  },
  {
    id: 'tip-4',
    category: 'high_risk',
    title: 'Stay on the Move If Trailed',
    advice: 'Avoid stopping in isolated alleys. Stay on major roads where traffic or pedestrians are present.',
    priority: 1,
  },
  {
    id: 'tip-5',
    category: 'location',
    title: 'Share Exact Landmarks',
    advice: 'If speaking with emergency personnel or trusted contacts, mention prominent nearby signs or building numbers.',
    priority: 2,
  },
  {
    id: 'tip-6',
    category: 'general',
    title: 'Keep Primary Contacts Updated',
    advice: 'Ensure your primary contact list has updated phone numbers and relationships configured in Save Shield.',
    priority: 3,
  },
];

/**
 * Returns contextual safety tips based on active risk level and communication mode
 */
export function getContextualSafetyTips(riskLevel: RiskLevel, mode: CommunicationMode): SafetyTip[] {
  return SAFETY_TIPS_DATABASE.filter(tip => {
    if (riskLevel === 'high' && tip.category === 'high_risk') return true;
    if ((mode === 'offline' || mode === 'relay') && tip.category === 'offline') return true;
    if (tip.category === 'location' || tip.category === 'general') return true;
    return false;
  }).sort((a, b) => a.priority - b.priority);
}
