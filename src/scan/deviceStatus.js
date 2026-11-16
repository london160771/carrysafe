export const USABLE_STATES = Object.freeze(['available', 'downloadable', 'downloading']);

export function describeDeviceStatus(availability) {
  if (USABLE_STATES.includes(availability)) {
    return { usable: true, reason: availability === 'available' ? '' : 'The reading model downloads first. This can take a few minutes.' };
  }
  if (availability === 'unsupported') {
    return { usable: false, reason: 'It needs desktop Chrome 139 or newer. You can type the name instead.' };
  }
  return { usable: false, reason: 'This computer can’t run the reading model. You can type the name instead.' };
}
