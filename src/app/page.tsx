// app/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useFarcasterMiniApp } from "@/hooks/useFarcasterMiniApp";

// Wagmi ve Viem importları
import { createConfig, WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// viem'den gerekli import'lar
import { createPublicClient, http } from 'viem'; // BU SATIRI EKLE!

// WalletConnect için PROJECT_ID'nizi buraya girin.
// WalletConnect Cloud'dan alabilirsiniz: https://cloud.walletconnect.com/
// Genellikle bir .env dosyasında tutulur: process.env.NEXT_PUBLIC_WC_PROJECT_ID
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID; // Burayı kendi PROJECT ID'nizle değiştirin!

// 1. Wagmi Config oluştur
const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID, showQrModal: true }),
  ],
  // EKSİK OLAN 'client' ÖZELLİĞİ BURAYA EKLENDİ
  client: ({ chain }) => createPublicClient({
    chain,
    transport: http(), // Her zincir için HTTP tabanlı bir public client oluştur
  }),
  ssr: true,
});

// 2. React Query istemcisi oluştur (Wagmi bunu kullanır)
const queryClient = new QueryClient();

export default function Home() {
  // ... (Geri kalan kod aynı kalacak)
  // Farcaster hook'undan gelenler
  const { user, status, error, composeCast } = useFarcasterMiniApp();

  // Wagmi hook'larından gelenler
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [castText, setCastText] = useState<string>("");
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [castError, setCastError] = useState<string | null>(null);
  const [castSuccess, setCastSuccess] = useState<boolean>(false);

  const handleComposeCast = async (e: FormEvent) => {
    e.preventDefault();
    if (!castText.trim()) {
      setCastError("Lütfen bir metin girin.");
      return;
    }

    setCastError(null);
    setCastSuccess(false);
    setIsCasting(true);

    try {
      await composeCast(castText);
      setCastText("");
      setCastSuccess(true);
      console.log("Cast başarıyla atıldı!");
    } catch (err: unknown) {
      console.error("Cast atılırken hata oluştu:", err);
      if (err instanceof Error) {
        setCastError(err.message);
      } else {
        setCastError("Cast atılırken bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsCasting(false);
    }
  };

  return (
    // Wagmi ve React Query sağlayıcılarını burada sarmalıyoruz
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
          <h1 className="text-4xl font-bold mb-8 text-blue-400">Farcaster MiniApp</h1>

          {/* Farcaster Durumu */}
          <div className="mb-6 text-lg text-center">
            {status === "loading" && <p className="text-yellow-400">Farcaster SDK yükleniyor...</p>}
            {status === "error" && <p className="text-red-500">Hata: {error?.message || "Bilinmeyen bir hata oluştu."}</p>}
            {status === "loaded" && (
              <p>
                Hoş geldin,{" "}
                <span className="font-semibold text-green-400">
                  {user.displayName}
                </span>{" "}
                (FID: {user.fid})
              </p>
            )}
            {user.fid === 0 && (
              <p className="text-red-300 mt-2">
                MiniApp&apos;i kullanabilmek için Farcaster&apos;da oturum açmanız gerekebilir.
              </p>
            )}
          </div>

          {/* Base Wallet Bağlantı Durumu */}
          <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2 text-purple-400">Base Wallet</h2>
            {isConnected ? (
              <>
                <p className="text-green-300">Connected to {connector?.name}</p>
                <p className="text-sm break-all">Address: <span className="font-mono">{address}</span></p>
                <button
                  onClick={() => disconnect()}
                  className="mt-3 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <p className="text-yellow-300">Wallet not connected.</p>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="mt-3 mr-2 py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    disabled={!connector.ready}
                  >
                    Connect with {connector.name}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Farcaster Cast Oluşturma Formu */}
          <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Yeni Cast Oluştur</h2>
            <form onSubmit={handleComposeCast} className="flex flex-col gap-4">
              <textarea
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                rows={4}
                placeholder="Ne düşünüyorsun?"
                value={castText}
                onChange={(e) => setCastText(e.target.value)}
                disabled={status !== "loaded" || user.fid === 0 || isCasting}
              ></textarea>
              <button
                type="submit"
                className={`py-3 px-6 rounded-md font-bold text-white transition-colors duration-200 ${
                  status !== "loaded" || user.fid === 0 || isCasting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={status !== "loaded" || user.fid === 0 || isCasting}
              >
                {isCasting ? "Gönderiliyor..." : "Cast At"}
              </button>
            </form>

            {castError && (
              <p className="mt-4 text-red-400 text-center">{castError}</p>
            )}
            {castSuccess && (
              <p className="mt-4 text-green-400 text-center">Cast başarıyla gönderildi!</p>
            )}
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}