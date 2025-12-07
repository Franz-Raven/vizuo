package com.vizuo.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ImageAttachment {

    @Column(name = "attachment_url")
    private String url;

    @Column(name = "attachment_format")
    private String format;

    public ImageAttachment() {
    }

    public ImageAttachment(String url, String format) {
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
