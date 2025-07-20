import LogoSquare from '@/components/logo-square';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function Image() {
  const { SITE_NAME } = process.env;
  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogoSquare size={100} />
          <div
            style={{
              marginLeft: 40,
              fontSize: 60,
              letterSpacing: '-0.05em',
              fontStyle: 'normal',
              whiteSpace: 'pre-wrap'
            }}
          >
            {SITE_NAME}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}