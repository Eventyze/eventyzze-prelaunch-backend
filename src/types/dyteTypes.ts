interface VideoConfig {
    codec: string;
    width: number;
    height: number;
    watermark: WaterMark;
    export_file: boolean
}

interface WaterMark {
    url: string;
    size: {
        width: number;
        height: number;
    }
    position: string;
}

interface AudioConfig {
    codec: string;
    channel: string;
    export_file: boolean;
}

interface StorageConfig {
    type: string;
    access_key: string;
    secret: string;
    bucket: string;
    region: string;
    path: string;
    auth_method: string;
    username: string;
    password: string;
    host: string;
    port: number;
    private_key: string;
}

interface RecordingConfig {
    max_seconds: number;
    file_name_prefix: string;
    video_config: VideoConfig;
    audio_config: AudioConfig;
    storage_config: StorageConfig;
    dyte_bucket_config: {
        enabled: boolean;
    }
    // live_streaming_config: {
    //     rtmp_url: string;
    // }
}

interface PlainumHostDyteMeetingData {
    title: string;
    preferred_region: string;
    record_on_start: boolean;
    live_stream_on_start: boolean;
    recording_config: RecordingConfig
    persist_chat: boolean;
}

interface GoldHostDyteMeetingData {
    title: string;
    preferred_region: string;
    record_on_start: boolean;
    live_stream_on_start: boolean;
    recording_config: RecordingConfig
    persist_chat: boolean;
}

interface SilverHostDyteMeetingData {
    title: string;
    preferred_region: string;
    record_on_start: boolean;
    live_stream_on_start: boolean;
    persist_chat: boolean;
}

interface BronzeHostDyteMeetingData {
    title: string;
    preferred_region: string;
    record_on_start: boolean;
    live_stream_on_start: boolean;
    persist_chat: boolean;
}

