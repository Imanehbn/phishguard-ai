import React from 'react';
import { AnalysisResult as AnalysisResultType, EmailData } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw, CheckCircle, ChevronRight, Activity } from 'lucide-react';

interface Props {
  result: AnalysisResultType | null; // Allow null to be safe
  emailData: EmailData;
  onReset: () => void;
}

const AnalysisResult: React.FC<Props> = ({ result, onReset }) => {
  // 1. SAFETY CHECK: If result is null/undefined for any reason, show loading or error
  if (!result) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error: No result data available.</p>
        <button onClick={onReset} className="mt-4 text-blue-600 underline">Try Again</button>
      </div>
    );
  }

  // 2. Safe access to properties using || to provide defaults
  const isSafe = result.isSafe;
  const score = result.riskScore || 0;
  const level = result.riskLevel || 'UNKNOWN';
  
  // 3. Ensure these are always arrays to prevent map() crashes
  const indicators = Array.isArray(result.indicators) ? result.indicators : [];
  const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];

  const colorClass = isSafe ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
  const Icon = isSafe ? ShieldCheck : ShieldAlert;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Card */}
      <div className={`rounded-xl border p-6 ${colorClass} shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full bg-white shadow-sm`}>
            <Icon className={`w-10 h-10 ${isSafe ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {isSafe ? 'Likely Safe' : 'Suspicious Detected'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-4 h-4" />
              <p className="text-lg opacity-90 font-medium">
                Risk Level: {level} ({score}/100)
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-base opacity-90 leading-relaxed border-t border-black/10 pt-4">
          {result.summary || "No summary provided."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Indicators Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Detection Indicators
          </h3>
          {indicators.length > 0 ? (
            <ul className="space-y-3">
              {indicators.map((indicator, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-600 text-sm">
                  <span className="mt-1 block min-w-[6px] h-1.5 rounded-full bg-amber-500" />
                  {indicator}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">No specific indicators found.</p>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Recommended Actions
          </h3>
          {recommendations.length > 0 ? (
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-600 text-sm">
                  <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">No specific recommendations.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Analyze Another Email
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;