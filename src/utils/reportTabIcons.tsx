import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import CardMembershipOutlined from '@mui/icons-material/CardMembershipOutlined';
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import FitnessCenterOutlined from '@mui/icons-material/FitnessCenterOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';

export type ReportTabId =
  | 'ordenes'
  | 'productos'
  | 'suscripciones'
  | 'asistencias'
  | 'productos-mas-vendidos'
  | 'ventas-por-categoria'
  | 'clases-mas-populares'
  | 'entrenadores-mas-populares';

const icons: Record<ReportTabId, ComponentType<SvgIconProps>> = {
  ordenes: LocalShippingOutlined,
  productos: Inventory2Outlined,
  suscripciones: CardMembershipOutlined,
  asistencias: FactCheckOutlined,
  'productos-mas-vendidos': EmojiEventsOutlined,
  'ventas-por-categoria': CategoryOutlined,
  'clases-mas-populares': FitnessCenterOutlined,
  'entrenadores-mas-populares': PersonOutlineOutlined,
};

export function ReportTabIcon({ tab, ...props }: { tab: ReportTabId } & SvgIconProps) {
  const Icon = icons[tab];
  return <Icon fontSize="small" {...props} />;
}
