import { useLocalStorageItem } from "@/composables/useLocalStorageItem";

const lastRecipeTransactionIdLocalStorageKey = "lastRecipeTransactionId";

export function uselastRecipeTransactionIdLocalStorage() {
	const lastRecipeTransactionId = useLocalStorageItem<string>(lastRecipeTransactionIdLocalStorageKey);

	function setRecipeTransactionId(accessToken: string) {
		lastRecipeTransactionId.value = accessToken;
	}

	function deleteLastRecipeTransactionId() {
		lastRecipeTransactionId.value = null;
		localStorage.removeItem(lastRecipeTransactionIdLocalStorageKey);
	}

	return {
		setRecipeTransactionId,
		lastRecipeTransactionId,
		deleteLastRecipeTransactionId,
	};
}
