package com.github.peachy006.storeboughtbackendproper.service;

import com.github.peachy006.storeboughtbackendproper.repository.UserRepository;
import com.github.peachy006.storeboughtbackendproper.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
here we use @service to tell spring that this class is a service
we use @autowired to tell spring to inject the userRepository into this class
autowired can cause issues if the class is not defined as a bean in the spring project, it has caused me a great deal of pain
 */

/*
 we override the methods from UserService as it is an interface being used here, its essentially just the methods for setting and getting users
 */

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }
}
