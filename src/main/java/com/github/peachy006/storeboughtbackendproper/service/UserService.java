package com.github.peachy006.storeboughtbackendproper.service;

import com.github.peachy006.storeboughtbackendproper.user.User;

import java.util.List;

//super simple interface for getting and saving users, its the interface used in UserServiceImpl

public interface UserService {
    public User saveUser(User user);
    public List<User> getAllUsers();
    public User getUserById(Long id);
    public User login(String username, String password);
}
