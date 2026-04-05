'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crosshair,
  BrainCircuit,
  Activity,
  Waves,
  Briefcase,
  ShieldCheck,
  LucideIcon 
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { DEFAULT_BENTO_ITEMS, BentoItem } from '@/lib/bentoData';

const ICONS: Record<string, LucideIcon> = {
  Crosshair,
  BrainCircuit,
  Activity,
  Waves,
  Briefcase,
  ShieldCheck
};

const STORAGE_KEY = 'ti_bento_v3';

// ─── Sortable Item ────────────────────────────────────────────────────────────
function SortableCard({ item, isOverlay = false, isPinned = false, isMobile = false }: { item: BentoItem; isOverlay?: boolean; isPinned?: boolean; isMobile?: boolean }) {
  const sortable = useSortable({ id: item.id, disabled: isPinned || isMobile });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : transition,
    gridColumn: isPinned ? '2 / span 2' : `span ${item.colSpan}`,
    gridRow: isPinned ? '2 / span 2' : `span ${item.rowSpan}`,
    opacity: isDragging ? 0 : 1,
    height: '100%',
    position: 'relative',
    userSelect: 'none',
    zIndex: (isOverlay || isPinned) ? 999 : undefined,
    cursor: (isPinned || isMobile) ? 'default' : (isDragging ? 'grabbing' : 'grab'),
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{
        height: '100%',
        width: '100%',
        borderRadius: isMobile ? 16 : 24,
        overflow: 'hidden',
        background: item.featured
          ? 'linear-gradient(145deg, rgba(56,189,248,0.1) 0%, rgba(12,15,20,1) 100%)'
          : item.type === 'text' 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
            : '#0c0f14',
        cursor: (isMobile || isDragging) ? 'default' : 'grab',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: item.type === 'text' ? (isMobile ? '24px' : (item.featured ? '40px' : '32px')) : 0,
        backdropFilter: (item.type === 'text' || item.featured) ? 'blur(20px)' : 'none',
        boxShadow: isOverlay
          ? '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(56,189,248,0.4), inset 0 0 20px rgba(56,189,248,0.1)'
          : item.featured
            ? '0 20px 80px rgba(0,0,0,0.6), inset 0 0 40px rgba(56,189,248,0.05)'
            : '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isOverlay
          ? '2px solid #38bdf8'
          : item.featured
            ? '1px solid rgba(56, 189, 248, 0.4)'
            : '1px solid rgba(255,255,255,0.07)',
        minHeight: isMobile ? '200px' : 'auto',
      }}
      className={`bento-card-inner ${item.featured ? 'nucleus-card' : ''}`}
      >
      {/* Drag handle dots - only if not pinned and not mobile */}
      {!isPinned && !isMobile && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 14,
          color: 'rgba(255,255,255,0.18)',
          fontSize: 13,
          letterSpacing: 1,
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          ⠿
        </div>
      )}

        {item.type === 'text' ? (
          <div style={{
            textAlign: item.featured ? 'center' : 'left',
            padding: item.featured ? (isMobile ? '20px' : '40px') : '0',
          }}>
            {item.icon && !item.featured && (
              <div style={{ marginBottom: 16 }}>
                {(() => {
                  const Icon = ICONS[item.icon];
                  return Icon ? (
                    <Icon 
                      size={24} 
                      strokeWidth={1.8} 
                      style={{ color: '#38bdf8' }} 
                    />
                  ) : null;
                })()}
              </div>
            )}
            <h3 style={{
              fontSize: item.featured ? (isMobile ? '1.6rem' : '2.8rem') : (isMobile ? '0.95rem' : '1.05rem'),
              fontWeight: 900,
              color: '#fff',
              margin: 0,
              marginBottom: item.featured ? (isMobile ? 12 : 16) : 10,
              letterSpacing: item.featured ? '-0.06em' : '-0.02em',
              lineHeight: 1.1,
              background: item.featured ? 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.4) 100%)' : 'none',
              WebkitBackgroundClip: item.featured ? 'text' : 'none',
              WebkitTextFillColor: item.featured ? 'transparent' : 'inherit',
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: item.featured ? (isMobile ? '0.85rem' : '1rem') : (isMobile ? '0.78rem' : '0.82rem'),
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: item.featured ? (isMobile ? '100%' : '280px') : 'none',
              marginLeft: item.featured ? 'auto' : '0',
              marginRight: item.featured ? 'auto' : '0',
            }}>
              {item.desc}
            </p>
          </div>
        ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          pointerEvents: 'none',
        }}>
          <img
            src={item.src}
            alt={item.label ?? item.id}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
            className="bento-img"
            draggable={false}
          />
          {/* Bottom label */}
          <div style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            padding: '4px 10px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            color: '#fff',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {item.label}
          </div>
        </div>
      )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AppShowcase() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [items, setItems] = useState<BentoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 600);
      setIsTablet(width > 600 && width <= 900);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const otherItems = DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6');
      
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        const sorted = ids
          .map((id) => otherItems.find((it) => it.id === id))
          .filter((it): it is BentoItem => !!it);
        
        if (sorted.length === otherItems.length) {
          setItems(sorted);
        } else {
          setItems(otherItems);
        }
      } else {
        setItems(otherItems);
      }
    } catch {
      setItems(DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6'));
    }
  }, []);

  // Disable drag on mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: isMobile ? 999999 : 6 }, // disable on mobile
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((it) => it.id === active.id);
    const newIndex = items.findIndex((it) => it.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems.map((it) => it.id)));
  };

  const activeItem = items.find((it) => it.id === activeId);

  // Localized Scaling Engine
  // We force the desktop layout (4 cols) and scale it down to fit the phone width
  const gridColumns = 4;
  const gridAutoRows = '240px';
  const gridGap = 16;
  const contentWidth = 1340; // Desktop width baseline
  
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScale = () => {
      const width = window.innerWidth;
      // Precision scaling: fit 1340px grid into viewport with 32px safety margin
      const newScale = Math.min(1, (width - 32) / contentWidth);
      setScale(newScale);
    };
    handleScale();
    window.addEventListener('resize', handleScale);
    return () => window.removeEventListener('resize', handleScale);
  }, []);

  return (
    <section
      ref={ref}
      className="app-showcase-section"
      style={{
        background: '#0a0e12',
        padding: isMobile ? '60px 0 40px' : '140px 0 120px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div 
        className="scale-container"
        style={{
          width: contentWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          margin: '0 auto',
          position: 'relative',
          left: '50%',
          marginLeft: -(contentWidth/2),
          // Height compensation: scale affects visuals but not layout flow.
          // This reduces the vertical footprint of the section on mobile.
          marginBottom: scale < 1 ? `calc((${scale} - 1) * 800px)` : 0
        }}
      >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        height: 900,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div 
        className="container-wide" 
        style={{ 
          position: 'relative', 
          zIndex: 2,
          maxWidth: isMobile ? '100%' : '1340px',
          padding: isMobile ? '0' : '0 28px',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: isMobile ? 40 : 64,
          flexWrap: 'wrap',
          gap: 20,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'none' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <div>
            <h2 style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 14,
            }}>
              The Market,<br />Explained.
            </h2>
            <p style={{ 
              color: 'rgba(255,255,255,0.38)', 
              fontSize: isMobile ? '0.85rem' : '0.9rem', 
              maxWidth: 400 
            }}>
              Explore the intelligence tools powering Ziro Market.
            </p>
          </div>

          <button
            onClick={() => {
              const otherItems = DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6');
              setItems(otherItems);
              localStorage.removeItem(STORAGE_KEY);
            }}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 10,
              color: 'rgba(255,255,255,0.6)',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            Reset Layout
          </button>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
            minHeight: isMobile ? 'auto' : '600px',
          }}
        >
          {hasMounted && (
            <DndContext
              id="bento-grid"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map((it) => it.id)} strategy={rectSortingStrategy}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                    gridAutoRows: gridAutoRows,
                    gridAutoFlow: 'dense',
                    gap: gridGap,
                  }}
                  className="bento-grid"
                >
                  <SortableCard 
                    key="sc-6" 
                    item={DEFAULT_BENTO_ITEMS.find(it => it.id === 'sc-6')!} 
                    isPinned
                    isMobile={isMobile}
                  />

                  <AnimatePresence>
                    {items.map((item) => (
                      <SortableCard key={item.id} item={item} isMobile={isMobile} />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>

              {/* Floating drag overlay — the "card you're holding" */}
              <DragOverlay adjustScale={false}>
                {activeItem ? (
                  <SortableCard item={activeItem} isOverlay />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bento-card-inner:hover .bento-img {
          transform: scale(1.05);
        }

        .nucleus-card:hover {
          border-color: rgba(56, 189, 248, 0.8) !important;
          box-shadow: 0 30px 100px rgba(56,189,248,0.15), inset 0 0 60px rgba(56,189,248,0.1) !important;
        }
      `}} />
    </section>
  );
}
