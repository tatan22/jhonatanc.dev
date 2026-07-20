import { ImageResponse } from 'next/og'
import { getProfile } from '@/lib/db'

export const runtime = 'edge'
export const alt = 'Jhonatan Cardona | Full Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const profile = await getProfile();
  
  // Satori requiere URLs absolutas
  const rawImageUrl = profile?.image_url || "/profile.webp";
  const imageUrl = rawImageUrl.startsWith('http') 
    ? rawImageUrl 
    : `https://jhonatanc-dev.vercel.app${rawImageUrl}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          padding: '80px',
        }}
      >
        {/* Left side: Profile image */}
        <div style={{ display: 'flex', marginRight: '60px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl}
            alt="Profile"
            width="320"
            height="320"
            style={{ 
              borderRadius: '160px',
              border: '8px solid #3b82f6',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '600px', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
              Jhonatan Cardona
            </span>
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: 'white', margin: '0', lineHeight: 1.1 }}>
            Full-Stack TypeScript Engineer
          </h1>
          <p style={{ fontSize: '32px', color: '#9ca3af', marginTop: '24px', marginBottom: '48px', lineHeight: 1.4 }}>
            Especialista en tiendas en línea y aplicaciones web escalables
          </p>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '28px', color: 'white' }}>
              Next.js
            </div>
            <div style={{ display: 'flex', padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '28px', color: 'white' }}>
              NestJS
            </div>
            <div style={{ display: 'flex', padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '28px', color: 'white' }}>
              React Native
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
