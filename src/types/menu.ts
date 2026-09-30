import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface DashboardSidebarProps {
  userRole?: 'customer' | 'agent' | 'admin' | 'company';
  activeItem?: string;
  onMenuClick?: (itemName: string) => void;
}

export interface MenuItem {
  name: string;
  icon: LucideIcon | (() => ReactNode);
  path?: string;  
  hasDropdown?: boolean;
}