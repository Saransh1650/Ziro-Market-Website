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
function SortableCard({ item, isOverlay = false, isPinned = false }: { item: BentoItem; isOverlay?: boolean; isPinned?: boolean }) {
  const sortable = useSortable({ id: item.id, disabled: isPinned });
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
    cursor: isPinned ? 'default' : (isDragging ? 'grabbing' : 'grab'),
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
        borderRadius: 24,
        overflow: 'hidden',
        background: item.featured
          ? 'linear-gradient(145deg, rgba(56,189,248,0.1) 0%, rgba(12,15,20,1) 100%)'
          : item.type === 'text' 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
            : '#0c0f14',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: item.type === 'text' ? (item.featured ? '40px' : '32px') : 0,
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
      }}
      className={`bento-card-inner ${item.featured ? 'nucleus-card' : ''}`}
      >
      {/* Drag handle dots - only if not pinned */}
      {!isPinned && (
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
            padding: item.featured ? '40px' : '0',
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
              fontSize: item.featured ? '2.8rem' : '1.05rem',
              fontWeight: 900,
              color: '#fff',
              margin: 0,
              marginBottom: item.featured ? 16 : 10,
              letterSpacing: item.featured ? '-0.06em' : '-0.02em',
              lineHeight: 1.1,
              background: item.featured ? 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.4) 100%)' : 'none',
              WebkitBackgroundClip: item.featured ? 'text' : 'none',
              WebkitTextFillColor: item.featured ? 'transparent' : 'inherit',
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: item.featured ? '1rem' : '0.82rem',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: item.featured ? '280px' : 'none',
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }, // small threshold so clicks still work
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

  return (
    <section
      ref={ref}
      style={{
        background: '#080a0f',
        padding: '140px 0 120px',
        position: 'relative',
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

      <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 64,
          flexWrap: 'wrap',
          gap: 20,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'none' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '5px 13px',
              background: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: 99,
              color: '#38bdf8',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              App Showcase
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 14,
            }}>
              Every Screen,<br />Yours to Arrange
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.9rem', maxWidth: 400 }}>
              Drag any tile to reorder. Your layout is saved automatically.
            </p>
          </div>

          <button
            onClick={() => {
              const otherItems = DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6');
              setItems(otherItems);
              localStorage.removeItem(STORAGE_KEY);
            }}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 10,
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
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
            minHeight: '600px'
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
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridAutoRows: '240px',
                    gridAutoFlow: 'dense',
                    gap: 16,
                  }}
                  className="bento-grid"
                >
                  <SortableCard 
                    key="sc-6" 
                    item={DEFAULT_BENTO_ITEMS.find(it => it.id === 'sc-6')!} 
                    isPinned
                  />

                  <AnimatePresence>
                    {items.map((item) => (
                      <SortableCard key={item.id} item={item} />
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

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1200px) {
          .bento-grid { 
            grid-template-columns: repeat(3, 1fr) !important; 
            grid-auto-rows: 200px !important;
          }
        }
        @media (max-width: 900px) {
          .bento-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
          }
        }
        @media (max-width: 600px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto !important;
          }
          .bento-grid > [style*="grid-column: span 2"] {
            grid-column: span 1 !important;
          }
          .bento-grid > [style*="grid-row: span 2"] {
            grid-row: span 1 !important;
          }
          .bento-card-inner {
            height: auto !important;
            min-height: 200px;
          }
        }

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
