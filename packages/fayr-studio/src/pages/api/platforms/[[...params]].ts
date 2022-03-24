import { PlatformConfig } from "@fayr/backend-contracts";
import { Body, createHandler, Get, Param, Post, Query } from "@storyofams/next-api-decorators";

class PlatformsHandler {
    @Get("/:platformId")
    public getById(@Param("platformId") id: string) {
        // TODO
        return { error: "not implemented" };
    }

    @Post("/:platformId")
    public async post(@Param("platformId") id: string, @Body() body: Partial<PlatformConfig>) {
        // TODO
        return { error: "not implemented" };
    }
}

export default createHandler(PlatformsHandler);
