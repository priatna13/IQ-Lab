import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { AdminAttemptDetailView } from "@/components/admin/admin-attempt-detail";
import { getAdminSessionUser } from "@/lib/auth/admin";
import { getAdminAttemptDetail } from "@/lib/admin/participant-reports";

type Props = {
  params: Promise<{ attemptId: string }>;
};

export default async function AdminAttemptPage({ params }: Props) {
  const admin = await getAdminSessionUser();
  if (!admin) {
    redirect("/masuk?next=/admin");
  }

  const { attemptId } = await params;
  let detail;
  try {
    detail = await getAdminAttemptDetail(attemptId);
  } catch {
    throw new Error("Gagal memuat detail attempt.");
  }
  if (!detail) notFound();

  return (
    <PageShell width="2xl" orbs="calm">
      <Link
        href="/admin"
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Daftar attempt
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-lab-navy">
        Detail peserta
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Radar, skor 9 domain, session, insight — view admin.
      </p>
      <div className="mt-8">
        <AdminAttemptDetailView detail={detail} />
      </div>
    </PageShell>
  );
}
