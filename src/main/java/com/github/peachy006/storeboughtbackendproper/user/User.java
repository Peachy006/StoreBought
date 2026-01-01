package com.github.peachy006.storeboughtbackendproper.user;

import jakarta.persistence.*;

/*
This is the class that defines what a user will be, this will contain the username and password, later on i must add the gameState parsed to json
currently we use the @entity annotation to tell JPA that this class is a table in the database
we use @table to tell JPA what the table name is
we use @id to tell JPA that this is the primary key
we use @generatedvalue to tell JPA how to generate the primary key
we use @column to tell JPA what column the primary key is in the table
the getters and setters can be replaced later with lombok
 */


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;

    // Standard no-args constructor required by JPA
    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}