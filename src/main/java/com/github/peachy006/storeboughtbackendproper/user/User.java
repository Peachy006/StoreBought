package com.github.peachy006.storeboughtbackendproper.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
    This is the class that defines what a user will be.
    We use @Data from Lombok to automatically generate getters, setters, equals, hashCode, and toString methods.
    @NoArgsConstructor and @AllArgsConstructor handle the constructors.
 */

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String password;

    @Column(columnDefinition = "TEXT")
    private String gameState;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}