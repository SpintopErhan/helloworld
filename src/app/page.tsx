"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [user, setUser] = useState<AnyType>(null);

  useEffect(() => {
    const init = async () => {
      if (!sdk) return;

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
        await sdk.actions.addMiniApp();

        // ANY YOK – sadece yukarıda bir kere tanımladık
        const contextUser = (sdk.context as AnyType)?.user;

        if (contextUser?.fid) {
          setUser({
            fid: contextUser.fid,
            username: contextUser.username || "anonymous",
            displayName: contextUser.displayName || contextUser.username || "User",
          });
        }
      } catch (err) {
console.error("SDK init error:", err);
      }
    };

    init();
  }, []);

  const handleCast = useCallback(async () => {
    if (!isSDKLoaded) return;

    try {
      const castText = user
        ? `Hello from @${user.username}! (FID: ${user.fid})`
        : "Hello World from Farcaster Miniapp";

      await sdk.actions.composeCast({
        text: castText,
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });
    } catch (err) {
      console.error("Cast error:", err);
    }
  }, [isSDKLoaded, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-md text-center space-y-8">

        {/* Kullanıcı Bilgisi */}
        {user && (
          <div className="bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-3xl shadow-2xl border-4 border-purple-500">
            <p className="text-2xl font-bold">Hoş geldin {user.displayName}!</p>
            <p className="text-lg text-purple-200">@{user.username}</p>
            <p className="text-sm text-purple-300">FID: {user.fid}</p>
          </div>
        )}

        <h1 className="text-4xl font-bold tracking-tighter">Miniapp Demo</h1>

        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
          <p className="mb-8 text-slate-300 text-lg">
            Welcome{user && ` ${user.displayName?.split(" ")[0] || user.username || "there"}!`}
            <br />
            Share this Miniapp with your friends
          </p>

          <button
            onClick={handleCast}
            disabled={!isSDKLoaded}
            className="w-full py-5 px-8 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isSDKLoaded ? "Share on Farcaster" : "Loading..."}
          </button>
        </div>
      </div>
    </main>
  );
}