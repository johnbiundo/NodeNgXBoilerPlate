export const regex = {
    posterUrlRgx: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*(?:\.jpg|jpeg|png)$)/i,
    hlsUrlRgx: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*(?:\.m3u8)$)/i,
    mp4UrlRgx: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*(?:\.mp4)$)/i,
    webmUrlRgx: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*(?:\.webm)$)/i,
    youtubeUrlRgx: /(?:(?:https?:\/\/)(?:www)?\.?(?:youtu\.?be)(?:\.com)?\/(?:.*[=/])*)([^= &?/\r\n]{8,11})/i,
    youtubeUrlExtractRgx: /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/i,
    vimeoUrlRgx: /^((?:https?:)?\/\/)?((?:www|m|player)\.)?((?:vimeo\.com))(?:$|\/|)(\S+)?$/i,
    vimeoUrlExtractRgx: /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/i
};
