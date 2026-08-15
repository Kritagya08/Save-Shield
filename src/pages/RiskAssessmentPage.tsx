import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useEmergencyStore } from '../stores/emergencyStore';

// Mock risk assessment service
const assessRisk = (isActive: boolean) => {
  if (!isActive) return { level: 'LOW', score: 15, factors: [
    { id: 1, name: 'Active Emergency', description: 'Currently active SOS', weight: 80, active: false },
    { id: 2, name: 'Late Time', description: 'After 10 PM', weight: 20, active: false },
    { id: 3, name: 'Location Deviance', description: 'Unusual location detected', weight: 40, active: false }
  ]};
  return { level: 'HIGH', score: 85, factors: [
    { id: 1, name: 'Active Emergency', description: 'Currently active SOS', weight: 80, active: true },
    { id: 2, name: 'Late Time', description: 'After 10 PM', weight: 20, active: false },
    { id: 3, name: 'Location Deviance', description: 'Unusual location detected', weight: 40, active: false }
  ]};
};

export default function RiskAssessmentPage() {
  const { activeEmergency, systemStatus } = useEmergencyStore();
  const isActive = systemStatus.emergencyActive || !!activeEmergency;
  const [assessment, setAssessment] = useState(assessRisk(isActive));

  useEffect(() => {
    setAssessment(assessRisk(isActive));
  }, [isActive]);

  const getColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500';
      case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">Risk Assessment</h1>
      
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg flex items-start gap-3">
        <Info className="text-amber-500 mt-1 flex-shrink-0" size={20} />
        <p className="text-amber-200/90 text-sm">
          This is a prototype rule-based assessment and not a guaranteed prediction of danger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-8 rounded-xl border flex flex-col items-center justify-center text-center space-y-4 ${getColor(assessment.level)}`}>
          <h2 className="text-xl font-medium opacity-80 uppercase tracking-wider">Current Risk Level</h2>
          <div className="text-6xl font-black">{assessment.level}</div>
          <div className="text-2xl font-bold opacity-90">Score: {assessment.score}/100</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Risk Factors</h3>
          <div className="space-y-4">
            {assessment.factors.map(factor => (
              <div key={factor.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                {factor.active ? (
                  <CheckCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                ) : (
                  <XCircle className="text-slate-500 mt-0.5 flex-shrink-0" size={20} />
                )}
                <div>
                  <div className="font-medium text-slate-200 flex items-center gap-2">
                    {factor.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Weight: {factor.weight}</span>
                  </div>
                  <div className="text-sm text-slate-400">{factor.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
