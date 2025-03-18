package com.ak.Rexsphere.service;

import com.ak.Rexsphere.enums.VoteType;

public interface VoteService {

    void voteRec(Long recId, boolean isUpvote);
    void voteAsk(Long askId, boolean isUpvote);

    long getUpVotesForRec(Long recId);
    long getDownVotesForRec(Long recId);
    long getUpVotesForAsk(Long askId);
    long getDownVotesForAsk(Long askId);
}
