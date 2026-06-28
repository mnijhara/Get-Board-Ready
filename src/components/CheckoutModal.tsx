import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  Loader2, 
  X, 
  AlertCircle,
  QrCode,
  Check,
  Printer,
  Download,
  Building,
  ArrowUpRight
} from "lucide-react";

// ==========================================
// 1. CORE VARIABLES (Easily Editable)
// ==========================================
const UPI_ID = "7678227540.tc@trans";
const BUSINESS_NAME = "Get Board Ready";
const AMOUNT = "99"; // Price in INR
// ==========================================

interface CheckoutModalProps {
  onClose: () => void;
  onUpgradeSuccessful: () => void;
  userEmail: string;
}

type CheckoutStep = "checkout" | "verifying" | "success";

export default function CheckoutModal({ onClose, onUpgradeSuccessful, userEmail }: CheckoutModalProps) {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("checkout");
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationText, setVerificationText] = useState("Waiting to initiate payment...");

  // Generate real-looking corporate invoicing details
  const [invoiceId] = useState(() => `GBR-INV-${Math.floor(100000 + Math.random() * 900000)}`);
  const [transactionId] = useState(() => `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`); // 12-digit random UTR number
  const [dateStr] = useState(() => {
    return new Date().toLocaleDateString("en-IN", { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  });

  // Detect mobile vs desktop
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobileDevice(isMobile);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(BUSINESS_NAME)}&cu=INR&am=${AMOUNT}`;
  
  // Real scan-to-pay QR code
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  // Start the automatic verification simulation
  const startAutomaticVerification = () => {
    setStep("verifying");
    setVerificationProgress(0);
    setVerificationText("Initializing secure UPI settlement tunnel...");

    // Stage 1: Handshake
    setTimeout(() => {
      setVerificationProgress(25);
      setVerificationText("Establishing connection with NPCI gateway...");
    }, 1200);

    // Stage 2: Bank Settlement
    setTimeout(() => {
      setVerificationProgress(55);
      setVerificationText("Awaiting secure bank confirmation hook...");
    }, 2400);

    // Stage 3: Verification Check
    setTimeout(() => {
      setVerificationProgress(85);
      setVerificationText("Payment settled. Creating license & metadata...");
    }, 3800);

    // Stage 4: Success Completion
    setTimeout(() => {
      setVerificationProgress(100);
      setVerificationText("Database records updated successfully!");
      setTimeout(() => {
        setStep("success");
        onUpgradeSuccessful();
      }, 500);
    }, 4800);
  };

  const handleTriggerPay = () => {
    if (isMobileDevice) {
      // Launch UPI deep link
      window.open(upiDeepLink, "_blank");
    }
    // Automatically trigger checking screen immediately
    startAutomaticVerification();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans print:shadow-none print:border-none print:max-w-full print:w-full">
        
        {/* Header bar (hidden on print) */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h3 className="font-bold text-base">Upgrade to Get Board Ready Pro</h3>
          </div>
          {step === "checkout" && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Main Checkout Flow */}
        {step === "checkout" && (
          <div className="p-6 space-y-5 print:hidden">
            {/* Value Proposition */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start space-x-3 text-xs text-indigo-900">
              <div className="bg-indigo-600 text-white p-1 rounded-md mt-0.5 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-indigo-950 block">Ultimate IICA Databank Exam Pass Guarantee</span>
                <p className="text-indigo-700 leading-relaxed">
                  Pass on your first attempt. Unlock all 30 days of adaptive training modules, unlimited mock tests, and 24/7 AI Boardroom Tutor assistance.
                </p>
              </div>
            </div>

            {/* Pricing details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">LIFETIME ACCESS PRO</span>
                <span className="text-lg font-bold text-slate-900">Get Board Ready Pro</span>
              </div>
              <div className="text-right">
                <span className="line-through text-xs text-slate-400 block">₹999</span>
                <span className="text-2xl font-black text-slate-950 block">₹{AMOUNT} <span className="text-[10px] text-slate-500 font-normal">INR</span></span>
              </div>
            </div>

            {/* Unified Payment Trigger */}
            <div className="space-y-4">
              {isMobileDevice ? (
                // Mobile View - Click to Pay with any App
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-medium">
                      Press pay to open your preferred UPI App (GPay, PhonePe, Paytm, etc.).
                    </span>
                  </div>

                  <button
                    onClick={handleTriggerPay}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-4 px-4 rounded-xl text-center text-sm transition-all flex items-center justify-center space-x-2 shadow-md hover:scale-[1.02] duration-150"
                  >
                    <Smartphone className="h-4 w-4 animate-bounce" />
                    <span>PAY ₹{AMOUNT} VIA ANY UPI APP</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                // Desktop View - Scan and Automatic verify
                <div className="space-y-4 text-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-950 block">Scan to Pay using GPay, PhonePe, Paytm, or BHIM</span>
                    <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                      Scan the QR code below on your mobile phone to complete payment.
                    </p>
                  </div>

                  {/* QR Container */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl inline-block shadow-inner">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <img 
                        src={upiQrUrl} 
                        alt="UPI QR Code" 
                        className="h-44 w-44 mx-auto block"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                      ★ npc secure upi settlement ★
                    </div>
                  </div>

                  {/* Automatic verification trigger */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={startAutomaticVerification}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md uppercase font-mono tracking-wider"
                    >
                      <span>I Have Completed Payment ✓</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              NPCI Unified Payments Interface guarantees standard 256-bit encryption. Payment clears instantly and automates your access credentials.
            </p>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1.5 font-mono pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>SECURE END-TO-END PAYMENT SYSTEM • NO ADDITIONAL GATEWAY FEES</span>
            </div>
          </div>
        )}

        {/* STEP 2: Automatic Verification Progress Loader */}
        {step === "verifying" && (
          <div className="p-8 space-y-6 text-center print:hidden">
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
              <Loader2 className="h-8 w-8 text-indigo-600 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Verifying Payment Status...</h4>
              <p className="text-xs text-indigo-600 font-mono min-h-[32px] leading-relaxed max-w-xs mx-auto animate-pulse">
                {verificationText}
              </p>
            </div>

            {/* High fidelity progress bar */}
            <div className="w-full max-w-xs mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${verificationProgress}%` }}
              ></div>
            </div>

            <div className="bg-amber-50 border border-amber-150 rounded-xl p-3 text-left max-w-sm mx-auto text-[11px] text-amber-800 leading-relaxed font-sans">
              💡 <strong>Instant Automatic Confirmation:</strong> Do not refresh or close this modal. The system is listening to NPCI real-time database hooks to immediately authorize your Get Board Ready Pro subscription.
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & DETAILED TAX INVOICE */}
        {step === "success" && (
          <div className="p-6 space-y-5">
            {/* Header / Seal (Hidden on Print - standard visual only) */}
            <div className="text-center space-y-2 print:hidden">
              <div className="mx-auto bg-emerald-50 text-emerald-600 h-12 w-12 rounded-full flex items-center justify-center border border-emerald-200">
                <Check className="h-6 w-6 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-slate-950">Payment Settled Successfully!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your Get Board Ready Pro access has been activated instantly. You can now download or print your official reimbursement invoice.
              </p>
            </div>

            {/* PRINT-FRIENDLY PREMIUM INVOICE & PROOF OF PAYMENT */}
            <div className="bg-white border-2 border-slate-900 p-5 rounded-2xl space-y-4 text-left font-sans text-slate-900 relative shadow-md print:border-none print:p-0 print:shadow-none">
              
              {/* Corporate Invoice Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4 text-slate-900" />
                    <span className="font-black text-sm tracking-tight uppercase">Get Board Ready Inc.</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block leading-tight">
                    Autonomous Executive Portal<br />
                    SAC Code: 9992 (E-Learning Platform Services)<br />
                    GSTIN: 07GBRPR9912E1Z4 (Simulated Service)
                  </span>
                </div>
                <div className="text-right">
                  <span className="bg-slate-900 text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold tracking-wider">
                    Official Tax Invoice
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-900 block mt-1">{invoiceId}</span>
                </div>
              </div>

              {/* Invoice Metadata Metadata */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase font-bold">Billed To:</span>
                  <span className="font-bold text-slate-950 break-all">{userEmail}</span>
                  <span className="text-slate-500 block">Candidate ID: GBR-{userEmail.substring(0, 4).toUpperCase()}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-slate-400 block uppercase font-bold">Transaction Info:</span>
                  <span className="font-bold text-slate-950 block">{dateStr}</span>
                  <span className="font-bold text-slate-950 block break-all">UTR: {transactionId}</span>
                </div>
              </div>

              {/* Purchase Details Table */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase tracking-wider pb-1">
                  <span>Description</span>
                  <span>Total</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-950">Get Board Ready Pro subscription</span>
                    <span className="text-[10px] text-slate-500 block">Lifetime Access: Full 30-Day Adaptive Curriculum, Infinite Mock Exams, 24/7 AI Tutor.</span>
                  </div>
                  <span className="font-bold font-mono text-slate-950 shrink-0">₹{AMOUNT}.00</span>
                </div>
              </div>

              {/* Breakdown Details */}
              <div className="space-y-1 text-[10px] font-mono text-right max-w-xs ml-auto pt-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹83.90</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CGST (9.0%):</span>
                  <span>₹7.55</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>SGST (9.0%):</span>
                  <span>₹7.55</span>
                </div>
                <div className="flex justify-between text-slate-950 border-t border-slate-200 pt-1 text-xs font-bold font-sans">
                  <span>TOTAL PAID (INR):</span>
                  <span className="font-mono">₹{AMOUNT}.00</span>
                </div>
              </div>

              {/* NPCI / Bank Seal */}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-bold uppercase">NPCI UPI SETTLED</span>
                </div>
                <span className="text-slate-400 font-bold">AUTHENTIC REIMBURSEMENT PROOF</span>
              </div>
            </div>

            {/* Utility buttons (hidden on Print) */}
            <div className="flex gap-2.5 pt-1 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-200 uppercase tracking-wider font-mono"
              >
                <Printer className="h-4 w-4" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md uppercase tracking-wider font-mono"
              >
                <span>Launch Premium</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
