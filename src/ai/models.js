import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from 'firebase/ai';
import { getFirebaseApp } from '../firebase/app.js';

export const CLOUD_MODEL = 'gemini-2.5-flash';

const IMAGE_INPUT = { expectedInputs: [{ type: 'image' }, { type: 'text' }] };

function getAppAI() {
  return getAI(getFirebaseApp(), { backend: new GoogleAIBackend() });
}

export function onDeviceImageModel() {
  return getGenerativeModel(getAppAI(), {
    mode: InferenceMode.ONLY_ON_DEVICE,
    onDeviceParams: { createOptions: IMAGE_INPUT },
  });
}

export function cloudModel(generationConfig) {
  return getGenerativeModel(getAppAI(), {
    mode: InferenceMode.ONLY_IN_CLOUD,
    inCloudParams: { model: CLOUD_MODEL, generationConfig },
  });
}

export function preferCloudModel() {
  return getGenerativeModel(getAppAI(), {
    mode: InferenceMode.PREFER_IN_CLOUD,
    inCloudParams: { model: CLOUD_MODEL },
  });
}
