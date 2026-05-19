import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getLaunchMode, isLaunched, isWaitlist } from './launchMode';

const original = process.env.NEXT_PUBLIC_LAUNCH_MODE;
beforeEach(() => { delete process.env.NEXT_PUBLIC_LAUNCH_MODE; });
afterEach(() => { process.env.NEXT_PUBLIC_LAUNCH_MODE = original; });

describe('launchMode', () => {
  it('defaults to waitlist when env not set', () => {
    expect(getLaunchMode()).toBe('waitlist');
    expect(isWaitlist()).toBe(true);
    expect(isLaunched()).toBe(false);
  });
  it('returns launched when env is "launched"', () => {
    process.env.NEXT_PUBLIC_LAUNCH_MODE = 'launched';
    expect(getLaunchMode()).toBe('launched');
    expect(isLaunched()).toBe(true);
    expect(isWaitlist()).toBe(false);
  });
  it('falls back to waitlist on unknown values', () => {
    process.env.NEXT_PUBLIC_LAUNCH_MODE = 'banana';
    expect(getLaunchMode()).toBe('waitlist');
  });
});
