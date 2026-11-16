import qrcode from 'qrcode-generator';
import { useMemo } from 'react';

const QUIET_ZONE = 4;
const AUTO_SIZE = 0;

function modulePath(text) {
  const qr = qrcode(AUTO_SIZE, 'L');
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  const parts = [];
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) parts.push(`M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`);
    }
  }
  return { path: parts.join(''), size: count + QUIET_ZONE * 2 };
}

export default function QrCode({ text, label }) {
  const { path, size } = useMemo(() => modulePath(text), [text]);
  return (
    <svg className="cs-qr" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#1f1b16" />
    </svg>
  );
}
