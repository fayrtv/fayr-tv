const timekit = require("timekit-sdk");
import { env } from "~/constants/env";

timekit.configure({
    appKey: env.TIMEKIT_API_KEY,
    convertResponseToCamelcase: true,
});

const fetchAvailability = () => {
  return timekit.fetchAvailability();
}
