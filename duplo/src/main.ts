import "@duplojs/node";
import { Duplo, useProcessBuilder, useRouteBuilder } from "@duplojs/core";
import { envs } from "./envs";
import "./routes";
import { cors } from "./plugins/cors";

const duplo = new Duplo({
	environment: envs.ENVIRONMENT,
	host: envs.HOST,
	port: envs.PORT,
	plugins: [cors(envs.CORS_ALLOW_ORIGIN)],
});

const { host, port } = duplo.config;

duplo.register(
	...useProcessBuilder.getAllCreatedProcess(),
	...useRouteBuilder.getAllCreatedRoute(),
);

await duplo
	.launch()
	.then(
		() => void console.log(`Duplo is running on http://${host}:${port}`),
	);
