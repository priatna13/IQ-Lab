import { describe, expect, it } from 'vitest';
import { isAccessTokenUsable, getJwtExpSeconds, readJwtSub } from './jwt';

function makeJwt(payload: Record<string, unknown>) {
  const h = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return h + '.' + p + '.sig';
}

describe('jwt helpers', () => {
  it('reads exp and sub', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const t = makeJwt({ sub: 'user-1', exp });
    expect(getJwtExpSeconds(t)).toBe(exp);
    expect(readJwtSub(t)).toBe('user-1');
    expect(isAccessTokenUsable(t)).toBe(true);
  });
  it('detects expired', () => {
    const t = makeJwt({ sub: 'u', exp: Math.floor(Date.now() / 1000) - 10 });
    expect(isAccessTokenUsable(t)).toBe(false);
  });
});
