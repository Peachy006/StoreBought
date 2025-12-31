package com.github.peachy006.storeboughtbackendproper.controller;

import com.github.peachy006.storeboughtbackendproper.service.UserService;
import com.github.peachy006.storeboughtbackendproper.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public String add(@RequestBody User user) {
        userService.saveUser(user);
        return "User added successfully";
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

}
