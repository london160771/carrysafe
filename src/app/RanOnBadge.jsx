import { Cloud, Laptop } from 'lucide-react';

const LABELS = {
  on_device: { text: 'Ran on: this device · free · private', Icon: Laptop },
  in_cloud: { text: 'Ran on: cloud', Icon: Cloud },
};

export default function RanOnBadge({ inferenceSource }) {
  const label = LABELS[inferenceSource];
  if (!label) return null;
  const { Icon, text } = label;
  return (
    <span className="cs-tag">
      <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
      {text}
    </span>
  );
}
