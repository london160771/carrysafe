import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from 'firebase/ai';
import { getFirebaseApp } from '../firebase/app.js';

export const CLOUD_MODEL = 'gemini-3.5-flash-lite';

const IMAGE_INPUT = { expectedInputs: [{ type: 'image' }, { type: 'text' }] };

function getAppAI() {
  return getAI(getFirebaseApp(), { backend: new GoogleAIBackend() });
}

export const ON_DEVICE_IMAGE_PARAMS = Object.freeze({
  mode: InferenceMode.ONLY_ON_DEVICE,
  onDeviceParams: { createOptions: IMAGE_INPUT },
});

export function onDeviceImageModel() {
  return getGenerativeModel(getAppAI(), ON_DEVICE_IMAGE_PARAMS);
}

export function cloudModel(generationConfig) {
  return getGenerativeModel(getAppAI(), {
    mode: InferenceMode.ONLY_IN_CLOUD,
    inCloudParams: { model: CLOUD_MODEL, generationConfig },
  });
}

export function preferCloudModel(generationConfig) {
  return getGenerativeModel(getAppAI(), {
    mode: InferenceMode.PREFER_IN_CLOUD,
    inCloudParams: { model: CLOUD_MODEL, generationConfig },
  });
}
