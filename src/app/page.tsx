"use client";

import { useEffect, useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // 1. SDK'yı Başlat (Initialize)
  useEffect(() => {
    const load = async () => {
      // SDK'ya uygulamanın hazır olduğunu bildir
      sdk.actions.ready(); 
      setIsSDKLoaded(true);
    };
    
    // Sadece istemci tarafında çalıştır
    if (sdk && !isSDKLoaded) {
      load();
    }
  }, [isSDKLoaded]);

  const handleCastButton = useCallback(() => {
    
    // Farcaster Compose Intent URL'si
    const castUrl = "https://farcaster.xyz/~/compose?text=Hello%20World"; 
    
    // Warpcast penceresini açar.
    sdk.actions.openUrl(castUrl);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-6">
        
        <h1 className="text-3xl font-bold tracking-tighter">
          Miniapp Demo
        </h1>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <p className="mb-6 text-slate-300">
            Aşağıdaki butona basarak Farcaster'da bir selam gönder!
          </p>

          <button
            onClick={handleCastButton}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold rounded-xl transition-all transform active:scale-95 text-lg"
          >
            {/* Hata veren metin kaldırıldı. */}
          </button>
        </div>

        {!isSDKLoaded && (
          <p className="text-xs text-gray-500 animate-pulse">
            Farcaster Bağlantısı Bekleniyor...
          </p>
        )}
        
      </div>
    </main>
  );
}