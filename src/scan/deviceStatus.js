export const USABLE_STATES = Object.freeze(['available', 'downloadable', 'downloading']);

export function describeDeviceStatus(availability) {
  if (USABLE_STATES.includes(availability)) {
    return { usable: true, reason: availability === 'available' ? '' : 'The on-device model will download first. This can take a few minutes.' };
  }
  if (availability === 'unsupported') {
    return { usable: false, reason: 'Scanning needs desktop Chrome 139+ with the on-device model. You can type the medicine instead.' };
  }
  return { usable: false, reason: 'The on-device model is not available on this computer. You can type the medicine instead.' };
}
