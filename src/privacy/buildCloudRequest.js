import { AppError } from '../core/errors.js';
import { containsImageData } from './imageDetection.js';
import { REQUEST_SHAPES } from './requestShapes.js';

const guardedRequests = new WeakSet();

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export function buildCloudRequest(input) {
  if (containsImageData(input)) throw new AppError('image_not_allowed', 'image data in a cloud request');
  if (input === null || typeof input !== 'object' || Array.isArray(input)) throw new AppError('field_not_allowed', 'request must be an object');
  const { task, ...fields } = input;
  const shape = Object.hasOwn(REQUEST_SHAPES, task) ? REQUEST_SHAPES[task] : null;
  if (!shape) throw new AppError('field_not_allowed', `task:${String(task)}`);
  const extra = Object.keys(fields).filter((key) => !Object.hasOwn(shape, key));
  if (extra.length > 0) throw new AppError('field_not_allowed', extra.join(','));
  for (const [key, isValid] of Object.entries(shape)) {
    if (!isValid(fields[key])) throw new AppError('field_not_allowed', `invalid:${key}`);
  }
  const request = deepFreeze(structuredClone({ task, ...fields }));
  guardedRequests.add(request);
  return request;
}

export function isGuardedRequest(request) {
  return guardedRequests.has(request);
}
