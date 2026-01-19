import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 180,
  height: 180,
}
 
export const contentType = 'image/png'
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
          borderRadius: '40px',
        }}
      >
        <div
          style={{
            width: '75%',
            height: '75%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '8px solid white',
            borderRadius: '16px',
            position: 'relative',
          }}
        >
          {/* Mountain/Image icon */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 100 L45 55 L65 80 L85 45 L105 70 L105 100 L20 100 Z"
              fill="white"
              opacity="0.95"
            />
            <circle cx="85" cy="35" r="12" fill="white" opacity="0.95" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
