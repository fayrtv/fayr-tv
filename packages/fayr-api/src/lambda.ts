import lambda_api from "lambda-api";

import * as repo from "./repositories/platformConfigs";

// Require and init API router module
const app = lambda_api({ version: "v1.0", base: "v1" });

//----------------------------------------------------------------------------//
// Define Middleware
//----------------------------------------------------------------------------//

// Add CORS Middleware
app.use((_req, res, next) => {
    // Add default CORS headers for every request
    res.cors({});

    // Call next to continue processing
    next();
});

// Add Authorization Middleware
app.use((req, _res, next) => {
    // Check for Authorization Bearer token
    if (req.auth.type === "Bearer") {
        // Get the Bearer token value
        let token = req.auth.value;
        // Set the token in the request scope
        req.token = token;
        // Do some checking here to make sure it is valid (set an auth flag)
        //@ts-ignore
        req.auth = true;
    }

    // Call next to continue processing
    next();
});

//----------------------------------------------------------------------------//
// Build API routes
//----------------------------------------------------------------------------//

app.get("/ping", async (req, res) => {
    res.status(200).json({
        message: "ok",
        body: req.body,
        query: req.query,
    });
});

app.get("/platforms/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "Please provide an 'id' query string parameter.",
        });
        return;
    }

    const response = await repo.getOrCreate(id);

    res.status(200).json(response);
});

app.patch("/platforms/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "Please provide an 'id' query string parameter.",
        });
        return;
    }

    await repo.savePartial({ id, ...req.body });

    res.status(200).json({
        message: "ok",
    });
});

// Default Options for CORS preflight
app.options("/*", (_req, res) => {
    res.status(200).json({});
});

//----------------------------------------------------------------------------//
// Main router handler
//----------------------------------------------------------------------------//
export function router(event, context, callback) {
    // !!!IMPORTANT: Set this flag to false, otherwise the lambda function
    // won't quit until all DB connections are closed, which is not good
    // if you want to freeze and reuse these connections
    context.callbackWaitsForEmptyEventLoop = false;

    // Run the request
    app.run(event, context, callback);
} // end router handler
