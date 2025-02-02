"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bronzeUserDataGenerator = (title, preferredRegion) => {
    const data = {
        title,
        preferred_region: preferredRegion,
        record_on_start: false,
        live_stream_on_start: false,
        persist_chat: false
    };
    return data;
};
const silverUserDataGenerator = (title, preferredRegion) => {
    const data = {
        title,
        preferred_region: preferredRegion,
        record_on_start: false,
        live_stream_on_start: false,
        persist_chat: false
    };
    return data;
};
const goldUserDataGenerator = (title, preferredRegion, duration) => {
    const data = {
        title,
        preferred_region: preferredRegion,
        record_on_start: false,
        live_stream_on_start: false,
        persist_chat: false,
        recording_config: {
            max_seconds: duration,
            file_name_prefix: title,
            video_config: {
                codec: "H264",
                width: 854,
                height: 480,
                watermark: {
                    url: "",
                    size: {
                        width: 200,
                        height: 100
                    },
                    position: "left top"
                },
                export_file: false
            },
            audio_config: {
                codec: "MP3",
                channel: "mono",
                export_file: false
            },
            storage_config: {
                type: "",
                access_key: "",
                secret: "",
                bucket: "",
                region: "",
                path: "",
                auth_method: "",
                username: "",
                password: "",
                host: "",
                port: 0,
                private_key: ""
            },
            dyte_bucket_config: {
                enabled: false
            }
        }
    };
    return data;
};
const platinumUserDataGenerator = (title, preferredRegion, duration) => {
    const data = {
        title,
        preferred_region: preferredRegion,
        record_on_start: false,
        live_stream_on_start: false,
        persist_chat: false,
        recording_config: {
            max_seconds: duration,
            file_name_prefix: title,
            video_config: {
                codec: "H264",
                width: 1280,
                height: 720,
                watermark: {
                    url: "",
                    size: {
                        width: 200,
                        height: 100
                    },
                    position: "left top"
                },
                export_file: false
            },
            audio_config: {
                codec: "AAC",
                channel: "stereo",
                export_file: false
            },
            storage_config: {
                type: "",
                access_key: "",
                secret: "",
                bucket: "",
                region: "",
                path: "",
                auth_method: "",
                username: "",
                password: "",
                host: "",
                port: 0,
                private_key: ""
            },
            dyte_bucket_config: {
                enabled: false
            }
        }
    };
    return data;
};
exports.default = {
    bronzeUserDataGenerator,
    silverUserDataGenerator,
    goldUserDataGenerator,
    platinumUserDataGenerator
};
