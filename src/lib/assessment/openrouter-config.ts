/** Default OpenRouter chat model (ADR 0016). Override with OPENROUTER_CHAT_MODEL. */
export const DEFAULT_OPENROUTER_CHAT_MODEL = "openai/gpt-4o-mini";

export const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export function getOpenRouterChatModel(): string {
  return (
    process.env.OPENROUTER_CHAT_MODEL?.trim() || DEFAULT_OPENROUTER_CHAT_MODEL
  );
}
