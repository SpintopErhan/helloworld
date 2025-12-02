"use client";

import { useEffect, useState, useCallback } from "react";
// Hata veren 'import { sdk } from "@farcaster/miniapp-sdk";' satırı kaldırıldı.

// Farcaster istemcisi tarafından global olarak eklenen SDK nesnesinin tipini tanımla
// TypeScript'in 'window' üzerinde FarcasterMiniAppSDK'yı tanımasını sağlarız.
declare global {
  interface Window {
    FarcasterMiniAppSDK?: {
      actions: {
        ready: () => Promise<void>;
        addMiniApp: () => Promise<void>;
        composeCast: (params: { text: string; embeds: string[] }) => Promise<{ cast: { hash: string } } | null>;
      };
      getMiniAppContext: () => Promise<{
        viewerFarcasterId: {
          fid: number;
          username: string;
          displayName: string;
        } | null;
        // Diğer context alanları...
      } | null>;
      // Diğer SDK alanları...
    };
  }
}

// SDK'ya güvenli erişim için yardımcı fonksiyon
const getSdk = () => {
  if (typeof window !== 'undefined' && window.FarcasterMiniAppSDK) {
    return window.FarcasterMiniAppSDK;
  }
  return null;
};


// Kullanıcı bilgilerini tutmak için basit bir arayüz
interface UserInfo {
  fid: number;
  username: string;
  displayName: string;
}

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // SDK'yı başlatır, hazır olduğunu bildirir ve kullanıcı bağlamını (context) alır.
  useEffect(() => {
    const init = async () => {
      const sdk = getSdk();
      if (!sdk) {
        console.error("Farcaster MiniApp SDK globalde bulunamadı. Farcaster istemcisinde çalıştırıldığından emin olun.");
        // SDK bulunamazsa yüklenme durumunda kalır
        return; 
      }

      try {
        // SDK'nın Farcaster istemcisine hazır olduğunu bildir
        await sdk.actions.ready();
        setIsSDKLoaded(true);

        // Kullanıcının bağlamını al (FID, kullanıcı adı vb.)
        const context = await sdk.getMiniAppContext();
        
        console.log("MiniApp Context:", context);

        if (context?.viewerFarcasterId) {
          // Kullanıcı bilgileri mevcutsa state'e kaydet
          setUserInfo({
            fid: context.viewerFarcasterId.fid,
            username: context.viewerFarcasterId.username,
            displayName: context.viewerFarcasterId.displayName,
          });
        }

        // MiniApp'i otomatik olarak ekleme isteği gönder (zaten eklenmediyse)
        await sdk.actions.addMiniApp();
        console.log("addMiniApp called – prompt shown if not added yet");

      } catch (err) {
        console.error("SDK init or context error:", err);
      }
    };

    init();
  }, []);

  // Yeni Cast oluşturma işlemi
  const handleCast = useCallback(async () => {
    if (!isSDKLoaded) return;
    
    const sdk = getSdk();
    if (!sdk) return; // SDK yoksa işlemi durdur

    // Kullanıcının adını cast mesajına ekleyelim
    const userGreeting = userInfo 
      ? `Hello World from Miniapp! 👋 I'm @${userInfo.username} (FID: ${userInfo.fid})`
      : "Hello World from Miniapp";

    try {
      const result = await sdk.actions.composeCast({
        text: userGreeting,
        embeds: ["https://helloworld-six-omega.vercel.app"], // Kendi uygulamanızın URL'sini kullanın
      });

      if (result?.cast) {
        console.log("Cast sent:", result.cast.hash);
      }
    } catch (err) {
      console.error("Cast error:", err);
    }
  }, [isSDKLoaded, userInfo]);

  // Kullanıcı bilgisini gösteren yardımcı bir bileşen
  const UserInfoCard = () => {
    if (!userInfo) {
      return (
        <p className="text-lg text-slate-400">
          Kullanıcı bilgisi alınıyor veya mevcut değil.
        </p>
      );
    }

    return (
      <div className="text-left space-y-3 pt-4 border-t border-slate-700 mt-6">
        <h2 className="text-2xl font-semibold text-purple-400">
          Merhaba, {userInfo.displayName}!
        </h2>
        
        <p className="text-slate-300">
          <span className="font-medium text-slate-200">Kullanıcı Adı:</span> @{userInfo.username}
        </p>
        <p className="text-slate-300">
          <span className="font-medium text-slate-200">Farcaster ID (FID):</span> {userInfo.fid}
        </p>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4 font-sans">
      <div className="w-full max-w-md text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Farcaster Miniapp - Context
        </h1>

        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-purple-800/50">
          <p className="mb-8 text-slate-300 text-lg">
            Uygulamayı çalıştıran Farcaster kullanıcısının bilgilerini başarıyla aldık.
          </p>

          <UserInfoCard />
          
          <button
            onClick={handleCast}
            disabled={!isSDKLoaded}
            className="w-full mt-8 py-4 px-8 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/50"
          >
            {isSDKLoaded ? "Cast Oluştur ve Paylaş" : "Yükleniyor..."}
          </button>
        </div>

        {!isSDKLoaded && (
          <p className="text-sm text-slate-500 animate-pulse">
            Farcaster'a bağlanılıyor...
          </p>
        )}
      </div>
    </main>
  );
}