// Edge-safe stub for 'process' to satisfy libraries accidentally pulled into middleware.
// Provides minimal properties some logging libs might touch; values are inert.
export const env = {} as Record<string, string>;
export const argv: string[] = [];
export const versions = {} as Record<string, string>;
export const pid = 0;
export const platform = 'edge';
export const cwd = () => '/';
export const uptime = () => 0;
export const nextTick = (cb: Function, ...args: any[]) => Promise.resolve().then(() => cb(...args));

export default { env, argv, versions, pid, platform, cwd, uptime, nextTick };
