import { envs } from "@/envs";
import { ref } from "vue";
import { z, type ZodRawShape } from "zod";
import { useLoader } from "./useLoader";

interface AirtableResponseAPI {
	records: {
		id: string;
		fields: Record<string, unknown>;
		createdTime: string;
	}[];
}

interface AirtableError {
	error: {
		type: string;
		message: string;
		statusCode: number;
	};
}

class AirtableResponseError extends Error {
	public constructor({ error }: AirtableError) {
		super(error.message);
		this.name = `AirtableResponseError[${error.type}]`;
	}
}

type AirtableTableNames = "Recipe" | "Ingredient" | "Intolerances";

function createAirtableFilters(filters: object) {
	const firstLoopIndex = 0;
	const oneItem = 1;

	const queryFiltersEntries = Object.entries(filters);
	const moreThanOneItem = queryFiltersEntries.length > oneItem;

	const airtableFilter = queryFiltersEntries
		.map(
			(
				[key, value],
				index,
			) => {
				if (!moreThanOneItem) {
					return `AND({${key}}="${value}")`;
				} else if (index === firstLoopIndex) {
					return `AND({${key}}="${value}"`;
				} else {
					return `,{${key}}="${value}")`;
				}
			},
		).join("");

	return airtableFilter;
}

export function useGetFetchAirtable<
	GenericTableName extends AirtableTableNames = AirtableTableNames,
	GenericColumnDefinitions extends ZodRawShape = ZodRawShape,
>(
	tableName: GenericTableName,
	columnDefinitions: GenericColumnDefinitions,
	queryFilters?: {
		[Prop in keyof GenericColumnDefinitions]?: z.infer<GenericColumnDefinitions[Prop]>;
	},
) {
	const {
		isLoading,
		setLoading,
	} = useLoader();

	const _outputAirtableSchema = z.object({
		id: z.string(),
		createdTime: z.coerce.string(),
		...columnDefinitions,
	}).array();

	const airtableRecordFetchShape = z.object({
		records: z.object({
			id: z.string(),
			fields: z.object(columnDefinitions),
			createdTime: z.coerce.string(),
		}).array(),
	});

	const airtableRecords = ref<z.infer<typeof _outputAirtableSchema>>([]);

	let baseUrl = `${envs.VITE_AIRTABLE_BASE_URL}${tableName}`;

	if (queryFilters) {
		const filter = createAirtableFilters(queryFilters);
		baseUrl += `?filterByFormula=${filter}`;
	}

	function getRecords() {
		setLoading(true);

		void fetch(
			baseUrl,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${envs.VITE_AIRTABLE_API_KEY}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		)
			.then(
				async(response) => {
					if (!response.ok) {
						const airtableResponseError = response.json() as Promise<AirtableError>;
						throw new AirtableResponseError(await airtableResponseError);
					}
					return response.json() as Promise<AirtableResponseAPI>;
				},
			)
			.then(
				(json) => {
					const {
						success,
						data,
						error,
					} = airtableRecordFetchShape.safeParse(json);

					if (!success) {
						throw new Error(error.errors.shift()!.message);
					}

					const transformedData = data.records.map(
						(item) => ({
							id: item.id,
							createdTime: item.createdTime,
							...item.fields,
						}),
					);

					airtableRecords.value = <never>transformedData;
				},
			)
			.finally(() => {
				setLoading(false);
			});
	}

	getRecords();

	return {
		airtableRecords,
		getRecords,
		isLoading,
	};
}
