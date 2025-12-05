package com.vizuo.backend.dto;

public class AttachmentInfo {
    private String url;
    private String format;

    public AttachmentInfo() {
    }

    public AttachmentInfo(String url, String format) {
        this.url = url;
        this.format = format;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
