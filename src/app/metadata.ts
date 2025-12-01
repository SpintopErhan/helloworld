// app/metadata.ts (veya layout.tsx içine koy)
import type { Metadata } from 'next';

const baseUrl = "https://helloworld-six-omega.vercel.app";

export const metadata: Metadata = {
  title: "Hello World Miniapp",
  description: "Farcaster'da ilk Miniapp deneyimin!",

  openGraph: {
    title: "Hello World Miniapp",
    description: "Tıkla ve direkt Miniapp içinde aç!",
    images: [`${baseUrl}/frame_image.png`],
    url: baseUrl,
  },

  other: {
    // BURASI ASIL ÖNEMLİ – EKSİKSİZ VE DOĞRU OLMALI!
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${baseUrl}/frame_image.png`,        // 1200x630 veya 1200x800 önerilir
      button: {
        title: "Miniapp'i Aç",                       // Cast altındaki buton yazısı
        action: {
          type: "launch_miniapp",                    // BU OLMADAN TARAYICIYA GİDER!
          name: "Hello World Miniapp"
          // url: otomatik current page, yazmana gerek yok
        }
      }
    }),

    // Geriye uyumluluk (eski client’lar için)
    "fc:frame": "vNext",
    "fc:frame:image": `${baseUrl}/frame_image.png`,
    "fc:frame:image:aspect_ratio": "1.91:1",        // veya "1:1" (çok önemli!)
  },
};