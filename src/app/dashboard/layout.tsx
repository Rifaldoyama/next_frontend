import { DashboardLayout } from '@/components/organisms/DashboardLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
