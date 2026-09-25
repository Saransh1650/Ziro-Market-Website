import type { Metadata } from 'next';
import AlertsView from '@/components/app/AlertsView';
export const metadata: Metadata = { title: 'Price alerts' };
export default function AlertsPage() { return <AlertsView />; }
