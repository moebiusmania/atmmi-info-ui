import { createDefine } from "fresh";

export type State = Record<PropertyKey, never>;

export const define = createDefine<State>();
