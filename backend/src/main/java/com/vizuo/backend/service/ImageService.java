package com.vizuo.backend.service;

import com.vizuo.backend.dto.AttachmentInfo;
import com.vizuo.backend.dto.ImageResponse;
import com.vizuo.backend.entity.Image;
import com.vizuo.backend.entity.ImageAttachment;
import com.vizuo.backend.entity.Keyword;
import com.vizuo.backend.entity.User;
import com.vizuo.backend.repository.ImageRepository;
import com.vizuo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private KeywordService keywordService;

    @Autowired
    private LikeService likeService;

    public ImageResponse uploadImage(
            String email,
            String fileName,
            String description,
            List<String> keywords,
            List<MultipartFile> previewFiles,
            List<MultipartFile> attachmentFiles) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = new Image(user, fileName, description);

        Set<Keyword> keywordEntities = keywordService.resolveKeywords(keywords);
        image.setKeywords(keywordEntities);

        String thumbnailUrl = null;
        if (previewFiles != null && !previewFiles.isEmpty()) {
            try {
                CloudinaryUploadResult uploadResult = cloudinaryService.uploadImageWithMeta(previewFiles.get(0), "thumbnails");
                thumbnailUrl = uploadResult.getUrl();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload thumbnail: " + e.getMessage());
            }
        }
        image.setThumbnailUrl(thumbnailUrl);

        List<ImageAttachment> attachments = new ArrayList<>();
        if (attachmentFiles != null && !attachmentFiles.isEmpty()) {
            for (MultipartFile file : attachmentFiles) {
                try {
                    CloudinaryUploadResult uploadResult = cloudinaryService.uploadImageWithMeta(file, "attachments");
                    attachments.add(new ImageAttachment(uploadResult.getUrl(), uploadResult.getFormat()));
                } catch (Exception e) {
                    throw new RuntimeException("Failed to upload attachment: " + e.getMessage());
                }
            }
        }
        image.setAttachments(attachments);

        Image savedImage = imageRepository.save(image);

        return toResponse(savedImage);
    }

    public List<ImageResponse> getUserImages(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Image> images = imageRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<ImageResponse> responses = new ArrayList<>();

        for (Image image : images) {
            responses.add(toResponse(image));
        }

        return responses;
    }

    public ImageResponse getImageById(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        return toResponse(image);
    }

    public void deleteImage(Long id, String email) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!image.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this image");
        }

        likeService.removeAllLikesForImage(image.getId());
        imageRepository.delete(image);
    }

    public List<ImageResponse> getFeedImages(Long currentUserId) {
        List<Image> images = imageRepository.findAll();
        images.removeIf(img -> img.getStatus() == null || !img.getStatus());
        images.sort(Comparator.comparing(Image::getCreatedAt).reversed());

        List<ImageResponse> responses = new ArrayList<>();
        for (Image image : images) {
            responses.add(toResponse(image, currentUserId));
        }

        return responses;
    }

    private ImageResponse toResponse(Image image) {
        long likesCount = likeService.getLikeCountForImage(image.getId());
        String uploaderUsername = image.getUser() != null ? image.getUser().getUsername() : null;
        List<AttachmentInfo> attachments = buildAttachmentInfoList(image);

        return new ImageResponse(
                image.getId(),
                image.getFileName(),
                image.getDescription(),
                keywordService.toNameList(image.getKeywords()),
                image.getThumbnailUrl(),
                attachments,
                image.getCreatedAt(),
                likesCount,
                uploaderUsername);
    }

    private ImageResponse toResponse(Image image, Long currentUserId) {
        long likesCount = likeService.getLikeCountForImage(image.getId());
        String uploaderUsername = image.getUser() != null ? image.getUser().getUsername() : null;
        boolean likedByCurrentUser = currentUserId != null &&
                likeService.hasUserLikedImage(image.getId(), currentUserId);
        List<AttachmentInfo> attachments = buildAttachmentInfoList(image);

        return new ImageResponse(
                image.getId(),
                image.getFileName(),
                image.getDescription(),
                keywordService.toNameList(image.getKeywords()),
                image.getThumbnailUrl(),
                attachments,
                image.getCreatedAt(),
                likesCount,
                uploaderUsername,
                likedByCurrentUser);
    }

    private List<AttachmentInfo> buildAttachmentInfoList(Image image) {
        List<AttachmentInfo> result = new ArrayList<>();
        if (image.getAttachments() != null) {
            for (ImageAttachment attachment : image.getAttachments()) {
                result.add(new AttachmentInfo(attachment.getUrl(), attachment.getFormat()));
            }
        }
        return result;
    }

    public ImageResponse likeImage(Long imageId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        likeService.likeImage(image, user);

        return toResponse(image, user.getId());
    }

    public ImageResponse unlikeImage(Long imageId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        likeService.unlikeImage(image, user);

        return toResponse(image, user.getId());
    }
}
