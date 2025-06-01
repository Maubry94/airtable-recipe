import { type WatchHandle, type Ref, watch, ref } from "vue";

const storageItems: Record<string, Ref> = {};

const watcherStorageItems = new WeakMap<Ref, WatchHandle>();

export function useLocalStorageItem<
	GenericType extends unknown,
>(
	key: string,
): Ref<GenericType | null> {
	const itemRef = storageItems[key] ?? ref<GenericType | null>(
		JSON.parse(localStorage.getItem(key) ?? "null") as GenericType | null,
	);

	if (!storageItems[key]) {
		storageItems[key] = itemRef;
	}

	if (!watcherStorageItems.has(itemRef)) {
		watcherStorageItems.set(
			itemRef,
			watch(
				itemRef,
				(value) => {
					localStorage.setItem(key, JSON.stringify(value));
				},
				{
					deep: true,
				},
			),
		);
	}

	return itemRef;
}
