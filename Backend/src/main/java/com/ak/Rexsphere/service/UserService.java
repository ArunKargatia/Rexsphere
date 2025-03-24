package com.ak.Rexsphere.service;

import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.enums.Category;

import java.util.List;

public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    User getUserByUserName(String userName);
    List<User> getAllUsers();
    User updateUser(Long id, User updatedUser);
    void updatePassword(String currentPassword, String updatedPassword);
    void deleteUser(Long id);
    String verify(User user);
    void updateProfilePictureUrl(Long id, String newImageUrl);
    List<Category> getPreferredCategories(Long userId);
}
