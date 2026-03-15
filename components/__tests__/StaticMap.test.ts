import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import StaticMap from "../StaticMap.vue";

const CardStub = {
	name: "Card",
	template: '<div class="card-mock"><slot /></div>',
	props: ["title"],
};

test("<StaticMap />", () => {
	const wrapper = mount(StaticMap, {
		global: {
			stubs: { Card: CardStub },
		},
	});
	expect(wrapper.html()).toMatchSnapshot();
});
