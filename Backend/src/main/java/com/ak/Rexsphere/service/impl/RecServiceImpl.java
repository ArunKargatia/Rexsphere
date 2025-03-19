package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.*;
import com.ak.Rexsphere.repository.AskRepository;
import com.ak.Rexsphere.repository.RecRepository;
import com.ak.Rexsphere.repository.VoteRepository;
import com.ak.Rexsphere.repository.UserRepository;
import com.ak.Rexsphere.service.FeedService;
import com.ak.Rexsphere.service.RecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RecServiceImpl implements RecService {

    @Autowired
    private RecRepository recRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AskRepository askRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private FeedService feedService;

    @Override
    public Rec createRec(Rec rec) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        rec.setUser(user);

        Rec savedRec = recRepository.save(rec);

        // save to feed
        feedService.savetoFeed(new Feed(rec));

        return savedRec;
    }

    @Override
    public List<Rec> getAllRecs() {
        return recRepository.findAll();
    }

    @Override
    public Rec getRecById(Long id) {
        return recRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rec not found"));
    }

    @Override
    public List<Rec> getRecsByCategory(String category) {
        return recRepository.findByCategory(category);
    }

    @Override
    public void deleteRec(Long id) {
        if (!recRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rec not found");
        }
        recRepository.deleteById(id);
    }
}
