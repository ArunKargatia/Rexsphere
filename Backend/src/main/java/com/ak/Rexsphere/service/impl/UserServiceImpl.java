package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.enums.Category;
import com.ak.Rexsphere.service.JWTService;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.repository.UserRepository;
import com.ak.Rexsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getUserByUserName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();

            if (updatedUser.getFirstName() != null) existingUser.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) existingUser.setLastName(updatedUser.getLastName());
            if (updatedUser.getUserName() != null) existingUser.setUserName(updatedUser.getUserName());
            if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
//            if (updatedUser.getPassword() != null) existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            if (updatedUser.getMobileNumber() != null) existingUser.setMobileNumber(updatedUser.getMobileNumber());
            if (updatedUser.getAddress() != null) existingUser.setAddress(updatedUser.getAddress());
            if (updatedUser.getDateOfBirth() != null) existingUser.setDateOfBirth(updatedUser.getDateOfBirth());

            if (updatedUser.getPreferredCategories() != null) existingUser.setPreferredCategories(updatedUser.getPreferredCategories());

            return userRepository.save(existingUser);
        } else {
            return null;
        }
    }

    @Override
    public void updatePassword(String currentPassword, String updatedPassword) {
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();

            if (passwordEncoder.matches(currentPassword, existingUser.getPassword())) {
                if (updatedPassword != null && !updatedPassword.isBlank()){
                    existingUser.setPassword(passwordEncoder.encode(updatedPassword));
                    userRepository.save(existingUser);
                }
            }
            else {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
        }
        else {
            throw new NoSuchElementException("User not Found");
        }
    }


    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public String verify(User user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword()));
        if (authentication.isAuthenticated()) {

            User userFromDB = userRepository.findByUserName(user.getUserName());

            if (userFromDB != null) {
                Long userId = userFromDB.getId();
                return jwtService.generateToken(user.getUserName(), userId);
            } else {
                return "Customer not found.";
            }
        }
        return "Authentication Failed.";
    }

    @Override
    public void updateProfilePictureUrl(Long id, String newImageUrl) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setProfilePictureUrl(newImageUrl);
            userRepository.save(user);
        }
    }

    @Override
    public List<Category> getPreferredCategories(Long userId) {
        return userRepository.findById(userId)
                .map(User::getPreferredCategories)
                .orElse(Collections.emptyList());
    }
}
