const LABELS = {
  on_device: { text: 'Ran on: this device · free · private', className: 'text-bg-success' },
  in_cloud: { text: 'Ran on: cloud', className: 'text-bg-primary' },
};

export default function RanOnBadge({ inferenceSource }) {
  const label = LABELS[inferenceSource];
  if (!label) return null;
  return <span className={`badge ${label.className}`}>{label.text}</span>;
}
