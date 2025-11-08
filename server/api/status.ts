import { getApi } from "../endpoint";
import type { LineStatus } from "../../types/line";

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

export default defineEventHandler(async (): Promise<Array<LineStatus>> => {
	const data = await getApi("sm");

	const json: Array<LineStatus> = data.map((item: Status) => {
		return {
			line: item.descrizioneField,
			directions: item.direzioniField.map((direction: StatusDirezione) => ({
				status: direction.statoField,
				label: direction.descrizioneField,
			})),
		};
	});

	return json;
});
