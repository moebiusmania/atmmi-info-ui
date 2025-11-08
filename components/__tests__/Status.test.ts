import { mount } from "@vue/test-utils";
import { expect, test, vi, describe } from "vitest";
import Status from "../Status.vue";

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

describe("<Status />", () => {
	test("renders loading state correctly", async () => {
		mockUseFetch.mockReturnValue({
			status: { value: "pending" },
			data: { value: [] },
			error: { value: null },
		});

		const wrapper = mount(Status);
		expect(wrapper.html()).toMatchSnapshot("loading");
	});

	test("renders data correctly", async () => {
		mockUseFetch.mockReturnValue({
			status: { value: "success" },
			data: {
				value: [
					{ line: "M1", text: "Linea 1", status: "regolare" },
					{ line: "M2", text: "Linea 2", status: "tratta sospesa" },
				],
			},
			error: { value: null },
		});

		const wrapper = mount(Status);
		expect(wrapper.html()).toMatchSnapshot("with-data");
	});
});
