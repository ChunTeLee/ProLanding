import ProviderIcon from "./ProviderIcon.svelte";

interface ProviderInfo {
  prettyName: string;
  icon: { default: any };
}

const makeProvider = (prettyName: string): ProviderInfo => ({
  prettyName,
  icon: { default: ProviderIcon },
});

export const PROVIDERS_INFO: Record<string, ProviderInfo> = {
  "groq": makeProvider("Groq"),
  "together": makeProvider("Together"),
  "hyperbolic": makeProvider("Hyperbolic"),
  "fal-ai": makeProvider("Fal AI"),
  "sambanova": makeProvider("SambaNova"),
  "replicate": makeProvider("Replicate"),
  "cerebras": makeProvider("Cerebras"),
  "fireworks-ai": makeProvider("Fireworks AI"),
};
