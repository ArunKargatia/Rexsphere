package com.ak.Rexsphere.service;

import com.ak.Rexsphere.entity.User;

import java.util.List;

public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    User getUserByUserName(String userName);
    List<User> getAllUsers();
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
    String verify(User user);

}
