package com.vizuo.backend.repository;

import com.vizuo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByUsernameAndIdNot(String username, Long id);
    List<User> findByUsernameContainingIgnoreCaseAndIdNot(String username, Long id);
    List<User> findAllByIdNot(Long id);
}
