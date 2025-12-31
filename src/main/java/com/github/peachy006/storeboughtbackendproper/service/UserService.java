package com.github.peachy006.storeboughtbackendproper.service;

import com.github.peachy006.storeboughtbackendproper.user.User;

import java.util.List;

public interface UserService {
    public User saveUser(User user);
    public List<User> getAllUsers();
}
