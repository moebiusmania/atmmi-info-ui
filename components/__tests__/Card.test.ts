import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

import Card from "../Card.vue";

test("<Card />", () => {
  const title = "Test title";
  const content = "Test content";

  const wrapper = mount(Card, {
    props: {
      title,
    },
    slots: {
      default: `<p>${content}</p>`,
    },
  });

  expect(wrapper.find("article").exists()).toBe(true);
  expect(wrapper.text()).toContain(title);
  expect(wrapper.text()).toContain(content);
});
