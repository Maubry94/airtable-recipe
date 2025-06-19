import OpenAI from "openai";
import { envs } from "../../envs";

export const openaiClient = new OpenAI({
	baseURL: envs.OPENAI_BASE_URL,
	apiKey: envs.OPENAI_API_KEY,
});
