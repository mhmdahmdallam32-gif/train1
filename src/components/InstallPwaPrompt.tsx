import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for iOS/Safari or desktop
      alert('لتثبيت التطبيق على جهازك:\n- على آيفون/سفاري: اضغط زر المشاركة (Share) ثم "إضافة إلى الشاشة الرئيسية"\n- على كروم/أندرويد: اضغط الثلاث نقاط أعلى المتصفح ثم "تثبيت التطبيق"');
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="pwa-install-banner"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 bg-slate-900/95 border border-sky-500/50 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3"
        dir="rtl"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">تثبيت قطار الأعداد PWA</h4>
            <p className="text-[11px] text-slate-400 truncate">يعمل بدون إنترنت مثل تطبيق الهاتف الحقيقي</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="pwa-install-now-btn"
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت</span>
          </button>

          <button
            id="pwa-dismiss-banner-btn"
            onClick={() => setShowBanner(false)}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
