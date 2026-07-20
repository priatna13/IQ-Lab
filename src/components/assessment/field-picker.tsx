"use client";

import { useActionState, useMemo, useState } from "react";
import {
  startSkillAttemptAction,
  type StartSkillResult,
} from "@/app/actions/skill-assessment";
import type { FieldCategoryId, FieldId } from "@/domain/assessment/skill/types";
import {
  FIELD_CATEGORIES,
  FIELD_DEFS,
} from "@/domain/assessment/skill/field-catalog";

type Props = {
  sourceAttemptId: string;
  recommendedFieldIds: FieldId[];
  completedFieldIds: FieldId[];
};

const initial: StartSkillResult = { ok: false };

const CATEGORY_ACCENT: Record<FieldCategoryId, string> = {
  teknologi_produk: "from-lab-teal/15 to-lab-sky/10",
  bisnis_keuangan: "from-lab-violet/15 to-lab-mint/20",
  pemasaran_kreatif: "from-orange-100/80 to-lab-mint/30",
  orang_layanan: "from-lab-sky/20 to-lab-mint/40",
  legal: "from-slate-100 to-lab-mist",
};

export function FieldPicker({
  sourceAttemptId,
  recommendedFieldIds,
  completedFieldIds,
}: Props) {
  const [state, formAction, pending] = useActionState(
    startSkillAttemptAction,
    initial,
  );
  const [openCategory, setOpenCategory] = useState<FieldCategoryId | null>(
    () => {
      const rec = FIELD_DEFS.find((f) => recommendedFieldIds.includes(f.id));
      return rec?.categoryId ?? FIELD_CATEGORIES[0]?.id ?? null;
    },
  );
  const [selected, setSelected] = useState<FieldId | "">("");

  const recommendedSet = useMemo(
    () => new Set(recommendedFieldIds),
    [recommendedFieldIds],
  );
  const completedSet = useMemo(
    () => new Set(completedFieldIds),
    [completedFieldIds],
  );

  const recommendedCategories = useMemo(() => {
    const set = new Set<FieldCategoryId>();
    for (const id of recommendedFieldIds) {
      const f = FIELD_DEFS.find((d) => d.id === id);
      if (f) set.add(f.categoryId);
    }
    return set;
  }, [recommendedFieldIds]);

  const selectedDef = selected
    ? FIELD_DEFS.find((f) => f.id === selected)
    : undefined;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="sourceAttemptId" value={sourceAttemptId} />
      <input type="hidden" name="fieldId" value={selected} />

      {recommendedFieldIds.length > 0 ? (
        <div className="lab-card relative overflow-hidden border-lab-teal/20 p-4 sm:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lab-mint/50 to-transparent"
            aria-hidden
          />
          <div className="relative">
            <p className="lab-section-label text-lab-teal-deep">
              Cocok dengan profil Anda
            </p>
            <p className="mt-1 text-sm font-semibold text-lab-navy">
              Rekomendasi role (1–3)
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Berdasarkan kekuatan domain 9-area. Anda tetap bebas memilih role
              lain.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {recommendedFieldIds.map((id, i) => {
                const def = FIELD_DEFS.find((f) => f.id === id);
                if (!def) return null;
                const active = selected === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenCategory(def.categoryId);
                        setSelected(id);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-left text-xs font-medium transition ring-1 ${
                        active
                          ? "bg-lab-teal text-white ring-lab-teal"
                          : "bg-white text-lab-teal-deep ring-lab-teal/25 hover:ring-lab-teal/50"
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-70">
                        #{i + 1}
                      </span>
                      {def.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-sm font-semibold text-lab-navy">
          Atau pilih dari kategori
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          Buka kategori, lalu pilih satu role. Satu sesi = 7 soal MCQ.
        </p>
      </div>

      <div className="space-y-3">
        {FIELD_CATEGORIES.map((cat) => {
          const fields = FIELD_DEFS.filter((f) => f.categoryId === cat.id);
          const isOpen = openCategory === cat.id;
          const catRecommended = recommendedCategories.has(cat.id);
          const doneInCat = fields.filter((f) => completedSet.has(f.id)).length;
          return (
            <div
              key={cat.id}
              className={`lab-card overflow-hidden transition ${
                catRecommended ? "ring-2 ring-lab-teal/25" : ""
              } ${isOpen ? "shadow-md" : ""}`}
            >
              <button
                type="button"
                className={`flex w-full items-start justify-between gap-3 bg-gradient-to-r px-4 py-3.5 text-left ${CATEGORY_ACCENT[cat.id]}`}
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                aria-expanded={isOpen}
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-lab-navy">
                      {cat.label}
                    </span>
                    {catRecommended ? (
                      <span className="lab-badge bg-white/90 text-[10px] text-lab-teal-deep ring-1 ring-lab-teal/20">
                        Ada rekomendasi
                      </span>
                    ) : null}
                    {doneInCat > 0 ? (
                      <span className="lab-badge bg-white/80 text-[10px] text-slate-600">
                        {doneInCat}/{fields.length} selesai
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    {cat.shortBlurb} · {fields.length} role
                  </span>
                </span>
                <span
                  className={`mt-0.5 shrink-0 rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold text-lab-teal transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {isOpen ? (
                <ul className="space-y-2 border-t border-slate-100/80 bg-white px-3 py-3">
                  {fields.map((field) => {
                    const done = completedSet.has(field.id);
                    const rec = recommendedSet.has(field.id);
                    const active = selected === field.id;
                    return (
                      <li key={field.id}>
                        <label
                          className={`lab-choice ${active ? "lab-choice-selected" : ""} ${
                            done ? "cursor-not-allowed opacity-65" : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="radio"
                            name="field_select"
                            value={field.id}
                            disabled={done}
                            checked={active}
                            onChange={() => setSelected(field.id)}
                            className="mt-1 shrink-0"
                          />
                          <span className="min-w-0 text-sm">
                            <span className="font-medium text-lab-navy">
                              {field.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                              {field.shortBlurb}
                            </span>
                            <span className="mt-1.5 flex flex-wrap gap-1.5">
                              {rec ? (
                                <span className="lab-badge bg-lab-mint/80 text-lab-teal-deep">
                                  Direkomendasikan
                                </span>
                              ) : null}
                              {done ? (
                                <span className="lab-badge bg-slate-100 text-slate-600">
                                  Sudah selesai
                                </span>
                              ) : (
                                <span className="lab-badge bg-lab-mist text-slate-600">
                                  7 soal · ±12 mnt
                                </span>
                              )}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      {selectedDef ? (
        <div className="rounded-xl bg-lab-mist/90 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-100">
          Dipilih:{" "}
          <span className="font-semibold text-lab-navy">{selectedDef.label}</span>
        </div>
      ) : null}

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !selected || completedSet.has(selected as FieldId)}
        className="lab-btn-primary lab-btn-block w-full"
      >
        {pending
          ? "Memulai…"
          : selectedDef
            ? `Mulai: ${selectedDef.label}`
            : "Pilih role dulu"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Pilihan ganda · kunci objektif · bukan sertifikasi industri
      </p>
    </form>
  );
}
