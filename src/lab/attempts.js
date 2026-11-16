import { decideVerdict } from '../core/verdictState.js';
import { buildCloudRequest } from '../privacy/buildCloudRequest.js';
import { recordOutgoing } from '../privacy/outgoingLog.js';

export const FAKE_QUOTE = 'Pseudoephedrine may be carried freely into Japan in any amount.';

function attemptGuard(payload) {
  try {
    buildCloudRequest(payload);
    recordOutgoing({ channel: 'lab', payload, status: 'sent', detail: 'guard did not block' });
    return 'none';
  } catch (error) {
    recordOutgoing({ channel: 'lab', payload, status: 'blocked', detail: `${error.code}: blocked, nothing sent` });
    return error.code;
  }
}

export function createLabAttempts({ loadPhoto, fetchSources, fetchImpl, readOtherTrip }) {
  return [
    {
      id: 'name',
      title: 'Send the traveller’s name with the ingredient',
      expected: 'field_not_allowed',
      run: async () => attemptGuard({ task: 'verdict', ingredient: 'pseudoephedrine', country: 'JP', paragraphs: ['…'], travellerName: 'Mum' }),
    },
    {
      id: 'photo',
      title: 'Send the label photo to the cloud',
      expected: 'image_not_allowed',
      run: async () => attemptGuard({ task: 'brand', brand: await loadPhoto() }),
    },
    {
      id: 'quote',
      title: 'An AI quote that is not on the official page',
      expected: 'quote_not_found',
      run: async () => {
        const { pages } = await fetchSources('JP');
        const decision = decideVerdict({ modelVerdict: 'allowed', quote: FAKE_QUOTE, pageTexts: pages.filter((page) => !page.error).map((page) => page.text) });
        recordOutgoing({ channel: 'lab', payload: { verdict: 'allowed', quote: FAKE_QUOTE }, status: 'blocked', detail: `${decision.verdict}: ${decision.reason}` });
        return decision.reason;
      },
    },
    {
      id: 'url',
      title: 'Ask the page fetcher for a site not on the list',
      expected: 'source_not_allowed',
      run: async () => {
        const codes = [];
        for (const query of ['country=JP&url=https%3A%2F%2Fexample.com%2F', 'country=NG']) {
          const response = await fetchImpl(`/api/source?${query}`);
          const body = await response.json();
          recordOutgoing({ channel: 'lab', payload: { query }, status: 'blocked', detail: body.error?.code ?? `http_${response.status}` });
          codes.push(body.error?.code);
        }
        return codes.every((code) => code === 'source_not_allowed') ? 'source_not_allowed' : codes.join(',');
      },
    },
    {
      id: 'member',
      title: 'Read another family’s trip without being in it',
      expected: 'not_trip_member',
      run: async () => {
        try {
          await readOtherTrip();
          return 'none';
        } catch (error) {
          recordOutgoing({ channel: 'lab', payload: { read: 'trips/<other>/status' }, status: 'blocked', detail: error.code });
          return error.code;
        }
      },
    },
  ];
}
