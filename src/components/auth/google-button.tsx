import { signInWithGoogleAction } from "@/app/actions/auth";

export function GoogleButton({ label }: { label: string }) {
  return (
    <form action={signInWithGoogleAction}>
      <button
        type="submit"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-lab-navy hover:bg-slate-50"
      >
        {label}
      </button>
    </form>
  );
}
