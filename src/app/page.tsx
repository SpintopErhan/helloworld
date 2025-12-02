"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      if (!sdk) return;

      try {
        await sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (err) {
        console.error("SDK ready error:", err);
      }
    };

    initSDK();
  }, []);

  const handleCastButton = useCallback(async () => {
    if (!isSDKLoaded) return;

    try {
      const result = await sdk.actions.composeCast({
        text: "Hello World from Farcaster Miniapp",
        embeds: ["https://helloworld-six-omega.vercel.app"],
      });

     if (result?.cast) {
  console.log("Cast sent! Hash:", result.cast.hash);
} else {
  console.log("Cast cancelled");
}
    } catch (err) {
      console.error("composeCast error:", err);
    }
  }, [isSDKLoaded]);

  const handleAddButton = useCallback(async () => {
    if (!isSDKLoaded) return;

    try {
      await sdk.actions.addMiniApp();
      console.log("Add Miniapp prompt shown");
    } catch (err) {
      const error = err as { message?: string };
      if (error.message === "RejectedByUser") {
        console.log("User rejected adding the app");
      } else if (error.message === "InvalidDomainManifestJson") {
        console.error("Manifest/domain mismatch");
      } else {
        console.error("addMiniApp error:", error);
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
            Share on Farcaster and add the app!
          </p>

          <button
            onClick={handleCastButton}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold rounded-xl transition-all transform active:scale-95 text-lg"
            disabled={!isSDKLoaded}
          >
            Share on Farcaster
          </button>

          <button
            onClick={handleAddButton}
            className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-xl transition-all transform active:scale-95 text-lg"
            disabled={!isSDKLoaded}
          >
            Add to Apps
          </button>
        </div>

        {!isSDKLoaded && (
          <p className="text-xs text-gray-500 animate-pulse">
            Connecting to Farcaster...
          </p>
        )}
      </div>
    </main>
  );
}