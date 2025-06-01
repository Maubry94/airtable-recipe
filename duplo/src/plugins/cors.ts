import { OkHttpResponse, type Duplo } from "@duplojs/core";

export function cors(allowOrigin: string) {
	return function(instance: Duplo) {
		instance.hook(
			"beforeSend",
			(_request, response) => {
				response.setHeader(
					"Access-Control-Allow-Origin",
					allowOrigin,
				);
				response.setHeader(
					"Access-Control-Expose-Headers",
					instance.config.keyToInformationInHeaders,
				);
				response.setHeader(
					"Access-Control-Allow-Methods",
					"GET,POST,PATCH,OPTIONS",
				);
			},
		);
		instance.hook(
			"beforeRouteExecution",
			(request) => {
				if (request.method === "OPTIONS") {
					return new OkHttpResponse("cors.allowed").setHeader("Access-Control-Allow-Headers", "authorization,content-type");
				}
			},
		);
	};
}
