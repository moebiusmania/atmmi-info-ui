import { Agent } from "undici";
import crypto from "node:crypto";

const WEBSITE: string = "https://www.atm.it/it/Pagine/default.aspx";
const API: string =
  "https://giromilano.atm.it/proxy.tpportal/api/tpPortal/tpl/atm";

/**
 * Explanation for this fetch configuration can be found in
 * https://github.com/nuxt/nuxt/issues/21609
 */
const getPage = async (): Promise<string> =>
  $fetch(WEBSITE, {
    mode: "cors",
    dispatcher: new Agent({
      connect: {
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      },
    }),
  });

const getApi = async (resource: string = ""): Promise<any> =>
  $fetch(`${API}/${resource}`, {
    mode: "cors",
  });

export { WEBSITE, API, getPage, getApi };
