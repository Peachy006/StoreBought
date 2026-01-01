package com.github.peachy006.storeboughtbackendproper.controller;

import com.github.peachy006.storeboughtbackendproper.service.UserService;
import com.github.peachy006.storeboughtbackendproper.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
here we specify the api endpoints for the users
we use @RestController to tell spring that this class is a rest controller, you can read more on it
we use @RequestMapping to tell spring what the base url for the endpoints is
we use @PostMapping to tell spring that this endpoint is for adding users
we use @RequestBody to tell spring that the body of the request will be a user object
we use @GetMapping to tell spring that this endpoint is for getting all users

it is important to remember this also defines how you want to retrieve the data
 */

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
