import { getApi } from "@/lib/atm_fetch.ts";
import type { MetroLineStatusV2 } from "@/types/line.ts";

interface StatusMeta {
	extensionDataField: string | null;
	PropertyChanged: string | null;
}

interface StatusDirezione extends StatusMeta {
	descrizioneField: string;
	statoField: string;
	tratteField: string | null;
}

interface Status extends StatusMeta {
	descrizioneField: string;
	direzioniField: Array<StatusDirezione>;
}

export async function getV2Statuses(): Promise<Array<MetroLineStatusV2>> {
	const data = await getApi<Array<Status>>("sm");

	return data.map((item: Status) => ({
		line: item.descrizioneField,
		directions: item.direzioniField.map((direction: StatusDirezione) => ({
			status: direction.statoField,
			label: direction.descrizioneField,
		})),
	}));
}
