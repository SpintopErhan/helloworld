// app/layout.tsx  ← TAM OLARAK BÖYLE YAP

import "./globals.css";

const baseUrl = "https://helloworld-six-omega.vercel.app";

export const metadata = {
  title: "Hello World Miniapp",
  description: "Farcaster Miniapp Demo",
  openGraph: {
    title: "Hello World Miniapp",
    description: "Tıkla ve direkt Miniapp içinde aç!",
    images: [`${baseUrl}/frame_image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        {/* BURASI HAYATİ – MANUEL OLARAK EKLEMEK ZORUNDASIN */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "1",
            imageUrl: `${baseUrl}/frame_image.png`,
            button: {
              title: "Miniapp'i Aç",
              action: {
                type: "launch_miniapp",
                name: "Hello World Miniapp",
              },
            },
          })}
        />

        {/* Eski client’lar için geriye uyumluluk */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={`${baseUrl}/frame_image.png`} />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

        {/* Opsiyonel: Daha iyi görünüm için */}
        <meta property="og:image" content={`${baseUrl}/frame_image.png`} />
        <meta property="og:title" content="Hello World Miniapp" />
        <meta property="og:description" content="Farcaster Miniapp Demo" />
      </head>
      <body>{children}</body>
    </html>
  );
}