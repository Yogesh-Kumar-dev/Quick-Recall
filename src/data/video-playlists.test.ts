import { describe, expect, it } from 'vitest';

import { extractPlaylistId } from './video-playlists';

describe('extractPlaylistId', () => {
  it('extracts list param from a full YouTube playlist URL', () => {
    expect(extractPlaylistId('https://youtube.com/playlist?list=PLxxxx')).toBe('PLxxxx');
  });

  it('extracts list param from a watch URL with list', () => {
    expect(extractPlaylistId('https://www.youtube.com/watch?v=abc&list=PLyyyy')).toBe('PLyyyy');
  });

  it('extracts from a URL with multiple params', () => {
    expect(extractPlaylistId('https://youtube.com/watch?v=abc&list=PLzzz&si=123')).toBe('PLzzz');
  });

  it('returns null for bare list= without leading ? or &', () => {
    expect(extractPlaylistId('list=PLbare')).toBeNull();
  });

  it('extracts from a string with list in the middle', () => {
    expect(extractPlaylistId('something?foo=bar&list=PLmid&baz=1')).toBe('PLmid');
  });

  it('returns null for completely invalid input', () => {
    expect(extractPlaylistId('not a url at all')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractPlaylistId('')).toBeNull();
  });

  it('returns null when list param is empty', () => {
    expect(extractPlaylistId('https://youtube.com/playlist?list=')).toBeNull();
  });

  it('returns null when list param is whitespace only', () => {
    expect(extractPlaylistId('https://youtube.com/playlist?list=   ')).toBeNull();
  });

  it('trims whitespace from the list param', () => {
    expect(extractPlaylistId('https://youtube.com/playlist?list=  PLtrimmed  ')).toBe('PLtrimmed');
  });
});
