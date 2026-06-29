import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Kitty on Top Bartending admin dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Internal"
          title="Admin"
          description="Manage the planning calendar and review incoming event inquiries."
          align="left"
          className="mb-10"
        />
        <AdminDashboard />
      </div>
    </div>
  );
}
