import type { RulePayload } from "@/domain/assessment/career-rules";
import type { InsightNarration } from "@/domain/assessment/insight-template";

/**
 * Optional OpenRouter narration. Requires OPENROUTER_API_KEY.
 * Never invents clusters outside the provided Rule Payload JSON.
 */
export async function narrateInsightWithOpenRouter(
  payload: RulePayload,
): Promise<InsightNarration> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const model =
    process.env.OPENROUTER_CHAT_MODEL ?? "openai/gpt-4o-mini";
  const baseUrl =
    process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  const system = `Anda menuliskan insight asesmen IQ-Lab dalam Bahasa Indonesia.
Aturan ketat:
- Hanya gunakan klaster, skill, dan domain yang ada di JSON Rule Payload.
- Jangan menambah klaster/role baru.
- Jangan klaim diagnosis klinis, tes IST resmi, atau kelulusan rekrutmen.
- Nada: ${payload.track === "explore" ? "eksploratif dan mendukung" : "praktis, prioritas, berorientasi skill gap"}.
- Output JSON murni: {"insightProse":"...","actionPlanProse":"..."}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "IQ-Lab",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Tulis insight dan action plan dari payload berikut:\n${JSON.stringify(payload)}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(raw) as {
    insightProse?: string;
    actionPlanProse?: string;
  };

  if (!parsed.insightProse || !parsed.actionPlanProse) {
    throw new Error("LLM response missing fields");
  }

  return {
    insightProse: parsed.insightProse,
    actionPlanProse: parsed.actionPlanProse,
    source: "llm",
  };
}
