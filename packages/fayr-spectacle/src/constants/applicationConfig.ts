import { env } from "./env";

export const applicationConfig = {
    IS_FITTINGROOM_ENABLED: !env.IS_IN_PRODUCTION,
    ARE_SIDEBAR_DEBUG_PAGES_ENABLED: !env.IS_IN_PRODUCTION,
};

export default applicationConfig;
