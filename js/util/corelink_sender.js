"use strict";

import { metaroomEventSender, metaroomSyncSender } from "../corelink_handler.js"

export function ab2str(buf) {
    var rawBuf = String.fromCharCode.apply(null, new Uint8Array(buf));
    // we are using json objects everywhere
    var jsonObj = JSON.parse(rawBuf);
    return jsonObj;
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 1); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export function corelink_event(data) {
    if (window.initxr) {
        var msg = corelink_message("event", data);
        corelink.send(metaroomEventSender, msg);

    }
}

export function corelink_message(type, data) {
    let message;
    switch (type) {
        case "initialize":
            message = {
                type: "initialize",
                ts: Date.now(),
                id: data
            };
            break;
        case "avatar":
            message = {
                type: "avatar",
                user: data,
                ts: Date.now(),
                state: window.avatars[data].toJson(),
            };
            break;

        case "webrtc":
            {
                message = {
                    type: "webrtc",
                    uid: window.playerid,
                    state: data,
                    ts: Date.now(),
                };
            }
            // console.log("send webrtc", message);
            break;
        case "object":
            {
                // ZH: object update
                message = {
                    type: "object",
                    ts: Date.now(),
                    uid: window.playerid,
                    state: data,
                };
            }
            //console.log("corelink.send object", message);
            break;
        case "objectInit":
            {
                // ZH: object init
                message = {
                    type: "objectInit",
                    ts: Date.now(),
                    uid: window.playerid,
                    state: data,
                };
            }
            break;
        case "test":
            {
                message = {
                    type: "test",
                    state: Date.now(),
                };
            }
            break;
        case "mute":
            {
                message = {
                    type: "mute",
                    uid: window.playerid,
                    state: data,
                };
            }
            //console.log("corelink.send mute", message);
            break;
        case "demo":
            message = {
                type: "demo",
                uid: window.playerid,
                state: data,
            };
            //console.log("demo", message);
            break;
        case "event":
            // console.log(data);
            message = {
                type: "event",
                uid: window.playerid,
                ts: Date.now(),
                // it: lt[rigger], rt[rigger]
                // op: press, release, hold
                state: {
                    item: data["it"],
                    operation: data["op"],
                }
            };
            // console.log("event", message);
            break;
        case "init":
            message = {
                type: "init",
                uid: window.playerid,
                state: data,
            };
            console.log("init", message);
            break;
        case "blackboard":
            message = {
                type: "blackboard",
                uid: window.playerid,
                ts: Date.now(),
                state: data
            };
            console.log("debug blackboard", message);
            break;
        case "desktophand":
            message = {
                type: "desktophand",
                uid: window.playerid,
                ts: Date.now(),
                state: data
            };
            console.log("debug desktophand", message);
            break;
        case "sketchobject":
            message = {
                type: "sketchobject",
                uid: window.playerid,
                ts: Date.now(),
                state: data
            };
            //console.log("debug sketchobject", message);
            break;
        default:
            break;
    }
    var json_bytes = str2ab(JSON.stringify(message));
    // var jsonStr = JSON.stringify(message);
    // read json string to Buffer
    // const buf = Buffer.from(jsonStr);
    return json_bytes;
}