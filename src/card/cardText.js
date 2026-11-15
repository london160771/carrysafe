export const CARD_ENGLISH = Object.freeze({
  heading: 'Medicines I am carrying for my personal use',
  purpose: 'These medicines are for my own medical treatment only. They are not for sale or for anyone else.',
});

export const UNKNOWN_QUANTITY = 'quantity not stated';

export function cardItems(meds) {
  return meds
    .filter((med) => med.confirmed)
    .map((med) => ({
      genericName: med.ingredients.join(' + '),
      quantity: [med.strength, med.quantity].filter(Boolean).join(', ') || UNKNOWN_QUANTITY,
    }));
}
