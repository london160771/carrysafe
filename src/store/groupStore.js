const GROUP_KEY = 'group';

export function createGroupStore(kv) {
  return {
    getGroup: async () => (await kv.get(GROUP_KEY)) ?? null,
    setGroup: (group) => kv.set(GROUP_KEY, group),
    clearGroup: () => kv.set(GROUP_KEY, null),
  };
}
