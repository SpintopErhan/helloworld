"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      if (!sdk) {
        console.warn("Farcaster SDK yüklenemedi.");
        return;
      }

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (err) {
        console.error("SDK ready hatası:", err);
      }
    };

    initSDK();
  }, []);

  // Mevcut cast fonksiyonu (değişmedi)
  const handleCastButton = useCallback(async () => {
    if (!isSDKLoaded) return;

    try {
      const result = await sdk.actions.composeCast({
        text: "Hello World! Farcaster Miniapp'i dene 🚀",
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });

      if (result?.cast) {
        console.log("Cast atıldı! Hash:", result.cast.hash);
      } else {
        console.log("Cast iptal edildi.");
      }
    } catch (err) {
      console.error("ComposeCast hatası:", err);
    }
  }, [isSDKLoaded]);

  // YENİ: Add Miniapp fonksiyonu
  const handleAddButton = useCallback(async () => {
  if (!isSDKLoaded) return;

  try {
    await sdk.actions.addMiniApp();
    console.log("Add Miniapp prompt'u gösterildi.");
  } catch (err) {
    // BU SATIR EKLE → TypeScript sustu!
    const error = err as { message?: string };

    if (error.message === "RejectedByUser") {
      console.log("Kullanıcı app eklemeyi reddetti.");
    } else if (error.message === "InvalidDomainManifestJson") {
      console.error("Manifest/domain hatası – production domain kullanın.");
      alert("App ekleme hatası: Manifest/domain eşleşmiyor.");
    } else {
      console.error("Add Miniapp hatası:", error);
    }
  }
}, [isSDKLoaded]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tighter">
          Miniapp Demo
        </h1>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 space-y-4">
          <p className="mb-6 text-slate-300">
            Farcaster'da paylaş ve app'i ekle!
          </p>

          {/* Cast Butonu (mevcut) */}
          <button
            onClick={handleCastButton}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold rounded-xl transition-all transform active:scale-95 text-lg"
            disabled={!isSDKLoaded}
          >
            📢 "Hello World" Cast At 
          </button>

          {/* YENİ: Add Miniapp Butonu */}
          <button
            onClick={handleAddButton}
            className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-xl transition-all transform active:scale-95 text-lg"
            disabled={!isSDKLoaded}
          >
            ⭐ App'i Ekle (Apps Listesine)
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