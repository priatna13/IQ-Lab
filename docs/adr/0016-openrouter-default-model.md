# Default OpenRouter model for Insight narration

Insight prose is optional LLM narration bounded by Rule Payload. Soft-launch needs a concrete default so operators do not invent model IDs per environment.

**Decision:** Default chat model is **`openai/gpt-4o-mini`** via OpenRouter (`OPENROUTER_CHAT_MODEL` override allowed). If `OPENROUTER_API_KEY` is unset, always use the template fallback narrator — never fail completion for missing LLM.

**Consequences:** Low cost / latency for Bahasa Indonesia drafting; product copy still cannot invent clusters outside Rule Payload (prompt + template safety net). Changing the default later is an env or small code change, not a domain-model re-grill.
