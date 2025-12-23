/**
 * Hard-fail Lucide icon resolver using a small allowlist.
 *
 * DO NOT use `import * as LucideIcons from 'lucide-react'` — it pulls the entire icon set
 * into the module graph and destroys Next.js dev compile times.
 */
'use client';

import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Building,
  Building2,
  Calendar,
  ChartBar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  ClipboardList,
  Clock,
  Cog,
  FileText,
  Filter,
  FolderKanban,
  Gamepad2,
  Heart,
  Home,
  Key,
  Layers,
  LayoutDashboard,
  Link2,
  List,
  ListChecks,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Music,
  Package,
  Palette,
  Plug,
  Rocket,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  UsersRound,
  Workflow,
  Wrench,
  DollarSign,
} from 'lucide-react';

export type LucideIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}>;

const ICONS: Record<string, LucideIconComponent> = {
  Activity,
  BarChart3,
  BookOpen,
  Building,
  Building2,
  Calendar,
  ChartBar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  ClipboardList,
  Clock,
  Cog,
  DollarSign,
  FileText,
  Filter,
  FolderKanban,
  Gamepad2,
  Heart,
  Home,
  Key,
  Layers,
  LayoutDashboard,
  Link2,
  List,
  ListChecks,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Music,
  Package,
  Palette,
  Plug,
  Rocket,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  UsersRound,
  Workflow,
  Wrench,
};

function toPascalFromKebab(name: string): string {
  return String(name || '')
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function normalizeKey(name: string): string {
  const raw = String(name || '').trim();
  if (!raw) return '';
  const val = raw.includes(':') ? raw.split(':', 2)[1] : raw;
  if (!val) return '';
  return val.includes('-') || val.includes('_') || val.includes(' ') ? toPascalFromKebab(val) : val;
}

export function resolveLucideIconStrict(name?: string | null): LucideIconComponent {
  const key = normalizeKey(String(name || '').trim());
  if (!key) {
    throw new Error(`[hit-feature-pack-forms] Lucide icon name is empty`);
  }
  const Icon = ICONS[key];
  if (!Icon) {
    throw new Error(
      `[hit-feature-pack-forms] Unknown Lucide icon "${name}" (normalized: "${key}"). ` +
        `Add it to forms/src/utils/lucide-allowlist.tsx or fix the config.`
    );
  }
  return Icon;
}


