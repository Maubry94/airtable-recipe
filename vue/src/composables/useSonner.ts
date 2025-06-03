import { toast } from "vue-sonner";
import { h } from "vue";

export function useSonner() {
	const JSON_STRINGIFY_INDENT = 2;

	function sonnerDev(title: string, jsonData: Record<string, unknown>) {
		return toast.message(title, {
			description: h(
				"pre",
				{
					class: "mt-2 w-[324px] rounded-md bg-slate-950 p-4 overflow-auto max-h-48",
				},
				h("code", { class: "text-white text-xs block" }, JSON.stringify(jsonData, null, JSON_STRINGIFY_INDENT)),
			),
		});
	}

	return {
		sonnerError: toast.error,
		sonnerMessage: toast.message,
		sonnerWarning: toast.warning,
		sonnerDev,
	};
}
