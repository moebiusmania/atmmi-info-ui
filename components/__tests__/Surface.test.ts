import { mount } from "@vue/test-utils";
import { expect, test, vi, describe } from "vitest";
import Surface from "../Surface.vue";

// Mock the Card component
vi.mock("../Card.vue", () => ({
	default: {
		name: "Card",
		template: '<div class="card-mock"><slot /></div>',
		props: ["title"],
	},
}));

// Mock useFetch
const mockUseFetch = vi.fn();
vi.mock("#imports", () => ({
	useFetch: () => mockUseFetch(),
}));

describe("<Surface />", () => {
	test("renders with data", () => {
		mockUseFetch.mockReturnValue({
			data: { value: ["Bus 42: deviazione", "Tram 14: interruzione"] },
			error: { value: null },
		});

		const wrapper = mount(Surface);
		expect(wrapper.html()).toMatchSnapshot("with-data");
	});

	test("renders empty state", () => {
		mockUseFetch.mockReturnValue({
			data: { value: [] },
			error: { value: null },
		});

		const wrapper = mount(Surface);
		expect(wrapper.html()).toMatchSnapshot("empty-state");
	});
});
