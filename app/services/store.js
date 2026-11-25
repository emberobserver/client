import { JSONAPICache } from "@warp-drive/json-api";
import { useLegacyStore } from "@warp-drive/legacy";

export default useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  cache: JSONAPICache,
});
