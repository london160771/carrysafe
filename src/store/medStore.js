const MEDS_KEY = 'meds';
const TRAVELLER_KEY = 'travellerName';

export function createMedStore(kv) {
  const listMeds = async () => (await kv.get(MEDS_KEY)) ?? [];
  return {
    listMeds,
    async saveMed(medicine) {
      if (!medicine.confirmed) throw new RangeError('Only confirmed medicines are saved');
      const meds = (await listMeds()).filter((item) => item.id !== medicine.id);
      await kv.set(MEDS_KEY, [...meds, medicine]);
      return medicine;
    },
    async removeMed(id) {
      await kv.set(MEDS_KEY, (await listMeds()).filter((item) => item.id !== id));
    },
    getTravellerName: async () => (await kv.get(TRAVELLER_KEY)) ?? '',
    setTravellerName: (name) => kv.set(TRAVELLER_KEY, name),
  };
}
