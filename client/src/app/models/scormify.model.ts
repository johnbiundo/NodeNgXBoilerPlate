import { ObjectType } from './object-type.model';
export class mysampleapp {
    descriptors?: Descriptors;
    completion?: Completion;
    type?: ObjectType;
    style?: string;
    streamingVideo?: StreamingVideo;
    youtube?: Youtube;
    vimeo?: Vimeo;
}


export class Descriptors {
    title?: string;
    filename?: string;
}

export class Completion {
    threshold?: number;
    disableScrubber?: false;
    completeOnDownload?: boolean;
}

export class StreamingVideo {
    posterUrl?: string;
    hlsUrl?: string;
    mp4Url?: string;
    webmUrl?: string;
}

export class Vimeo {
    url?: string;
}

export class Youtube {
    url?: string;
}
