package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.Ask;
import com.ak.Rexsphere.entity.Rec;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.entity.Vote;
import com.ak.Rexsphere.enums.VoteType;
import com.ak.Rexsphere.repository.AskRepository;
import com.ak.Rexsphere.repository.RecRepository;
import com.ak.Rexsphere.repository.UserRepository;
import com.ak.Rexsphere.repository.VoteRepository;
import com.ak.Rexsphere.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VoteServiceImpl implements VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecRepository recRepository;

    @Autowired
    private AskRepository askRepository;


    @Override
    @Transactional
    public void voteRec(Long recId, boolean isUpvote) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Rec rec = recRepository.findById(recId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rec not found."));

        Vote existingVote = voteRepository.findByRecAndUser(rec, user);

        if (existingVote != null) {
            if ((isUpvote && existingVote.getVoteType() == VoteType.UPVOTE) ||
                    (!isUpvote && existingVote.getVoteType() == VoteType.DOWNVOTE)) {
                voteRepository.delete(existingVote);
                return;
            }
            existingVote.setVoteType(isUpvote ? VoteType.UPVOTE : VoteType.DOWNVOTE);
            voteRepository.save(existingVote);
        } else {
            Vote newVote = new Vote();
            newVote.setRec(rec);
            newVote.setUser(user);
            newVote.setVoteType(isUpvote ? VoteType.UPVOTE : VoteType.DOWNVOTE);
            voteRepository.save(newVote);
        }
    }

    @Override
    @Transactional
    public void voteAsk(Long askId, boolean isUpvote) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Ask ask = askRepository.findById(askId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ask not found."));

        Vote existingVote = voteRepository.findByAskAndUser(ask, user);

        if (existingVote != null) {
            if ((isUpvote && existingVote.getVoteType() == VoteType.UPVOTE) ||
                    (!isUpvote && existingVote.getVoteType() == VoteType.DOWNVOTE)) {
                voteRepository.delete(existingVote);
                return;
            }
            existingVote.setVoteType(isUpvote ? VoteType.UPVOTE : VoteType.DOWNVOTE);
            voteRepository.save(existingVote);
        } else {
            Vote newVote = new Vote();
            newVote.setAsk(ask);
            newVote.setUser(user);
            newVote.setVoteType(isUpvote ? VoteType.UPVOTE : VoteType.DOWNVOTE);
            voteRepository.save(newVote);
        }
    }

    @Override
    public long getUpVotesForRec(Long recId) {
        return voteRepository.countByRecIdAndVoteType(recId, VoteType.UPVOTE);
    }

    @Override
    public long getDownVotesForRec(Long recId) {
        return voteRepository.countByRecIdAndVoteType(recId, VoteType.DOWNVOTE);
    }

    @Override
    public long getUpVotesForAsk(Long askId) {
        return voteRepository.countByAskIdAndVoteType(askId, VoteType.UPVOTE);
    }

    @Override
    public long getDownVotesForAsk(Long askId) {
        return voteRepository.countByAskIdAndVoteType(askId, VoteType.DOWNVOTE);
    }
}
