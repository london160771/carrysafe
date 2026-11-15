import { AppError } from '../core/errors.js';
import { describe, expect, it, vi } from 'vitest';
import { buildCloudRequest } from '../privacy/buildCloudRequest.js';
import { outgoingEntries } from '../privacy/outgoingLog.js';
import { brandSuggest } from './brandSuggest.js';
import { sendCloudRequest } from './cloud.js';

function fakeModel(text, inferenceSource = 'in_cloud') {
  const generateContent = vi.fn(async () => ({ response: { text: () => text, inferenceSource } }));
  return { factory: vi.fn(() => ({ generateContent })), generateContent };
}

describe('sendCloudRequest', () => {
  it('refuses a request that did not come from buildCloudRequest and logs the block', async () => {
    const { factory, generateContent } = fakeModel('{}');
    await expect(sendCloudRequest({ task: 'brand', brand: 'X' }, { modelFactory: factory })).rejects.toMatchObject({ code: 'field_not_allowed' });
    expect(generateContent).not.toHaveBeenCalled();
    expect(outgoingEntries().at(-1)).toMatchObject({ status: 'blocked', payload: null });
  });

  it('sends only the guarded payload and logs it', async () => {
    const { factory, generateContent } = fakeModel('{"ingredients":[]}');
    const request = buildCloudRequest({ task: 'brand', brand: 'Broncholyte' });
    await sendCloudRequest(request, { modelFactory: factory });
    expect(generateContent.mock.calls[0][0]).toContain('Broncholyte');
    expect(outgoingEntries().at(-1)).toMatchObject({ status: 'sent', payload: { task: 'brand', brand: 'Broncholyte' } });
  });

  it('maps SDK failures to cloud_unavailable', async () => {
    const factory = () => ({ generateContent: async () => Promise.reject(new Error('App Check failed')) });
    const request = buildCloudRequest({ task: 'brand', brand: 'X' });
    await expect(sendCloudRequest(request, { modelFactory: factory })).rejects.toMatchObject({ code: 'cloud_unavailable', retryable: true });
  });

  it('passes structured errors such as config_missing through unchanged', async () => {
    const factory = () => {
      throw new AppError('config_missing', 'VITE_FIREBASE_API_KEY');
    };
    await expect(sendCloudRequest(buildCloudRequest({ task: 'brand', brand: 'X' }), { modelFactory: factory })).rejects.toMatchObject({
      code: 'config_missing',
    });
  });

  it('maps non-JSON output to cloud_unavailable', async () => {
    const { factory } = fakeModel('not json');
    await expect(sendCloudRequest(buildCloudRequest({ task: 'brand', brand: 'X' }), { modelFactory: factory })).rejects.toMatchObject({
      code: 'cloud_unavailable',
    });
  });
});

describe('brandSuggest (FR-SCAN-005)', () => {
  it('returns normalised ingredients marked as a suggestion with the real inference source', async () => {
    const { factory } = fakeModel('{"ingredients":[" Bromhexine Hydrochloride "]}');
    await expect(brandSuggest('Broncholyte', { modelFactory: factory })).resolves.toEqual({
      ingredients: ['bromhexine hydrochloride'],
      inferenceSource: 'in_cloud',
      isSuggestion: true,
    });
  });

  it('rejects image data typed into the brand field', async () => {
    await expect(brandSuggest('data:image/png;base64,iVBORw0KGgo')).rejects.toMatchObject({ code: 'image_not_allowed' });
  });
});
