// app/layout.tsx → KOPYALA-YAPIŞTIR YAP, HİÇ DEĞİŞTİRME

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const miniAppMeta = JSON.stringify({
    version: "1",
    imageUrl: "helloworld-six-omega.vercel.app/frame_image.png",
    button: {
      title: "Open Miniapp",
      action: {
        type: "launch_miniapp",
        name: "Hello World Miniapp",
        url: "helloworld-six-omega.vercel.app",           // ZORUNLU!
        splashImageUrl: "helloworld-six-omega.vercel.app/frame_image.png", // EKLENDİ!
        splashBackgroundColor: "#000000"                  // EKLENDİ! (siyah, mor, beyaz farketmez)
      }
    }
  });

  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content={miniAppMeta} />

        {/* Geriye uyumluluk */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="helloworld-six-omega.vercel.app/frame_image.png" />

        <meta property="og:image" content="https://helloworld-six-omega.vercel.app/frame_image.png" />
        <meta property="og:title" content="Hello World Miniapp" />
      </head>
      <body>{children}</body>
    </html>
  );
}