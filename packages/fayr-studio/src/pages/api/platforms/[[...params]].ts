import { env } from "../../../constants/env";
import { tryGetUser } from "../_helpers";
import { PlatformConfig } from "@fayr/api-contracts";
import {
    Body,
    createHandler,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@storyofams/next-api-decorators";

class PlatformsHandler {
    @Get("/:platformId")
    public async getById(@Param("platformId") id: string) {
        const response = await fetch(`${env.API_URL}platforms/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return response.body;
    }

    @Patch("/:platformId")
    public async patch(@Param("platformId") id: string, @Body() body: Partial<PlatformConfig>) {
        const response = await fetch(`${env.API_URL}platforms/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        return response.body;
    }
}

export default createHandler(PlatformsHandler);
