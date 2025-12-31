/**
 * Lucide icon resolver using an explicit allowlist.
 * 
 * DO NOT use `import * as LucideIcons from 'lucide-react'` — it pulls the entire icon set
 * (1600+ icons) into the module graph and destroys Next.js dev compile times.
 * 
 * Instead, we maintain an explicit allowlist of icons that can be used in forms.
 * If a new icon is needed, add it to the ICONS map below.
 */
'use client';

import React from 'react';

// Common form/input icons
import FileText from 'lucide-react/dist/esm/icons/file-text';
import File from 'lucide-react/dist/esm/icons/file';
import Folder from 'lucide-react/dist/esm/icons/folder';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open';
import Clipboard from 'lucide-react/dist/esm/icons/clipboard';
import ClipboardList from 'lucide-react/dist/esm/icons/clipboard-list';
import ClipboardCheck from 'lucide-react/dist/esm/icons/clipboard-check';

// User/people icons
import User from 'lucide-react/dist/esm/icons/user';
import Users from 'lucide-react/dist/esm/icons/users';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import UserMinus from 'lucide-react/dist/esm/icons/user-minus';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import UserX from 'lucide-react/dist/esm/icons/user-x';
import Contact from 'lucide-react/dist/esm/icons/contact';

// Communication icons
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Send from 'lucide-react/dist/esm/icons/send';

// Common action icons
import Plus from 'lucide-react/dist/esm/icons/plus';
import Minus from 'lucide-react/dist/esm/icons/minus';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Edit from 'lucide-react/dist/esm/icons/edit';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Trash from 'lucide-react/dist/esm/icons/trash';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Save from 'lucide-react/dist/esm/icons/save';
import Search from 'lucide-react/dist/esm/icons/search';
import Filter from 'lucide-react/dist/esm/icons/filter';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Cog from 'lucide-react/dist/esm/icons/cog';
import Refresh from 'lucide-react/dist/esm/icons/refresh-cw';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Download from 'lucide-react/dist/esm/icons/download';
import Upload from 'lucide-react/dist/esm/icons/upload';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

// Navigation icons
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down';
import Home from 'lucide-react/dist/esm/icons/home';
import Menu from 'lucide-react/dist/esm/icons/menu';

// Status/feedback icons
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Info from 'lucide-react/dist/esm/icons/info';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';

// Business/finance icons
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Building from 'lucide-react/dist/esm/icons/building';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import Handshake from 'lucide-react/dist/esm/icons/handshake';
import Receipt from 'lucide-react/dist/esm/icons/receipt';
import Package from 'lucide-react/dist/esm/icons/package';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Store from 'lucide-react/dist/esm/icons/store';

// Date/time icons
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import CalendarDays from 'lucide-react/dist/esm/icons/calendar-days';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Timer from 'lucide-react/dist/esm/icons/timer';

// Location icons
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Map from 'lucide-react/dist/esm/icons/map';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Navigation from 'lucide-react/dist/esm/icons/navigation';

// Charts/analytics icons
import BarChart from 'lucide-react/dist/esm/icons/bar-chart';
import BarChart2 from 'lucide-react/dist/esm/icons/bar-chart-2';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import LineChart from 'lucide-react/dist/esm/icons/line-chart';
import PieChart from 'lucide-react/dist/esm/icons/pie-chart';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down';
import Activity from 'lucide-react/dist/esm/icons/activity';

// UI/layout icons
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Layout from 'lucide-react/dist/esm/icons/layout';
import Layers from 'lucide-react/dist/esm/icons/layers';
import Grid from 'lucide-react/dist/esm/icons/grid';
import List from 'lucide-react/dist/esm/icons/list';
import Table from 'lucide-react/dist/esm/icons/table';
import Table2 from 'lucide-react/dist/esm/icons/table-2';
import Columns from 'lucide-react/dist/esm/icons/columns';
import Rows from 'lucide-react/dist/esm/icons/rows';

// Favorites/rating icons
import Heart from 'lucide-react/dist/esm/icons/heart';
import Star from 'lucide-react/dist/esm/icons/star';
import ThumbsUp from 'lucide-react/dist/esm/icons/thumbs-up';
import ThumbsDown from 'lucide-react/dist/esm/icons/thumbs-down';

// Security icons
import Lock from 'lucide-react/dist/esm/icons/lock';
import Unlock from 'lucide-react/dist/esm/icons/unlock';
import Shield from 'lucide-react/dist/esm/icons/shield';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Key from 'lucide-react/dist/esm/icons/key';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';

// Link/connection icons
import Link from 'lucide-react/dist/esm/icons/link';
import Link2 from 'lucide-react/dist/esm/icons/link-2';
import Unlink from 'lucide-react/dist/esm/icons/unlink';
import Workflow from 'lucide-react/dist/esm/icons/workflow';

// Misc commonly used icons
import Tag from 'lucide-react/dist/esm/icons/tag';
import Tags from 'lucide-react/dist/esm/icons/tags';
import Hash from 'lucide-react/dist/esm/icons/hash';
import AtSign from 'lucide-react/dist/esm/icons/at-sign';
import Flag from 'lucide-react/dist/esm/icons/flag';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Bell from 'lucide-react/dist/esm/icons/bell';
import BellOff from 'lucide-react/dist/esm/icons/bell-off';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import MoreHorizontal from 'lucide-react/dist/esm/icons/more-horizontal';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Percent from 'lucide-react/dist/esm/icons/percent';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import FolderKanban from 'lucide-react/dist/esm/icons/folder-kanban';

export type LucideIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}>;

// Allowlist of icons - add new icons here as needed
const ICONS: Record<string, LucideIconComponent> = {
  // Form/file icons
  FileText,
  File,
  Folder,
  FolderOpen,
  FolderKanban,
  Clipboard,
  ClipboardList,
  ClipboardCheck,
  
  // User/people icons
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Contact,
  
  // Communication icons
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,
  
  // Common action icons
  Plus,
  Minus,
  Check,
  X,
  Edit,
  Edit2,
  Edit3,
  Trash,
  Trash2,
  Save,
  Search,
  Filter,
  Settings,
  Cog,
  Refresh,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  
  // Navigation icons
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Home,
  Menu,
  
  // Status/feedback icons
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  XCircle,
  
  // Business/finance icons
  DollarSign,
  CreditCard,
  Briefcase,
  Building,
  Building2,
  Handshake,
  Receipt,
  Package,
  ShoppingCart,
  Store,
  
  // Date/time icons
  Calendar,
  CalendarDays,
  Clock,
  Timer,
  
  // Location icons
  MapPin,
  Map,
  Globe,
  Navigation,
  
  // Charts/analytics icons
  BarChart,
  BarChart2,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  
  // UI/layout icons
  LayoutDashboard,
  Layout,
  Layers,
  Grid,
  List,
  Table,
  Table2,
  Columns,
  Rows,
  
  // Favorites/rating icons
  Heart,
  Star,
  ThumbsUp,
  ThumbsDown,
  
  // Security icons
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  
  // Link/connection icons
  Link,
  Link2,
  Unlink,
  Workflow,
  
  // Misc commonly used icons
  Tag,
  Tags,
  Hash,
  AtSign,
  Flag,
  Bookmark,
  Bell,
  BellOff,
  Loader2,
  MoreHorizontal,
  MoreVertical,
  Copy,
  Percent,
  Share2,
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
        `Add it to forms/src/utils/lucide-allowlist.tsx or use a different icon.`
    );
  }
  return Icon;
}

/**
 * Get list of available icon names for documentation/UI
 */
export function getAvailableIcons(): string[] {
  return Object.keys(ICONS).sort();
}
