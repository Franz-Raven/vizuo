package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {

    @Query("""
        select count(d)
        from Download d
        where d.downloadedAt >= :start
          and d.downloadedAt < :end
          and d.image.isPremium = true
    """)
    long countPremiumDownloadsInRange(LocalDateTime start, LocalDateTime end);

    @Query("""
        select count(d)
        from Download d
        where d.downloadedAt >= :start
          and d.downloadedAt < :end
          and d.image.isPremium = true
          and d.image.user.id = :creatorId
    """)
    long countPremiumDownloadsForCreatorInRange(
            Long creatorId,
            LocalDateTime start,
            LocalDateTime end
    );
}
