import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

import Header from "../Header.vue";

test("<Header />", () => {
  const wrapper = mount(Header);

  expect(wrapper.find("header").exists()).toBe(true);
  expect(wrapper.text()).toContain("🚌 ATM Milano Info Dashboard");
});
