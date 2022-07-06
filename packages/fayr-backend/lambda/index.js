"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addRating = exports.end = exports.attendees = exports.attendee = exports.join = exports.createMeeting = exports.sendmessage = exports.ondisconnect = exports.onconnect = exports.authorize = void 0;
var aws_sdk_1 = require("aws-sdk");
var ddb = new aws_sdk_1["default"].DynamoDB();
var _a = process.env, CONNECTIONS_TABLE_NAME = _a.CONNECTIONS_TABLE_NAME, MEETINGS_TABLE_NAME = _a.MEETINGS_TABLE_NAME, ATTENDEES_TABLE_NAME = _a.ATTENDEES_TABLE_NAME, RATINGS_TABLE_NAME = _a.RATINGS_TABLE_NAME;
if (!CONNECTIONS_TABLE_NAME) {
    throw new Error("Must provide a value for 'CONNECTIONS_TABLE_NAME' in env vars.");
}
if (!MEETINGS_TABLE_NAME) {
    throw new Error("Must provide a value for 'MEETINGS_TABLE_NAME' in env vars.");
}
if (!ATTENDEES_TABLE_NAME) {
    throw new Error("Must provide a value for 'ATTENDEES_TABLE_NAME' in env vars.");
}
if (!RATINGS_TABLE_NAME) {
    throw new Error("Must provide a value for 'RATINGS_TABLE_NAME' in env vars.");
}
var chime = new aws_sdk_1["default"].Chime({ region: "us-east-1" }); // Must be in us-east-1
chime.endpoint = new aws_sdk_1["default"].Endpoint("https://service.chime.aws.amazon.com/console");
var oneDayFromNow = function () { return Math.floor(Date.now() / 1000) + 60 * 60 * 24; };
var strictVerify = true;
var response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST",
        "Content-Type": "application/json"
    },
    body: "",
    isBase64Encoded: false
};
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
var getMeeting = function (meetingTitle) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, result, meetingData, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filter = {
                    TableName: MEETINGS_TABLE_NAME,
                    Key: {
                        Title: {
                            S: meetingTitle
                        }
                    }
                };
                console.info("getMeeting > filter:", JSON.stringify(filter, null, 2));
                return [4 /*yield*/, ddb.getItem(filter).promise()];
            case 1:
                result = _a.sent();
                console.info("getMeeting > result:", JSON.stringify(result, null, 2));
                if (!result.Item) {
                    return [2 /*return*/, null];
                }
                meetingData = JSON.parse(result.Item.Data.S);
                meetingData.PlaybackURL = result.Item.PlaybackURL.S;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, chime
                        .getMeeting({
                        MeetingId: meetingData.Meeting.MeetingId
                    })
                        .promise()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.info("getMeeting > try/catch:", JSON.stringify(err_1, null, 2));
                return [2 /*return*/, null];
            case 5: return [2 /*return*/, meetingData];
        }
    });
}); };
var putMeeting = function (title, meetingInfo, playbackURL) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ddb
                    .putItem({
                    TableName: MEETINGS_TABLE_NAME,
                    Item: {
                        Title: { S: title },
                        PlaybackURL: { S: playbackURL },
                        Data: { S: JSON.stringify(meetingInfo) },
                        TTL: {
                            N: "" + oneDayFromNow()
                        }
                    }
                })
                    .promise()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var endMeeting = function (title) { return __awaiter(void 0, void 0, void 0, function () {
    var meetingInfo, err_2, params, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getMeeting(title)];
            case 1:
                meetingInfo = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, chime
                        .deleteMeeting({
                        MeetingId: meetingInfo.Meeting.MeetingId
                    })
                        .promise()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                console.info("endMeeting > try/catch:", JSON.stringify(err_2, null, 2));
                return [2 /*return*/, null];
            case 5:
                params = {
                    TableName: MEETINGS_TABLE_NAME,
                    Key: {
                        Title: {
                            S: title
                        }
                    }
                };
                console.info("deleteMeeting > params:", JSON.stringify(params, null, 2));
                return [4 /*yield*/, ddb.deleteItem(params).promise()];
            case 6:
                result = _a.sent();
                console.info("deleteMeeting > result:", JSON.stringify(result, null, 2));
                return [2 /*return*/, result];
        }
    });
}); };
var getAttendee = function (title, attendeeId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ddb
                    .getItem({
                    TableName: ATTENDEES_TABLE_NAME,
                    Key: {
                        AttendeeId: {
                            S: "".concat(title, "/").concat(attendeeId)
                        }
                    }
                })
                    .promise()];
            case 1:
                result = _a.sent();
                if (!result.Item) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, result.Item];
        }
    });
}); };
var getAttendees = function (title) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, result, filteredItems, prop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filter = {
                    TableName: ATTENDEES_TABLE_NAME,
                    FilterExpression: "begins_with(AttendeeId, :title)",
                    ExpressionAttributeValues: {
                        ":title": {
                            S: "".concat(title)
                        }
                    }
                };
                console.info("getAttendees > filter:", JSON.stringify(filter, null, 2));
                return [4 /*yield*/, ddb.scan(filter).promise()];
            case 1:
                result = _a.sent();
                console.info("getAttendees > result:", JSON.stringify(result, null, 2));
                if (!result.Items) {
                    return [2 /*return*/, "Unknown"];
                }
                filteredItems = [];
                for (prop in result.Items) {
                    filteredItems.push({
                        AttendeeId: result.Items[prop].AttendeeId.S,
                        Name: result.Items[prop].Name.S
                    });
                }
                console.info("getAttendees > filteredItems:", JSON.stringify(filteredItems, null, 2));
                return [2 /*return*/, filteredItems];
        }
    });
}); };
var putAttendee = function (title, attendeeId, name, role) { return __awaiter(void 0, void 0, void 0, function () {
    var item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                item = {
                    AttendeeId: {
                        S: "".concat(title, "/").concat(attendeeId)
                    },
                    Name: { S: name },
                    TTL: {
                        N: "" + oneDayFromNow()
                    },
                    Role: {
                        S: role
                    }
                };
                return [4 /*yield*/, ddb
                        .putItem({
                        TableName: ATTENDEES_TABLE_NAME,
                        Item: item
                    })
                        .promise()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
function simplifyTitle(title) {
    // Strip out most symbolic characters and whitespace and make case insensitive,
    // but preserve any Unicode characters outside of the ASCII range.
    return (
    // eslint-disable-next-line no-useless-escape
    (title || "").replace(/[\s()!@#$%^&*`~_=+{}|\\;:'",.<>/?\[\]-]+/gu, "").toLowerCase() ||
        null);
}
// Websocket
var authorize = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var generatePolicy, passedAuthCheck, attendeeInfo, e_1, parsedException;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("authorize event:", JSON.stringify(event, null, 2));
                generatePolicy = function (principalId, effect, resource, context) {
                    return __assign({ principalId: principalId, context: context }, (effect && resource
                        ? {
                            policyDocument: {
                                Version: "2012-10-17",
                                Statement: [
                                    {
                                        Action: "execute-api:Invoke",
                                        Effect: effect,
                                        Resource: resource
                                    },
                                ]
                            }
                        }
                        : {}));
                };
                passedAuthCheck = false;
                if (!(!!((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.MeetingId) &&
                    !!event.queryStringParameters.AttendeeId &&
                    !!event.queryStringParameters.JoinToken)) return [3 /*break*/, 5];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, chime
                        .getAttendee({
                        MeetingId: event.queryStringParameters.MeetingId,
                        AttendeeId: event.queryStringParameters.AttendeeId
                    })
                        .promise()];
            case 2:
                attendeeInfo = _c.sent();
                if (((_b = attendeeInfo.Attendee) === null || _b === void 0 ? void 0 : _b.JoinToken) === event.queryStringParameters.JoinToken) {
                    passedAuthCheck = true;
                }
                else if (strictVerify) {
                    console.error("failed to authenticate with join token");
                }
                else {
                    passedAuthCheck = true;
                    console.warn("failed to authenticate with join token (skipping due to strictVerify=false)");
                }
                return [3 /*break*/, 4];
            case 3:
                e_1 = _c.sent();
                parsedException = e_1;
                if (strictVerify) {
                    console.error("failed to authenticate with join token: ".concat(parsedException.message));
                }
                else {
                    passedAuthCheck = true;
                    console.warn("failed to authenticate with join token (skipping due to strictVerify=false): ".concat(parsedException.message));
                }
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.error("missing MeetingId, AttendeeId, JoinToken parameters");
                _c.label = 6;
            case 6: return [2 /*return*/, generatePolicy("me", passedAuthCheck ? "Allow" : "Deny", event.methodArn, {
                    MeetingId: event.queryStringParameters.MeetingId,
                    AttendeeId: event.queryStringParameters.AttendeeId
                })];
        }
    });
}); };
exports.authorize = authorize;
var onconnect = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("onconnect event:", JSON.stringify(event, null, 2));
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ddb
                        .putItem({
                        TableName: CONNECTIONS_TABLE_NAME,
                        Item: {
                            MeetingId: { S: (_a = event.requestContext.authorizer) === null || _a === void 0 ? void 0 : _a.MeetingId },
                            AttendeeId: { S: (_b = event.requestContext.authorizer) === null || _b === void 0 ? void 0 : _b.AttendeeId },
                            ConnectionId: { S: event.requestContext.connectionId },
                            TTL: { N: "".concat(oneDayFromNow()) }
                        }
                    })
                        .promise()];
            case 2:
                _c.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _c.sent();
                // @ts-ignore
                console.error("error connecting: ".concat(err_3.message));
                return [2 /*return*/, {
                        statusCode: 500,
                        body: "Failed to connect: ".concat(JSON.stringify(err_3))
                    }];
            case 4: return [2 /*return*/, { statusCode: 200, body: "Connected." }];
        }
    });
}); };
exports.onconnect = onconnect;
var ondisconnect = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("ondisconnect event:", JSON.stringify(event, null, 2));
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ddb
                        .deleteItem({
                        TableName: CONNECTIONS_TABLE_NAME,
                        Key: {
                            MeetingId: { S: (_a = event.requestContext.authorizer) === null || _a === void 0 ? void 0 : _a.MeetingId },
                            AttendeeId: { S: (_b = event.requestContext.authorizer) === null || _b === void 0 ? void 0 : _b.AttendeeId }
                        }
                    })
                        .promise()];
            case 2:
                _c.sent();
                return [3 /*break*/, 4];
            case 3:
                err_4 = _c.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        body: "Failed to disconnect: ".concat(JSON.stringify(err_4))
                    }];
            case 4: return [2 /*return*/, { statusCode: 200, body: "Disconnected." }];
        }
    });
}); };
exports.ondisconnect = ondisconnect;
var sendmessage = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var attendees, e_2, parsedException, apigwManagementApi, postData, postCalls, e_3, parsedException;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("sendmessage event:", JSON.stringify(event, null, 2));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ddb
                        .query({
                        ExpressionAttributeValues: {
                            ":meetingId": { S: (_a = event.requestContext.authorizer) === null || _a === void 0 ? void 0 : _a.MeetingId }
                        },
                        KeyConditionExpression: "MeetingId = :meetingId",
                        ProjectionExpression: "ConnectionId",
                        TableName: CONNECTIONS_TABLE_NAME
                    })
                        .promise()];
            case 2:
                attendees = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _b.sent();
                parsedException = e_2;
                return [2 /*return*/, { statusCode: 500, body: parsedException.stack }];
            case 4:
                apigwManagementApi = new aws_sdk_1["default"].ApiGatewayManagementApi({
                    apiVersion: "2018-11-29",
                    endpoint: "".concat(event.requestContext.domainName, "/").concat(event.requestContext.stage)
                });
                if (!event.body) {
                    return [2 /*return*/, { statusCode: 400, body: "No request body provided" }];
                }
                postData = JSON.parse(event.body).data;
                if (!attendees.Items) {
                    return [2 /*return*/, { statusCode: 201, body: "No attendees found in the meeting" }];
                }
                postCalls = attendees.Items.map(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
                    var connectionId, e_4, parsedException;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                connectionId = connection.ConnectionId.S;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, apigwManagementApi
                                        .postToConnection({ ConnectionId: connectionId, Data: postData })
                                        .promise()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_4 = _a.sent();
                                parsedException = e_4;
                                if (parsedException.statusCode === 410) {
                                    console.log("found stale connection, skipping ".concat(connectionId));
                                }
                                else {
                                    console.error("error posting to connection ".concat(connectionId, ": ").concat(parsedException.message));
                                }
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, Promise.all(postCalls)];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                e_3 = _b.sent();
                parsedException = e_3;
                console.error("failed to post: ".concat(parsedException.message));
                return [2 /*return*/, { statusCode: 500, body: parsedException.stack }];
            case 8: return [2 /*return*/, { statusCode: 200, body: "Data sent." }];
        }
    });
}); };
exports.sendmessage = sendmessage;
// API
var createMeeting = function (event, context, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, title, region, meetingInfo, request, joinInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("createMeeting event:", JSON.stringify(event, null, 2));
                if (!event.body) {
                    return [2 /*return*/, { statusCode: 400, body: "No request body provided." }];
                }
                try {
                    payload = JSON.parse(event.body);
                }
                catch (err) {
                    console.log("createMeeting event > parse payload:", JSON.stringify(err, null, 2));
                    response.statusCode = 400;
                    response.body = JSON.stringify(err);
                    callback(null, response);
                    return [2 /*return*/];
                }
                if (!payload || !payload.title) {
                    console.log("createMeeting event > missing required field: Must provide title");
                    response.statusCode = 400;
                    response.body = "Must provide title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                title = simplifyTitle(payload.title);
                if (!title) {
                    response.statusCode = 400;
                    response.body = "Invalid room title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                region = payload.region || "us-east-1";
                return [4 /*yield*/, getMeeting(title)];
            case 1:
                meetingInfo = _a.sent();
                if (!!meetingInfo) return [3 /*break*/, 4];
                request = {
                    ClientRequestToken: uuid(),
                    MediaRegion: region
                };
                console.info("createMeeting event > Creating new meeting: " + JSON.stringify(request, null, 2));
                return [4 /*yield*/, chime.createMeeting(request).promise()];
            case 2:
                meetingInfo = _a.sent();
                // TODO: Playback URL is not being passed here, which might be a bug.
                return [4 /*yield*/, putMeeting(title, meetingInfo)];
            case 3:
                // TODO: Playback URL is not being passed here, which might be a bug.
                _a.sent();
                _a.label = 4;
            case 4:
                joinInfo = {
                    JoinInfo: {
                        Title: title,
                        Meeting: meetingInfo.Meeting
                    }
                };
                response.statusCode = 201;
                response.body = JSON.stringify(joinInfo, undefined, 2);
                console.info("createMeeting event > response:", JSON.stringify(response, null, 2));
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); };
exports.createMeeting = createMeeting;
var join = function (event, context, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, title, name, region, meetingInfo, request, attendees_1, attendeeInfo, joinInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("join event:", JSON.stringify(event, null, 2));
                if (!event.body) {
                    return [2 /*return*/, { statusCode: 400, body: "No request body provided" }];
                }
                try {
                    payload = JSON.parse(event.body);
                }
                catch (err) {
                    console.log("join event > parse payload:", JSON.stringify(err, null, 2));
                    response.statusCode = 500;
                    response.body = JSON.stringify(err);
                    callback(null, response);
                    return [2 /*return*/];
                }
                if (!payload || !payload.title || !payload.name) {
                    console.log("join > missing required fields: Must provide title and name");
                    response.statusCode = 400;
                    response.body = "Must provide title and name";
                    callback(null, response);
                    return [2 /*return*/];
                }
                if (payload.role === "host" && !payload.playbackURL) {
                    console.log("join > missing required field: Must provide playbackURL");
                    response.statusCode = 400;
                    response.body = "Must provide playbackURL";
                    callback(null, response);
                    return [2 /*return*/];
                }
                title = simplifyTitle(payload.title);
                if (!title) {
                    response.statusCode = 400;
                    response.body = "Invalid room title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                name = payload.name;
                region = payload.region || "us-east-1";
                return [4 /*yield*/, getMeeting(title)];
            case 1:
                meetingInfo = _a.sent();
                if (!(!meetingInfo && payload.role === "host")) return [3 /*break*/, 4];
                request = {
                    ClientRequestToken: uuid(),
                    MediaRegion: region
                };
                console.info("join event > Creating new meeting: " + JSON.stringify(request, null, 2));
                return [4 /*yield*/, chime.createMeeting(request).promise()];
            case 2:
                meetingInfo = _a.sent();
                meetingInfo.PlaybackURL = payload.playbackURL;
                return [4 /*yield*/, putMeeting(title, meetingInfo, payload.playbackURL)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, getAttendees(title)];
            case 5:
                attendees_1 = _a.sent();
                if (attendees_1 !== "Unknown" && attendees_1.length >= 11) {
                    response.statusCode = 429;
                    response.body = "Cannot have more than 11 participants in a VfB meeting";
                    callback(null, response);
                    return [2 /*return*/];
                }
                _a.label = 6;
            case 6:
                console.info("join event > meetingInfo:", JSON.stringify(meetingInfo, null, 2));
                console.info("join event > Adding new attendee");
                return [4 /*yield*/, chime
                        .createAttendee({
                        MeetingId: meetingInfo.Meeting.MeetingId,
                        ExternalUserId: uuid()
                    })
                        .promise()];
            case 7:
                attendeeInfo = _a.sent();
                console.info("join event > attendeeInfo:", JSON.stringify(attendeeInfo, null, 2));
                return [4 /*yield*/, putAttendee(title, attendeeInfo.Attendee.AttendeeId, name, payload.role)];
            case 8:
                _a.sent();
                joinInfo = {
                    JoinInfo: {
                        Title: title,
                        PlaybackURL: meetingInfo.PlaybackURL,
                        Meeting: meetingInfo.Meeting,
                        Attendee: attendeeInfo.Attendee
                    }
                };
                console.info("join event > joinInfo:", JSON.stringify(joinInfo, null, 2));
                response.statusCode = 200;
                response.body = JSON.stringify(joinInfo, undefined, 2);
                console.info("join event > response:", JSON.stringify(response, null, 2));
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); };
exports.join = join;
var attendee = function (event, context, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var title, attendeeId, attendeeEntity, attendeeInfo;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("attendee event:", JSON.stringify(event, null, 2));
                if (!((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.title) || !event.queryStringParameters.attendeeId) {
                    console.log("attendee event > missing required fields: Must provide title and attendeeId");
                    response.statusCode = 400;
                    response.body = "Must provide title and attendeeId";
                    callback(null, response);
                    return [2 /*return*/];
                }
                title = simplifyTitle(event.queryStringParameters.title);
                if (!title) {
                    response.statusCode = 400;
                    response.body = "Invalid room title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                attendeeId = event.queryStringParameters.attendeeId;
                return [4 /*yield*/, getAttendee(title, attendeeId)];
            case 1:
                attendeeEntity = _b.sent();
                if (!attendeeEntity) {
                    // No attendee found => Presumably bad request on client side (Invalid ID)
                    response.statusCode = 400;
                    callback(null, response);
                }
                attendeeInfo = {
                    AttendeeInfo: {
                        AttendeeId: attendeeId,
                        Name: attendeeEntity.Name.S,
                        Role: attendeeEntity.Role.S
                    }
                };
                response.statusCode = 200;
                response.body = JSON.stringify(attendeeInfo, undefined, 2);
                console.info("attendee event > response:", JSON.stringify(response, null, 2));
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); };
exports.attendee = attendee;
var attendees = function (event, context, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var title, attendeeInfo;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("attendees event:", JSON.stringify(event, null, 2));
                if (!((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.title)) {
                    console.log("attendees event > missing required fields: Must provide title");
                    response.statusCode = 400;
                    response.body = "Must provide title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                title = simplifyTitle(event.queryStringParameters.title);
                if (!title) {
                    response.statusCode = 400;
                    response.body = "Invalid room title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, getAttendees(title)];
            case 1:
                attendeeInfo = _b.sent();
                response.statusCode = 200;
                response.body = JSON.stringify(attendeeInfo, undefined, 2);
                console.info("attendees event > response:", JSON.stringify(response, null, 2));
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); };
exports.attendees = attendees;
var end = function (event, context, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var title, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log("end event:", JSON.stringify(event, null, 2));
                if (!((_d = event.queryStringParameters) === null || _d === void 0 ? void 0 : _d.title)) {
                    console.log("end event > missing required fields: Must provide title");
                    response.statusCode = 400;
                    response.body = "Must provide title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                title = simplifyTitle(event.queryStringParameters.title);
                if (!title) {
                    response.statusCode = 400;
                    response.body = "Invalid room title";
                    callback(null, response);
                    return [2 /*return*/];
                }
                response.statusCode = 200;
                _a = response;
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, endMeeting(title)];
            case 1:
                _a.body = _c.apply(_b, [_e.sent()]);
                console.info("end event > response:", JSON.stringify(response, null, 2));
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); };
exports.end = end;
var addRating = function (event, context, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var ratingData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!event.body) {
                    return [2 /*return*/, { statusCode: 400, body: "No request body provided" }];
                }
                ratingData = JSON.parse(event.body);
                return [4 /*yield*/, ddb
                        .putItem({
                        TableName: ATTENDEES_TABLE_NAME,
                        Item: {
                            Rating: {
                                N: ratingData.rating.toString()
                            }
                        }
                    })
                        .promise()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.addRating = addRating;
