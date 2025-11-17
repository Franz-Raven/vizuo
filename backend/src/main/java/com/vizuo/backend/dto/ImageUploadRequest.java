package com.vizuo.backend.dto;

import java.util.List;

public class ImageUploadRequest {
    private String fileName;
    private String description;
    private List<String> keywords;

    public ImageUploadRequest() {}

    public ImageUploadRequest(String fileName, String description, List<String> keywords) {
        this.fileName = fileName;
        this.description = description;
        this.keywords = keywords;
    }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
}
