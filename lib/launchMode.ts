export type LaunchMode = 'waitlist' | 'launched';

export function getLaunchMode(): LaunchMode {
  return process.env.NEXT_PUBLIC_LAUNCH_MODE === 'launched' ? 'launched' : 'waitlist';
}
export const isLaunched = (): boolean => getLaunchMode() === 'launched';
export const isWaitlist = (): boolean => getLaunchMode() === 'waitlist';
