import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveVideoId } from './video';

test('extracts YouTube IDs from live and short links', () => {
  assert.equal(
    resolveVideoId({ videoId: null, videoUrl: 'https://www.youtube.com/live/LXvb7VyDK00?feature=share' }),
    'LXvb7VyDK00',
  );
  assert.equal(
    resolveVideoId({ videoId: null, videoUrl: 'https://youtu.be/VDXMFLmBF0U?si=abc' }),
    'VDXMFLmBF0U',
  );
  assert.equal(
    resolveVideoId({ videoId: 'abc123', videoUrl: 'https://example.com/ignored' }),
    'abc123',
  );
});
