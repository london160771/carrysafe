import broncholyteBackFr from '../../samples/real/broncholyte-back-fr.jpg?url';
import broncholyteFront from '../../samples/real/broncholyte-front.jpg?url';
import orphesicBlister from '../../samples/real/orphesic-blister.jpg?url';
import methylphenidateLabel from '../../samples/generated/methylphenidate-sample.png?url';
import pseudoephedrineLabel from '../../samples/generated/pseudoephedrine-sample.png?url';

export const SAMPLES = [
  { id: 'broncholyte-front', url: broncholyteFront, truth: 'Broncholyte · bromhexine hydrochloride · 4 mg/5 ml · label cut off on the right' },
  { id: 'broncholyte-back-fr', url: broncholyteBackFr, truth: 'Chlorhydrate de Bromhexine 4 mg / 5 ml (French)' },
  { id: 'orphesic-blister', url: orphesicBlister, truth: 'Orphesic · orphenadrine citrate 35 mg + paracetamol 450 mg' },
  { id: 'pseudoephedrine-sample', url: pseudoephedrineLabel, truth: 'SAMPLE LABEL · pseudoephedrine hydrochloride 60 mg · 24 tablets' },
  { id: 'methylphenidate-sample', url: methylphenidateLabel, truth: 'SAMPLE LABEL · methylphenidate hydrochloride 10 mg · 30 tablets' },
];

export async function loadSample(sample) {
  const response = await fetch(sample.url);
  return response.blob();
}
