package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.Ask;
import com.ak.Rexsphere.entity.Feed;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.repository.AskRepository;
import com.ak.Rexsphere.repository.UserRepository;
import com.ak.Rexsphere.service.AskService;
import com.ak.Rexsphere.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AskServiceImpl implements AskService {

    @Autowired
    private AskRepository askRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedService feedService;

    @Override
    public Ask createAsk(Ask ask) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ask.setUser(user);

        Ask savedAsk = askRepository.save(ask);

        //save to feed
        feedService.savetoFeed(new Feed(ask));

        return savedAsk;
    }

    @Override
    public List<Ask> getAllAsks() {
        return askRepository.findAll();
    }

    @Override
    public Ask getAskById(Long id) {
        return askRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ask not found"));
    }

    @Override
    public List<Ask> getAsksByCategory(String category) {
        return askRepository.findByCategory(category);
    }

    @Override
    public void deleteAsk(Long id) {
        if (!askRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ask not found");
        }
        askRepository.deleteById(id);
    }
}