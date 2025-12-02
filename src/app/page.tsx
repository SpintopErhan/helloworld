"use client";

import { useEffect, useState, useCallback } from "react";
// The problematic 'import { sdk } from "@farcaster/miniapp-sdk";' line was removed.

// Define the type for the SDK object globally added by the Farcaster client
// Allows TypeScript to recognize FarcasterMiniAppSDK on the 'window' object.
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
        // Other context fields...
      } | null>;
      // Other SDK fields...
    };
  }
}

// Helper function for secure SDK access
const getSdk = () => {
  if (typeof window !== 'undefined' && window.FarcasterMiniAppSDK) {
    return window.FarcasterMiniAppSDK;
  }
  return null;
};


// Simple interface to hold user information
interface UserInfo {
  fid: number;
  username: string;
  displayName: string;
}

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Initializes the SDK, reports readiness, and retrieves the user context.
  useEffect(() => {
    const init = async () => {
      const sdk = getSdk();
      if (!sdk) {
        console.error("Farcaster MiniApp SDK not found globally. Ensure it is running within a Farcaster client.");
        // If SDK is not found, stay in loading state
        return; 
      }

      try {
        // Report to the Farcaster client that the SDK is ready
        await sdk.actions.ready();
        setIsSDKLoaded(true);

        // Retrieve the user context (FID, username, etc.)
        const context = await sdk.getMiniAppContext();
        
        console.log("MiniApp Context:", context);

        if (context?.viewerFarcasterId) {
          // If user information is available, save it to state
          setUserInfo({
            fid: context.viewerFarcasterId.fid,
            username: context.viewerFarcasterId.username,
            displayName: context.viewerFarcasterId.displayName,
          });
        }

        // Automatically request to add MiniApp (if not already added)
        await sdk.actions.addMiniApp();
        console.log("addMiniApp called – prompt shown if not added yet");

      } catch (err) {
        console.error("SDK init or context error:", err);
      }
    };

    init();
  }, []);

  // New Cast creation operation
  const handleCast = useCallback(async () => {
    if (!isSDKLoaded) return;
    
    const sdk = getSdk();
    if (!sdk) return; // Stop operation if SDK is missing

    // Add the user's name to the cast message
    const userGreeting = userInfo 
      ? `Hello World from Miniapp! 👋 I'm @${userInfo.username} (FID: ${userInfo.fid})`
      : "Hello World from Miniapp";

    try {
      const result = await sdk.actions.composeCast({
        text: userGreeting,
        embeds: ["https://helloworld-six-omega.vercel.app"], // Use your own app's URL
      });

      if (result?.cast) {
        console.log("Cast sent:", result.cast.hash);
      }
    } catch (err) {
      console.error("Cast error:", err);
    }
  }, [isSDKLoaded, userInfo]);

  // Helper component to display user information
  const UserInfoCard = () => {
    if (!userInfo) {
      return (
        <p className="text-lg text-slate-400">
          Fetching user info or not available.
        </p>
      );
    }

    return (
      <div className="text-left space-y-3 pt-4 border-t border-slate-700 mt-6">
        <h2 className="text-2xl font-semibold text-purple-400">
          Welcome, {userInfo.displayName}!
        </h2>
        
        <p className="text-slate-300">
          <span className="font-medium text-slate-200">Username:</span> @{userInfo.username}
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
            Successfully retrieved the information of the Farcaster user running the app.
          </p>

          <UserInfoCard />
          
          <button
            onClick={handleCast}
            disabled={!isSDKLoaded}
            className="w-full mt-8 py-4 px-8 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/50"
          >
            {isSDKLoaded ? "Compose and Share Cast" : "Loading..."}
          </button>
        </div>

        {!isSDKLoaded && (
          <p className="text-sm text-slate-500 animate-pulse">
            Connecting to Farcaster...
          </p>
        )}
      </div>
    </main>
  );
}