import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export const contentType = 'image/png'
 
export default function Icon() {
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
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            width: '80%',
            height: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            borderRadius: '4px',
            position: 'relative',
          }}
        >
          {/* Mountain shape */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 18 L8 12 L12 16 L16 10 L20 14 L20 18 L4 18 Z"
              fill="white"
              opacity="0.9"
            />
            <circle cx="16" cy="8" r="2" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
