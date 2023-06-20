import { Agent } from "undici";
import crypto from "node:crypto";

const ENDPOINT: string = "https://www.atm.it/it/Pagine/default.aspx";
const getPage = async (): Promise<string> =>
  $fetch(ENDPOINT, {
    mode: "cors",
    dispatcher: new Agent({
      connect: {
        rejectUnauthorized: false,
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
      },
    }),
  });

export { ENDPOINT, getPage };
