package com.ak.Rexsphere.controller;

import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.enums.Category;
import com.ak.Rexsphere.service.CloudinaryService;
import com.ak.Rexsphere.service.UserService;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    private final CloudinaryService cloudinaryService;

    public UserController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> all = userService.getAllUsers();
        return ResponseEntity.ok(all);
    }

    @GetMapping
    public ResponseEntity<User> getUserById(){
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/username/{userName}")
    public ResponseEntity<User> getUserByUserName(@PathVariable String userName){
        User user = userService.getUserByUserName(userName);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User updatedUser) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userService.updateUser(userId, updatedUser);
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> requestBody){
        String currentPassword = requestBody.get("currentPassword");
        String updatedPassword = requestBody.get("updatedPassword");

        if (currentPassword == null || updatedPassword == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Both currentPassword and updatedPassword are required.");
        }

        userService.updatePassword(currentPassword, updatedPassword);
        return ResponseEntity.ok("Password updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userService.getUserById(userId);
        try {
            String oldImageUrl = user.getProfilePictureUrl();
            String newImageUrl = cloudinaryService.uploadImage(file);

            if (oldImageUrl != null && !oldImageUrl.isEmpty()){
                cloudinaryService.deleteImage(oldImageUrl);
            }
            userService.updateProfilePictureUrl(user.getId(), newImageUrl);
            return ResponseEntity.ok("Profile picture updated successfully: " + newImageUrl);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }

    @GetMapping("preferences")
    public ResponseEntity<List<Category>> getUserPreferences(){
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        List<Category> preferredCategories = userService.getPreferredCategories(userId);
        return ResponseEntity.ok(preferredCategories);
    }
}
