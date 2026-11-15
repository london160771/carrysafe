export const EMULATOR_HOST = '127.0.0.1';
export const FIRESTORE_EMULATOR_PORT = 8080;
export const AUTH_EMULATOR_PORT = 9099;

export function usesEmulators(env) {
  return env.VITE_USE_EMULATORS === 'true';
}
