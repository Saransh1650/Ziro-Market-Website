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

// ─── Sortable Item (Desktop) ──────────────────────────────────────────────────
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
        borderRadius: 32,
        overflow: 'hidden',
        background: item.featured
          ? 'linear-gradient(165deg, rgba(58, 110, 165, 0.1) 0%, var(--bg-1) 100%)'
          : item.type === 'text' 
            ? 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' 
            : 'var(--bg-1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: item.type === 'text' ? (item.featured ? '40px' : '32px') : 0,
        backdropFilter: 'blur(24px)',
        boxShadow: isOverlay
          ? '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px var(--brand)'
          : item.featured
            ? '0 30px 90px rgba(0,0,0,0.7)'
            : '0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative',
        transition: 'all 0.4s var(--ease-out)',
        border: isOverlay
          ? '2px solid var(--brand)'
          : item.featured
            ? '1px solid rgba(58, 110, 165, 0.4)'
            : '1px solid var(--border)',
      }}
      className={`bento-card-inner ${item.featured ? 'nucleus-card' : ''}`}
      >
        {!isPinned && (
          <div style={{
            position: 'absolute',
            top: 14,
            right: 16,
            color: 'var(--text-4)',
            fontSize: 14,
            letterSpacing: 1,
            lineHeight: 1,
            pointerEvents: 'none',
            opacity: 0.5
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
              <div style={{ marginBottom: 18 }}>
                {(() => {
                  const Icon = ICONS[item.icon];
                  return Icon ? (
                    <Icon 
                      size={28} 
                      strokeWidth={1.5} 
                      style={{ color: 'var(--brand)' }} 
                    />
                  ) : null;
                })()}
              </div>
            )}
            <h3 style={{
              fontSize: item.featured ? '3.2rem' : '1.15rem',
              fontWeight: 900,
              color: 'var(--text-1)',
              margin: 0,
              marginBottom: item.featured ? 16 : 12,
              letterSpacing: item.featured ? '-0.06em' : '-0.03em',
              lineHeight: 1.1,
              background: item.featured ? 'linear-gradient(to bottom, #fff 50%, rgba(255,255,255,0.4) 100%)' : 'none',
              backgroundClip: item.featured ? 'text' : 'none',
              WebkitBackgroundClip: item.featured ? 'text' : 'none',
              WebkitTextFillColor: item.featured ? 'transparent' : 'inherit',
            }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: item.featured ? '1.05rem' : '0.88rem',
              color: 'var(--text-3)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: item.featured ? '320px' : 'none',
              marginLeft: item.featured ? 'auto' : '0',
              marginRight: item.featured ? 'auto' : '0',
            }}>
              {item.desc}
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
              src={item.src}
              alt={item.id}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="bento-img"
              draggable={false}
            />
            <div style={{
              position: 'absolute',
              bottom: 18,
              left: 18,
              padding: '6px 12px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: 10,
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {item.label}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Mobile Feature Card ──────────────────────────────────────────────────────
function MobileFeatureCard({ item }: { item: BentoItem }) {
  return (
    <div style={{
      borderRadius: 24,
      background: item.featured 
        ? 'linear-gradient(165deg, rgba(58, 110, 165, 0.1) 0%, var(--bg-1) 100%)' 
        : 'var(--bg-1)',
      padding: '24px',
      border: item.featured ? '1px solid rgba(58, 110, 165, 0.3)' : '1px solid var(--border)',
      boxShadow: item.featured ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {item.icon && !item.featured && (
        <div style={{ marginBottom: 12 }}>
          {(() => {
            const Icon = ICONS[item.icon];
            return Icon ? <Icon size={24} strokeWidth={2} style={{ color: 'var(--brand)' }} /> : null;
          })()}
        </div>
      )}
      <h3 style={{
        fontSize: item.featured ? '1.8rem' : '1.1rem',
        fontWeight: 900,
        color: 'var(--text-1)',
        marginBottom: 8,
        lineHeight: 1.1,
        letterSpacing: '-0.03em'
      }}>
        {item.title}
      </h3>
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-3)',
        lineHeight: 1.5,
        margin: 0
      }}>
        {item.desc}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AppShowcase() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [items, setItems] = useState<BentoItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const otherItems = DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6');
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        const sorted = ids.map(id => otherItems.find(it => it.id === id)).filter(Boolean) as BentoItem[];
        setItems(sorted.length === otherItems.length ? sorted : otherItems);
      } else {
        setItems(otherItems);
      }
    } catch {
      setItems(DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6'));
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
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

  // Mobile data splits
  const mobileFeatures = [
    DEFAULT_BENTO_ITEMS.find(it => it.id === 'sc-6')!, // Featured
    DEFAULT_BENTO_ITEMS.find(it => it.id === 'f-1')!,
    DEFAULT_BENTO_ITEMS.find(it => it.id === 'f-2')!,
    DEFAULT_BENTO_ITEMS.find(it => it.id === 'f-4')!,
  ].filter(Boolean);

  const screenshots = DEFAULT_BENTO_ITEMS.filter(it => it.type === 'image');

  const showcaseDesc = (hasMounted && isMobile) 
    ? "A professional-grade terminal curated for your mobile discovery."
    : "Drag cards to rearrange your custom market command center.";

  return (
    <section 
      ref={ref} 
      className="section" 
      id="showcase"
      style={{ 
        background: 'var(--bg)', 
        overflow: 'hidden',
        padding: (hasMounted && isMobile) ? '80px 0 60px' : '160px 0 140px',
        minHeight: '400px' // Ensure observer has a target during hydration
      }}
    >
      <div className="container" style={{
        opacity: (isVisible || !hasMounted) ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(24px)',
        transition: 'all 1s var(--ease-out) 0.1s',
      }}>
        {/* Header */}
        <div style={{
          textAlign: (hasMounted && isMobile) ? 'left' : 'center',
          marginBottom: (hasMounted && isMobile) ? 48 : 80,
        }}>
          <div className="badge badge-stable" style={{ marginBottom: 20 }}>Intelligence Center</div>
          <h2 style={{
             fontSize: (hasMounted && isMobile) ? '2.4rem' : '4.2rem',
             lineHeight: 1.05,
             marginBottom: 24,
             letterSpacing: '-0.06em'
          }}>
            The Market, <br />
            <span className="text-gradient">Explained.</span>
          </h2>
          <p style={{ maxWidth: 500, margin: (hasMounted && isMobile) ? '0' : '0 auto' }}>
            {showcaseDesc}
          </p>
        </div>

        {!hasMounted ? (
          <div style={{ height: '400px' }} /> // Loading placeholder
        ) : isMobile ? (
          /* Mobile Native View */
          <div>
            {/* Features 2x2 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
              marginBottom: 48
            }}>
              <div style={{ gridColumn: 'span 2' }}>
                <MobileFeatureCard item={mobileFeatures[0]} />
              </div>
              {mobileFeatures.slice(1).map((item, idx) => (
                <div key={idx}>
                  <MobileFeatureCard item={item} />
                </div>
              ))}
            </div>

            {/* Screenshots Vertical / Stacked sections */}
            <div style={{ marginTop: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--brand)' }} />
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-2)' }}>Terminal Interface</h4>
              </div>
              
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: 20,
                paddingBottom: 24,
                paddingLeft: '4px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
              }} className="no-scrollbar">
                {screenshots.map((ss, idx) => (
                  <div key={idx} style={{ 
                    flex: '0 0 280px', 
                    borderRadius: 24, 
                    overflow: 'hidden', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border)'
                  }}>
                    <img src={ss.src} alt={ss.label} style={{ width: '100%', display: 'block' }} />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontWeight: 600 }}>Swipe to explore interfaces →</span>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Bento View */
          <div>
            <DndContext
              id="bento-grid"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map(it => it.id)} strategy={rectSortingStrategy}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridAutoRows: '260px',
                  gridAutoFlow: 'dense',
                  gap: 24,
                }}>
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
              <DragOverlay adjustScale={false}>
                {activeItem ? <SortableCard item={activeItem} isOverlay /> : null}
              </DragOverlay>
            </DndContext>
            
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button
                onClick={() => {
                  const otherItems = DEFAULT_BENTO_ITEMS.filter(it => it.id !== 'sc-6');
                  setItems(otherItems);
                  localStorage.removeItem(STORAGE_KEY);
                }}
                className="btn btn-ghost"
              >
                Reset Default Terminal Layout
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        #showcase .text-gradient {
          background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bento-card-inner:hover .bento-img {
          transform: scale(1.08);
        }
        .nucleus-card:hover {
          border-color: rgba(58, 110, 165, 0.6) !important;
          box-shadow: 0 40px 120px rgba(0,0,0,0.8) !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
