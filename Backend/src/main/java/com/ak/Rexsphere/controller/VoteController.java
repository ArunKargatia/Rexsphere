package com.ak.Rexsphere.controller;

import com.ak.Rexsphere.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/rec/{recId}")
    public ResponseEntity<Void> voteRec(@PathVariable Long recId, @RequestParam boolean isUpvote) {
        voteService.voteRec(recId, isUpvote);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/ask/{askId}")
    public ResponseEntity<Void> voteAsk(@PathVariable Long askId, @RequestParam boolean isUpvote) {
        voteService.voteAsk(askId, isUpvote);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rec/{recId}/upvotes")
    public ResponseEntity<Long> getUpVotesForRec(@PathVariable Long recId) {
        return ResponseEntity.ok(voteService.getUpVotesForRec(recId));
    }

    @GetMapping("/rec/{recId}/downvotes")
    public ResponseEntity<Long> getDownVotesForRec(@PathVariable Long recId) {
        return ResponseEntity.ok(voteService.getDownVotesForRec(recId));
    }

    @GetMapping("/ask/{askId}/upvotes")
    public ResponseEntity<Long> getUpVotesForAsk(@PathVariable Long askId) {
        return ResponseEntity.ok(voteService.getUpVotesForAsk(askId));
    }

    @GetMapping("/ask/{askId}/downvotes")
    public ResponseEntity<Long> getDownVotesForAsk(@PathVariable Long askId) {
        return ResponseEntity.ok(voteService.getDownVotesForAsk(askId));
    }
}
