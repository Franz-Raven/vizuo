package com.vizuo.backend.repository;

import com.vizuo.backend.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface KeywordRepository extends JpaRepository<Keyword, Long> {
    Optional<Keyword> findByNameIgnoreCase(String name);

    List<Keyword> findByNameInIgnoreCase(Collection<String> names);

    @Query("""
        select k from Keyword k
        where lower(k.name) in :names
        """)
    List<Keyword> findByNameInLower(Collection<String> names);
}
