export interface BentoItem {
  id: string;
  type: 'image' | 'text';
  src?: string;
  label?: string;
  title?: string;
  desc?: string;
  icon?: string;
  featured?: boolean;
  colSpan: 1 | 2;
  rowSpan: 1 | 2; // Grid units
}

export const DEFAULT_BENTO_ITEMS: BentoItem[] = [
  {
    id: 'header',
    type: 'text',
    title: 'Precision Trading',
    desc: 'Alpha signals revealed with surgical precision.',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: 'f-1',
    type: 'text',
    title: 'Zero Latency',
    desc: 'Live data streaming with millisecond precision.',
    colSpan: 1,
    rowSpan: 1,
    icon: '⚡',
  },
  {
    id: 'sc-6',
    type: 'text',
    title: 'Ziro Market',
    desc: 'The Interface of Power. Professional-grade India market intelligence.',
    colSpan: 2,
    rowSpan: 2,
    featured: true,
  },
  {
    id: 'f-2',
    type: 'text',
    title: 'Intelligence',
    desc: 'High-conviction moves spotted before they trend.',
    colSpan: 1,
    rowSpan: 1,
    icon: '🎯',
  },
  {
    id: 'f-3',
    type: 'text',
    title: 'Flow Index',
    desc: 'See where big money moves before the crowd.',
    colSpan: 1,
    rowSpan: 1,
    icon: '💎',
  },
  {
    id: 'sc-1',
    type: 'image',
    src: '/screenshots/sc-1.png',
    label: 'Real-time Tickers',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: 'sc-2',
    type: 'image',
    src: '/screenshots/sc-2.png',
    label: 'Sector Heatmap',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: 'sc-3',
    type: 'image',
    src: '/screenshots/sc-3.png',
    label: 'Smart Discovery',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: 'sc-4',
    type: 'image',
    src: '/screenshots/sc-4.png',
    label: 'Volume Tracker',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: 'sc-5',
    type: 'image',
    src: '/screenshots/sc-5.png',
    label: 'Advanced Analysis',
    colSpan: 1,
    rowSpan: 2,
  },
  {
    id: 'f-4',
    type: 'text',
    title: 'Portfolio',
    desc: 'Every position, every sector — one interface.',
    colSpan: 1,
    rowSpan: 1,
    icon: '📊',
  },
  {
    id: 'f-5',
    type: 'text',
    title: 'Insights',
    desc: 'See where big money moves before the crowd.',
    colSpan: 1,
    rowSpan: 1,
    icon: '💎',
  },
];
