'use client';

export default function GridSection() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#0a0e12',
      padding: '120px 20px',
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* 2x2 Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '16px',
          width: '100%'
        }}>
          {/* Top Left */}
          <div style={{
            width: '100%',
            height: '280px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 1
            </div>
          </div>

          {/* Top Right */}
          <div style={{
            width: '100%',
            height: '280px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 2
            </div>
          </div>

          {/* Bottom Left */}
          <div style={{
            width: '100%',
            height: '280px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 3
            </div>
          </div>

          {/* Bottom Right */}
          <div style={{
            width: '100%',
            height: '280px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
