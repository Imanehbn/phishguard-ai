import React, { useState } from 'react';
import { Mail, FileText, Search, AlertCircle } from 'lucide-react';
import { EmailData } from '../types';

interface EmailInputProps {
  onAnalyze: (data: EmailData) => void;
  isAnalyzing: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && body.trim()) {
      onAnalyze({ subject, body });
    }
  };

  const loadExample = () => {
    setSubject("URGENT: Verify your account immediately");
    setBody(`Dear Valued Customer,

We noticed unusual activity on your bank account ending in 4432. For your security, we have temporarily suspended your access.

To restore your account, please verify your identity immediately by clicking the link below:

http://secure-bank-verify-login.com/auth?id=8293

Failure to verify within 24 hours will result in permanent account closure.

Sincerely,
Security Team`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Analyze Email
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Paste the subject and body of a suspicious email below. 
          <button 
            type="button" 
            onClick={loadExample} 
            className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium text-xs transition-colors"
          >
            Try an example
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Subject Line
            </span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g., URGENT: Action Required"
            required
            disabled={isAnalyzing}
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Email Body
            </span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none font-mono text-sm"
            placeholder="Paste the full content of the email here..."
            required
            disabled={isAnalyzing}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="w-3 h-3" />
            <span>Your data is processed privately and not stored.</span>
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !subject || !body}
            className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-sm transition-all
              ${isAnalyzing || !subject || !body
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
              }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Email'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailInput;