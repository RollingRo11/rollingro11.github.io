import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Rohan.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f0e6',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 400,
            color: '#DC143C',
            fontFamily: '"Crimson Pro", serif',
            letterSpacing: '-0.02em',
          }}
        >
          Rohan.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Crimson Pro',
          data: await fetch(
            new URL('https://fonts.gstatic.com/s/crimsonpro/v1/q5uDsoa5M_tv7IihmnkabARboYF6CsKj.woff2')
          ).then((res) => res.arrayBuffer()),
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}