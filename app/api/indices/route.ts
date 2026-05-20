import { NextResponse } from 'next/server';
import { STATIC_INDICES } from '@/lib/marketData';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(STATIC_INDICES, {
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}
