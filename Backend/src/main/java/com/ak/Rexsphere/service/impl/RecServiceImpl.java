package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.*;
import com.ak.Rexsphere.enums.VoteType;
import com.ak.Rexsphere.repository.AskRepository;
import com.ak.Rexsphere.repository.RecRepository;
import com.ak.Rexsphere.repository.RecVoteRepository;
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
    private RecVoteRepository recVoteRepository;

    @Autowired
    private FeedService feedService;

    @Override
    public Rec createRec(Rec rec, Long askId) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        rec.setUser(user);

        if (askId != null) {
            Ask ask = askRepository.findById(askId)
                    .orElseThrow(() -> new RuntimeException("Ask not found"));
            rec.setAsk(ask);
        }

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
    public List<Rec> getRecsByAskId(Long askId) {
        return recRepository.findByAskId(askId);
    }

    @Override
    public List<Rec> getStandaloneRecs() {
        return recRepository.findByAskIsNull();
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

    @Override
    public void voteRec(Long recId, boolean isUpvote) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Rec rec = recRepository.findById(recId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rec not found."));

        RecVote existingVote = recVoteRepository.findByRecAndUser(rec, user);

        if (existingVote != null) {
            // If the user clicks the same vote type, remove it
            if ((isUpvote && existingVote.getVoteType() == VoteType.UPVOTE) ||
                    (!isUpvote && existingVote.getVoteType() == VoteType.DOWNVOTE)) {
                recVoteRepository.delete(existingVote);
                return;
            }
            // Otherwise, update the vote type
            existingVote.setVoteType(isUpvote ? VoteType.UPVOTE : VoteType.DOWNVOTE);
            recVoteRepository.save(existingVote);
        } else {
            // Create a new vote
            RecVote newVote = new RecVote();
            newVote.setRec(rec);
            newVote.setUser(user);
            newVote.setVoteType(isUpvote ? VoteType.UPVOTE : VoteType.DOWNVOTE);
            recVoteRepository.save(newVote);
        }
    }

    @Override
    public long getUpVotes(Long recId) {
        return recVoteRepository.countByRecIdAndVoteType(recId, VoteType.UPVOTE);
    }

    @Override
    public long getDownVotes(Long recId) {
        return recVoteRepository.countByRecIdAndVoteType(recId, VoteType.DOWNVOTE);
    }
}
