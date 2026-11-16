import { AppError } from '../core/errors.js';
import { isGuardedRequest } from '../privacy/buildCloudRequest.js';
import { recordOutgoing } from '../privacy/outgoingLog.js';
import { cloudModel } from './models.js';
import { CLOUD_PROMPTS } from './prompts.js';

const APP_CHECK_FAILURE = /app.?check/i;

export async function sendCloudRequest(request, { schema, modelFactory = cloudModel }) {
  if (!isGuardedRequest(request)) {
    recordOutgoing({ channel: 'cloud-ai', payload: null, status: 'blocked', detail: 'field_not_allowed' });
    throw new AppError('field_not_allowed', 'request was not built by buildCloudRequest');
  }
  const buildPrompt = CLOUD_PROMPTS[request.task];
  if (!buildPrompt) throw new AppError('field_not_allowed', `no prompt for task:${request.task}`);
  recordOutgoing({ channel: 'cloud-ai', payload: request, status: 'sent' });
  let response;
  try {
    const model = modelFactory({ responseMimeType: 'application/json', responseSchema: schema });
    ({ response } = await model.generateContent(buildPrompt(request)));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(APP_CHECK_FAILURE.test(error.message) ? 'cloud_not_allowed' : 'cloud_unavailable', error.message);
  }
  try {
    return { json: JSON.parse(response.text()), inferenceSource: response.inferenceSource ?? null };
  } catch {
    throw new AppError('cloud_unavailable', 'model output was not JSON');
  }
}
