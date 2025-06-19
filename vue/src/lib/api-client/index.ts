import { HttpClient, type TransformCodegenRouteToHttpClientRoute } from "@duplojs/http-client";
import type { CodegenRoutes } from "./types/duplojsTypesCodegen";
import { envs } from "@/envs";
import { useLoader } from "@/composables/useLoader";

const {
	isLoading,
	setLoading,
} = useLoader();

export type DuploClientRoute = TransformCodegenRouteToHttpClientRoute<
	CodegenRoutes
>;

export const duploClient = new HttpClient<DuploClientRoute>({
	baseUrl: envs.VITE_API_BASE_URL,
})
	.setDefaultRequestParams({
		mode: "cors",
	})
	.setInterceptor(
		"request",
		(requestDefinition) => {
			if (isLoading.value !== true) {
				setLoading(true);
			}

			return requestDefinition;
		},
	)
	.setInterceptor(
		"response",
		(responseDefinition) => {
			if (isLoading.value === true) {
				setLoading(false);
			}

			return responseDefinition;
		},
	);
