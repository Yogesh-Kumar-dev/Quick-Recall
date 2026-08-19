import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_TOPIC_PREFERENCES, type Topic } from '@/config/topics';
import { getSetting, setSetting } from './settings';
import { get, save } from './topic-preferences';

vi.mock('./settings', () => ({
  getSetting: vi.fn(),
  setSetting: vi.fn()
}));

const mockedGetSetting = vi.mocked(getSetting);
const mockedSetSetting = vi.mocked(setSetting);

describe('topic preferences db', () => {
  beforeEach(() => {
    mockedGetSetting.mockClear();
    mockedSetSetting.mockClear();
  });

  it('returns all-enabled defaults when nothing is stored', async () => {
    mockedGetSetting.mockResolvedValue({});
    await expect(get()).resolves.toEqual(DEFAULT_TOPIC_PREFERENCES);
  });

  it('merges stored prefs over the defaults (forward compatible)', async () => {
    const stored = { ...DEFAULT_TOPIC_PREFERENCES, react: false };
    mockedGetSetting.mockResolvedValue(stored);
    await expect(get()).resolves.toEqual(stored);
  });

  it('never lets an older record or an unknown key disable a topic', async () => {
    const stored = { ['nonexistent-topic' as Topic]: true };
    mockedGetSetting.mockResolvedValue(stored);
    const result = await get();
    for (const topic of Object.keys(DEFAULT_TOPIC_PREFERENCES)) {
      expect(result[topic as Topic]).toBe(true);
    }
  });

  it('persists prefs as-is via save', async () => {
    await save({ ...DEFAULT_TOPIC_PREFERENCES, css: false });
    expect(mockedSetSetting).toHaveBeenCalledWith('topics', {
      ...DEFAULT_TOPIC_PREFERENCES,
      css: false
    });
  });
});
