import React, { useState } from 'react';
import Header from './components/Header';
import EmailInput from './components/EmailInput';
import AnalysisResult from './components/AnalysisResult';
import { analyzeEmail } from './services/geminiService';
import { AnalysisResult as AnalysisResultType, EmailData, AppState } from './types';
import { AlertTriangle, X, Database, Lock, ShieldCheck, EyeOff } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleAnalyze = async (data: EmailData) => {
    setAppState(AppState.ANALYZING);
    setEmailData(data);
    setError(null);
    
    try {
      const analysis = await analyzeEmail(data.subject, data.body);
      setResult(analysis);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setEmailData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header onOpenPrivacy={() => setShowPrivacy(true)} />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Intro Section - Show only when IDLE */}
        {appState === AppState.IDLE && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
              Is that email safe?
            </h2>
            <p className="text-lg text-gray-600">
              Phishing attacks are getting smarter. Use our AI-powered detector to analyze suspicious emails, understand the risks, and learn how to stay safe.
            </p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="w-full transition-all duration-300 ease-in-out">
          {appState === AppState.IDLE && (
             <EmailInput onAnalyze={handleAnalyze} isAnalyzing={false} />
          )}

          {appState === AppState.ANALYZING && emailData && (
             <div className="space-y-8 animate-pulse">
                {/* Skeleton UI for loading */}
                <div className="bg-white h-64 rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-medium text-gray-900">Analyzing Email Content...</h3>
                    <p className="text-gray-500 mt-2">Our AI is checking for social engineering patterns and suspicious indicators.</p>
                </div>
             </div>
          )}

          {appState === AppState.RESULT && result && emailData && (
            <AnalysisResult 
              result={result} 
              emailData={emailData} 
              onReset={handleReset} 
            />
          )}

          {appState === AppState.ERROR && (
             <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center max-w-xl mx-auto">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                   <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Failed</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => emailData && handleAnalyze(emailData)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PhishGuard AI. For educational purposes only. Always verify with official sources.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
             <Database className="w-3 h-3" />
             <span>No database. Your data is not stored.</span>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8 pt-2">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-50 p-2.5 rounded-lg shrink-0">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">No Database</h3>
                  <p className="text-gray-600 leading-relaxed">
                    This application operates on a purely stateless architecture. We do not maintain a database, and we do not store, save, or log your emails.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-purple-50 p-2.5 rounded-lg shrink-0">
                  <EyeOff className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Ephemeral Processing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Email content is sent securely to the AI model for analysis and is immediately discarded after the result is generated.
                  </p>
                </div>
              </div>
            </div>

            <button
               onClick={() => setShowPrivacy(false)}
               className="mt-8 w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg active:transform active:scale-[0.98]"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;