import "preact/jsx-runtime";
import { LEVEL_LABELS, worstLevel } from "@/components/AirQualitySection.tsx";
import { lineTone } from "@/components/StatusV1Section.tsx";
import { degrees } from "@/components/WeatherSection.tsx";
import type { DashboardData } from "@/lib/dashboard_data.ts";
import type { AirQualityLevel } from "@/types/air.ts";

type TileTone = "ok" | "warn" | "alert" | "neutral";

const AIR_TONES: Record<AirQualityLevel, TileTone> = {
	"good": "ok",
	"fair": "ok",
	"moderate": "warn",
	"poor": "alert",
	"very-poor": "alert",
	"extremely-poor": "alert",
};

const dateFormat = new Intl.DateTimeFormat("it-IT", {
	timeZone: "Europe/Rome",
	weekday: "long",
	day: "numeric",
	month: "long",
});

const timeFormat = new Intl.DateTimeFormat("it-IT", {
	timeZone: "Europe/Rome",
	hour: "2-digit",
	minute: "2-digit",
});

interface TileProps {
	href: string;
	icon: string;
	value: string;
	label: string;
	tone: TileTone;
	index: number;
}

function Tile(props: TileProps) {
	return (
		<a href={props.href} class={`tile tile--${props.tone}`} style={`--i: ${props.index}`}>
			<span class="tile__icon" aria-hidden="true">{props.icon}</span>
			<span class="tile__value">{props.value}</span>
			<span class="tile__label">{props.label}</span>
		</a>
	);
}

function metroTile(d: DashboardData): Omit<TileProps, "index"> {
	const base = { href: "#metro", icon: "🚇" };
	if (!d.statusV1 || d.statusV1.length === 0) {
		return { ...base, value: "N/D", label: "Status metro", tone: "neutral" };
	}
	const tones = d.statusV1.map((line) => lineTone(line.status));
	const issues = tones.filter((tone) => tone !== "ok").length;
	if (issues === 0) {
		return {
			...base,
			value: `${tones.length}/${tones.length}`,
			label: "Linee metro regolari",
			tone: "ok",
		};
	}
	return {
		...base,
		value: String(issues),
		label: issues === 1 ? "Linea con disservizi" : "Linee con disservizi",
		tone: tones.includes("alert") ? "alert" : "warn",
	};
}

export function Overview(props: { data: DashboardData }) {
	const d = props.data;
	const now = new Date();
	const air = worstLevel(d.air ?? []);

	const tiles: Array<Omit<TileProps, "index">> = [
		metroTile(d),
		{
			href: "#surface",
			icon: "🚌",
			value: d.surface ? String(d.surface.length) : "N/D",
			label: "Avvisi superficie",
			tone: "neutral",
		},
		{
			href: "#weather",
			icon: d.weather?.condition.icon ?? "🌡️",
			value: d.weather ? degrees(d.weather.temperature) : "N/D",
			label: d.weather?.condition.label ?? "Meteo",
			tone: "neutral",
		},
		{
			href: "#air",
			icon: "🍃",
			value: air ? LEVEL_LABELS[air] : "N/D",
			label: "Qualità dell'aria",
			tone: air ? AIR_TONES[air] : "neutral",
		},
	];

	return (
		<section class="overview" aria-label="Panoramica">
			<div class="overview__bar">
				<div>
					<p class="overview__date">{dateFormat.format(now)}</p>
					<p class="overview__updated">
						<span class="live__dot" aria-hidden="true" /> Aggiornato alle {timeFormat.format(now)}
					</p>
				</div>
				<a href="/" class="button">
					<span class="button__icon" aria-hidden="true">↻</span> Aggiorna
				</a>
			</div>
			<div class="tiles">
				{tiles.map((tile, i) => <Tile key={tile.href} {...tile} index={i} />)}
			</div>
		</section>
	);
}
