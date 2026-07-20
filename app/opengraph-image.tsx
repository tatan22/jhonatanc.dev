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
  
  // Asegurarnos de que la URL de la imagen sea absoluta, ya que next/og lo requiere
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
            width="300"
            height="300"
            style={{ 
              borderRadius: '150px', 
              objectFit: 'cover',
              objectPosition: 'top',
              border: '8px solid #3b82f6',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
            }}
          />
        </div>

        {/* Right side: Text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
              Portafolio Profesional
            </span>
          </div>
          <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: 'white', margin: '0', lineHeight: 1.1 }}>
            Jhonatan Cardona
          </h1>
          <p style={{ fontSize: '36px', color: '#9ca3af', marginTop: '16px', marginBottom: '40px' }}>
            Full-Stack TypeScript Engineer & Commerce Creator
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '24px', color: '#e5e7eb' }}>
              Next.js
            </div>
            <div style={{ display: 'flex', padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '24px', color: '#e5e7eb' }}>
              NestJS
            </div>
            <div style={{ display: 'flex', padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '24px', color: '#e5e7eb' }}>
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
