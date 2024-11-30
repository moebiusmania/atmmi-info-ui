import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import StaticMap from "../StaticMap.vue";

// Mock the Card component
// vi.mock('../Card.vue', () => ({
//   default: {
//     name: 'Card',
//     template: '<div class="card-mock"><slot /></div>',
//     props: ['title']
//   }
// }));

test("<StaticMap />", () => {
  const wrapper = mount(StaticMap);
  expect(wrapper.html()).toMatchSnapshot();
});
