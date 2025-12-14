package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Image;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.vizuo.backend.entity.User;

import java.util.Collection;
import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Image> findByUser(User user);

    @Query("""
        select distinct i
        from Image i
        join i.keywords k
        where i.status = true
          and k.id in :keywordIds
          and (:excludedIdsEmpty = true or i.id not in :excludedIds)
        """)
    List<Image> findCandidatesByKeywordIds(
            Collection<Long> keywordIds,
            Collection<Long> excludedIds,
            boolean excludedIdsEmpty,
            Pageable pageable
    );

    @Query("""
        select i
        from Image i
        left join Like l on l.image.id = i.id
        where i.status = true
          and (:excludedIdsEmpty = true or i.id not in :excludedIds)
        group by i.id
        order by count(l.id) desc, i.createdAt desc
        """)
    List<Image> findPopularStatusTrue(
            Collection<Long> excludedIds,
            boolean excludedIdsEmpty,
            Pageable pageable
    );
}
