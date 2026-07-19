import React, { useRef } from "react";
import { Award, Download, X } from "lucide-react";
import { UserProfile } from "../types";

interface CertificateProps {
  profile: UserProfile;
  onClose: () => void;
}

export default function Certificate({ profile, onClose }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const completedCount = profile.completedDays.length;
  const avgScore = Object.values(profile.progress)
    .map(p => p.score || 0)
    .reduce((a, b) => a + b, 0) / Math.max(completedCount, 1);

  const completionDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });

  const handleDownload = () => {
    if (!certRef.current) return;
    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Get Board Ready — Certificate of Completion</title>
          <style>
            body { margin: 0; font-family: Georgia, serif; }
            .cert { width: 1000px; margin: 0 auto; padding: 60px; border: 8px double #4F46E5; text-align: center; }
            .logo { font-size: 14px; color: #6B7280; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; }
            .title { font-size: 48px; color: #1E293B; font-weight: bold; margin: 20px 0; }
            .subtitle { font-size: 18px; color: #6B7280; margin: 10px 0 40px; }
            .name { font-size: 40px; color: #4F46E5; font-style: italic; margin: 30px 0; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; display: inline-block; }
            .body { font-size: 16px; color: #374151; line-height: 1.8; margin: 20px 0; }
            .stats { display: flex; justify-content: center; gap: 60px; margin: 40px 0; }
            .stat { text-align: center; }
            .stat-val { font-size: 28px; font-weight: bold; color: #4F46E5; }
            .stat-label { font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 2px; }
            .footer { margin-top: 60px; font-size: 12px; color: #9CA3AF; }
            .seal { font-size: 60px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="logo">Get Board Ready</div>
            <div class="seal">🏛️</div>
            <div class="title">Certificate of Completion</div>
            <div class="subtitle">IICA Independent Director Exam Preparation Programme</div>
            <div class="body">This is to certify that</div>
            <div class="name">${profile.name}</div>
            <div class="body">
              has successfully completed the <strong>30-Day AI-Powered IICA Independent Director</strong><br/>
              Exam Preparation Programme on the Get Board Ready platform.<br/><br/>
              Professional Background: <strong>${profile.profession || "Senior Executive"}</strong>
            </div>
            <div class="stats">
              <div class="stat">
                <div class="stat-val">${completedCount}/30</div>
                <div class="stat-label">Days Completed</div>
              </div>
              <div class="stat">
                <div class="stat-val">${Math.round(avgScore)}%</div>
                <div class="stat-label">Avg Quiz Score</div>
              </div>
              <div class="stat">
                <div class="stat-val">${profile.longestStreak || 0}</div>
                <div class="stat-label">Day Streak</div>
              </div>
            </div>
            <div class="body">Date of Completion: <strong>${completionDate}</strong></div>
            <div class="footer">
              Issued by Get Board Ready • getboardready.online<br/>
              This certificate validates completion of AI-powered exam preparation. 
              It does not constitute an official IICA certification.
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full font-sans overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-amber-300" />
            <span className="font-bold text-base">Certificate of Completion</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Certificate Preview */}
        <div ref={certRef} className="p-8 text-center border-4 border-double border-indigo-200 m-4 rounded-xl bg-gradient-to-b from-indigo-50 to-white">
          <div className="text-3xl mb-2">🏛️</div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Get Board Ready</div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Certificate of Completion</h2>
          <p className="text-xs text-slate-500 mb-4">IICA Independent Director Exam Preparation</p>
          
          <p className="text-sm text-slate-600 mb-2">This certifies that</p>
          <p className="text-2xl font-bold text-indigo-600 italic mb-1">{profile.name}</p>
          <p className="text-xs text-slate-500 mb-4">{profile.profession || "Senior Executive"}</p>
          
          <p className="text-xs text-slate-600 mb-4">
            has completed the 30-Day AI-Powered IICA Independent Director<br/>
            Exam Preparation Programme
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <div className="text-lg font-bold text-indigo-600">{completedCount}/30</div>
              <div className="text-[10px] text-slate-400 uppercase">Days</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <div className="text-lg font-bold text-indigo-600">{Math.round(avgScore)}%</div>
              <div className="text-[10px] text-slate-400 uppercase">Avg Score</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-indigo-100">
              <div className="text-lg font-bold text-orange-500">{profile.longestStreak || 0}🔥</div>
              <div className="text-[10px] text-slate-400 uppercase">Streak</div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400">{completionDate} • getboardready.online</p>
        </div>

        {/* Download Button */}
        <div className="p-4 pt-0">
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Certificate (PDF)</span>
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-2">Opens print dialog — save as PDF</p>
        </div>
      </div>
    </div>
  );
}
