import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const miniAppMeta = JSON.stringify({
    version: "1",
    // https:// YOK → sadece domainden başla
    imageUrl: "helloworld-six-omega.vercel.app/frame_image.png",
    button: {
      title: "Open Miniapp",
      action: {
        type: "launch_miniapp",
        name: "Hello World Miniapp",
        // burada da https:// yok
        url: "helloworld-six-omega.vercel.app",
      },
    },
  });

  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content={miniAppMeta} />

        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="helloworld-six-omega.vercel.app/frame_image.png" />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="og:image" content="https://helloworld-six-omega.vercel.app/frame_image.png" />
        <meta property="og:title" content="Hello World Miniapp" />
      </head>
      <body>{children}</body>
    </html>
  );
}