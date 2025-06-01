import { useLocalStorageItem } from "@/composables/useLocalStorageItem";
import { computed } from "vue";

const accessTokenLocalStorageKey = "accessToken";

export function useUserAdminInformation() {
	const accessTokenItem = useLocalStorageItem<string>(accessTokenLocalStorageKey);

	function setAccessToken(accessToken: string) {
		accessTokenItem.value = accessToken;
	}

	function deleteAccessToken() {
		accessTokenItem.value = null;
		localStorage.removeItem(accessTokenLocalStorageKey);
	}

	const isConnected = computed(() => !!accessTokenItem.value);

	return {
		setAccessToken,
		accessTokenItem,
		deleteAccessToken,
		isConnected,
	};
}
