package com.vizuo.backend;

import com.vizuo.backend.entity.Role;
import com.vizuo.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                roleRepository.save(new Role("ADMIN"));
            }
            if (roleRepository.findByName("DESIGNER").isEmpty()) {
                roleRepository.save(new Role("DESIGNER"));
            }
        };
    }
}
