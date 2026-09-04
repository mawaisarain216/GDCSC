import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Palette,
  ListTree,
  Megaphone,
  CalendarDays,
  Images,
  FolderOpen,
  Building2,
  GraduationCap,
  Users,
  Award,
  ClipboardList,
  FormInput,
  Inbox,
  Mail,
  Settings,
  Presentation,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Website",
    items: [
      { label: "Content", href: "/admin/content", icon: FileText },
      { label: "Appearance", href: "/admin/appearance", icon: Palette },
      { label: "Menus", href: "/admin/menus", icon: ListTree },
    ],
  },
  {
    label: "Posts",
    items: [
      { label: "Notices", href: "/admin/posts/notices", icon: Megaphone },
      { label: "News & Events", href: "/admin/posts/news-events", icon: CalendarDays },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Homepage Slider", href: "/admin/media/slides", icon: Presentation },
      { label: "Gallery", href: "/admin/media/gallery", icon: Images },
      { label: "Documents", href: "/admin/media/documents", icon: FolderOpen },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Departments", href: "/admin/academics/departments", icon: Building2 },
      { label: "Programs", href: "/admin/academics/programs", icon: GraduationCap },
      { label: "Faculty", href: "/admin/academics/faculty", icon: Users },
      { label: "Achievements", href: "/admin/academics/achievements", icon: Award },
    ],
  },
  {
    label: "Admissions",
    items: [
      { label: "Programs & Seats", href: "/admin/admissions/programs", icon: ClipboardList },
      { label: "Form Fields", href: "/admin/admissions/form-fields", icon: FormInput },
      { label: "Applications", href: "/admin/admissions/applications", icon: Inbox },
    ],
  },
  {
    label: "",
    items: [
      { label: "Contact Messages", href: "/admin/messages", icon: Mail },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];
