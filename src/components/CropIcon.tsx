import type { LucideIcon } from 'lucide-react';
import { Wheat, Sprout, Flower } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = { Wheat, Sprout, Flower };

export function CropIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[name] ?? Sprout;
  return <Icon size={size} className={className} />;
}
