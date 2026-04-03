'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

interface StatItemProps {
  value: number;
  suffix?: string;
  decimal?: number;
  label: string;
  delay?: number;
}

function StatItem({ value, suffix = '+', decimal = 0, label, delay = 0 }: StatItemProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({
    threshold: 0.3,
    triggerOnce: true,
  });

  const count = useCountUp(isVisible ? value : 0, 2000, 0);

  const formattedValue = decimal > 0 ? count.toFixed(decimal) : Math.floor(count).toLocaleString('en-IN');

  return (
    <div 
      className="stat-item" 
      data-reveal="up" 
      data-delay={delay.toString()} 
      ref={ref}
    >
      <span className="stat-num">
        {formattedValue}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="stats-section section-sm" id="stats">
      <div className="container">
        <div className="stats-grid">
          <StatItem value={5200} suffix="+" label="Stocks Tracked" delay={0} />
          <StatItem value={34} suffix=" Sectors" label="NSE Sectors Covered" delay={100} />
          <StatItem value={28} suffix="ms" label="Avg Signal Delay" delay={200} />
          <StatItem value={99.9} suffix="% Uptime" label="Platform Reliability" delay={300} decimal={1} />
        </div>
      </div>
    </section>
  );
}
