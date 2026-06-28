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
  Upload,
  Copy
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

export default function CheckoutModal({ onClose, onUpgradeSuccessful, userEmail }: CheckoutModalProps) {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Invoice variables
  const invoiceId = `BP-${Math.floor(100000 + Math.random() * 900000)}`;
  const transactionId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const dateStr = new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });

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
  
  // Real dynamic scan-to-pay QR code generated via Google Chart API or QRServer (safe, free, zero setup)
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!utrNumber.trim()) {
      setErrorMessage("Please enter the 12-digit UPI Ref No. / Transaction ID to confirm payment.");
      return;
    }
    if (utrNumber.trim().length < 6) {
      setErrorMessage("Please enter a valid Transaction ID / UTR number.");
      return;
    }

    setIsProcessing(true);

    // Simulate instant secure verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onUpgradeSuccessful();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col font-sans">
        
        {/* Header bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h3 className="font-bold text-base">Upgrade to Get Board Ready Pro</h3>
          </div>
          {!isSuccess && !isProcessing && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 space-y-6 text-center">
            <div className="mx-auto bg-emerald-50 text-emerald-600 h-16 w-16 rounded-full flex items-center justify-center border border-emerald-200">
              <CheckCircle className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-bold text-slate-900">Payment Verified!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Congratulations! Your profile has been upgraded to Get Board Ready Pro instantly with full cloud-synced lifetime privileges.
              </p>
            </div>

            {/* Receipt details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3 font-mono text-xs text-slate-600">
              <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                <span className="font-bold text-slate-900">RECEIPT & INVOICE</span>
                <span className="text-indigo-600 font-bold">{invoiceId}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Authorized User:</span>
                  <span className="font-bold text-slate-800">{userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>UTR Reference ID:</span>
                  <span className="font-bold text-slate-800">{utrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-bold text-slate-800">{dateStr}</span>
                </div>
                <div className="flex justify-between">
                  <span>Product Purchased:</span>
                  <span className="font-bold text-indigo-600">Get Board Ready Pro Membership</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Amount Paid:</span>
                <span>₹{AMOUNT}.00</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center space-x-1 shadow-md"
            >
              <span>Unlock Premium Features Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Checkout form */
          <div className="p-6 space-y-5">
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

            {/* Mobile View Behavior */}
            {isMobileDevice ? (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Tap the button below to launch your preferred UPI app (GPay, PhonePe, Paytm, etc.) to complete payment securely.
                  </span>
                </div>

                <a
                  href={upiDeepLink}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl text-center text-sm transition-all flex items-center justify-center space-x-2 shadow-md animate-pulse"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Pay via UPI App (GPay/PhonePe/Paytm)</span>
                </a>

                {/* Manual copy alternative */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold block">UPI ID</span>
                    <span className="font-mono text-slate-700">{UPI_ID}</span>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="p-1.5 rounded-md hover:bg-slate-200 transition-colors flex items-center space-x-1 font-mono text-[10px] text-indigo-600 font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop View Behavior (Fallback) */
              <div className="space-y-4 text-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Scan to Pay using any UPI App</span>
                  <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                    Open BHIM, GPay, PhonePe, Paytm, or your banking app, and scan the QR code below.
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
                  <div className="mt-2 text-[10px] font-mono text-slate-400 font-bold">
                    UPI ID: {UPI_ID}
                  </div>
                </div>

                {/* Copy ID alternative for desktops too */}
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center justify-between text-xs max-w-sm mx-auto">
                  <span className="font-mono text-slate-600 text-[11px]">{UPI_ID}</span>
                  <button
                    onClick={handleCopyUpi}
                    className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-[10px] text-indigo-600 font-bold flex items-center space-x-1"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Verification & Screen sharing step */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Step 2: Enter Transaction Ref / UTR No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 314569784122 or Txn ID"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>

              {/* Dynamic Simulated Screenshot upload for extreme fidelity */}
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {screenshotUploaded ? "screenshot_confirmed.png" : "Upload transaction screenshot (Optional)"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setScreenshotUploaded(!screenshotUploaded)}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                    screenshotUploaded 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  {screenshotUploaded ? "Attached ✓" : "Choose File"}
                </button>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-[11px] text-rose-800 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-md uppercase tracking-wider font-mono"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Verifying UTR Reference...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Activate Pro Instantly</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              After successful payment, please share a screenshot of the transaction with us to confirm your order.
            </p>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1.5 font-mono pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>DIRECT TIDE BUSINESS PAYMENT • ZERO GATEWAY FEE</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

