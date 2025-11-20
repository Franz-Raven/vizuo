package com.vizuo.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${CLOUDINARY_URL}") String cloudinaryUrl) {

        this.cloudinary = new Cloudinary(cloudinaryUrl);
        this.cloudinary.config.secure = true;
        System.out.println("Cloudinary service initialized");
    }

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, String type) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            if (!file.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }
            
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "vizuo/" + type,
                            "resource_type", "image",
                            "quality", "auto:good",
                            "fetch_format", "auto"
                    )
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicIdFromUrl(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }
    }

    private String extractPublicIdFromUrl(String url) {
        String[] parts = url.split("/upload/");
        if (parts.length > 1) {
            String path = parts[1];
            if (path.startsWith("v")) {
                path = path.substring(path.indexOf('/') + 1);
            }
            int lastDot = path.lastIndexOf('.');
            if (lastDot != -1) {
                path = path.substring(0, lastDot);
            }
            return path;
        }
        throw new RuntimeException("Invalid Cloudinary URL");
    }
}