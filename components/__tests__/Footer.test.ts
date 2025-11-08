import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

import Footer from "../Footer.vue";

test("<Footer />", () => {
	const wrapper = mount(Footer);
	const year = new Date().getFullYear();

	expect(wrapper.html()).toMatchSnapshot();

	expect(wrapper.find("footer").exists()).toBe(true);
	expect(wrapper.text()).toContain(year);
});
