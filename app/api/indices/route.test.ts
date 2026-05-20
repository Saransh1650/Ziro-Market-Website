import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/indices', () => {
  it('returns 4 indices', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json).toHaveLength(4);
    expect(json[0]).toHaveProperty('symbol');
  });
});
