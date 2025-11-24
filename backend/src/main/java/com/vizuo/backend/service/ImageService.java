package com.vizuo.backend.service;

import com.vizuo.backend.dto.ImageResponse;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public ImageResponse uploadImage(String email, String fileName, String description, 
                                    List<String> keywords, List<MultipartFile> previewFiles, 
                                    List<MultipartFile> attachmentFiles) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = new Image(user, fileName, description);
        image.setKeywords(keywords != null ? keywords : new ArrayList<>());

        // Upload thumbnail (first preview file)
        String thumbnailUrl = null;
        if (previewFiles != null && !previewFiles.isEmpty()) {
            try {
                thumbnailUrl = cloudinaryService.uploadImage(previewFiles.get(0), "thumbnails");
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload thumbnail: " + e.getMessage());
            }
        }
        image.setThumbnailUrl(thumbnailUrl);

        // Upload attachment files to Cloudinary
        List<String> attachmentUrls = new ArrayList<>();
        if (attachmentFiles != null && !attachmentFiles.isEmpty()) {
            for (MultipartFile file : attachmentFiles) {
                try {
                    String url = cloudinaryService.uploadImage(file, "attachments");
                    attachmentUrls.add(url);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to upload attachment: " + e.getMessage());
                }
            }
        }
        image.setAttachmentUrls(attachmentUrls);

        Image savedImage = imageRepository.save(image);
        
        return new ImageResponse(
            savedImage.getId(),
            savedImage.getFileName(),
            savedImage.getDescription(),
            savedImage.getKeywords(),
            savedImage.getThumbnailUrl(),
            savedImage.getAttachmentUrls(),
            savedImage.getCreatedAt()
        );
    }

    public List<ImageResponse> getUserImages(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Image> images = imageRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<ImageResponse> responses = new ArrayList<>();

        for (Image image : images) {
            responses.add(new ImageResponse(
                image.getId(),
                image.getFileName(),
                image.getDescription(),
                image.getKeywords(),
                image.getThumbnailUrl(),
                image.getAttachmentUrls(),
                image.getCreatedAt()
            ));
        }

        return responses;
    }

    public ImageResponse getImageById(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        return new ImageResponse(
            image.getId(),
            image.getFileName(),
            image.getDescription(),
            image.getKeywords(),
            image.getThumbnailUrl(),
            image.getAttachmentUrls(),
            image.getCreatedAt()
        );
    }

    public void deleteImage(Long id, String email) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!image.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this image");
        }

        imageRepository.delete(image);
    }
}
