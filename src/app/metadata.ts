import type { Metadata } from 'next';

// Uygulamanızın canlı URL'sini sabitleyelim
const appUrl = "https://helloworld-six-omega.vercel.app/";

export const metadata: Metadata = {
  // 1. Temel SEO ve Tarayıcı Etiketleri
  title: 'Hello World Farcaster Miniapp',
  description: 'Farcaster üzerinde "Hello World" mesajı paylaşın!',
  
  // 2. Open Graph Etiketleri (Genel Sosyal Medya Paylaşımı için)
  openGraph: {
    title: 'Hello World Farcaster Miniapp',
    description: 'Hemen aç ve ilk Cast’ini at!',
    images: [`${appUrl}frame_image.png`],
    url: appUrl,
  },

  // 3. Farcaster Frame Metadata Etiketleri (Embedding için KRİTİK)
  other: {
    // Frame sürümünü belirtir
    'fc:frame': 'vNext',
    
    // Frame'de gösterilecek görselin URL'si
    'fc:frame:image': `${appUrl}frame_image.png`, 
    
    // DİKKAT: Frame butonları, aksiyonları (post/redirect/link) ve post_url alanı 
    // yerel Miniapp açılışını zorlamak için TAMAMEN KALDIRILMIŞTIR.
    // Artık sadece gömülü görselin kendisine tıklanması beklenir.
  }
};

export default metadata;