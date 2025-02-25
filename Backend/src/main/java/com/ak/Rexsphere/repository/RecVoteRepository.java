package com.ak.Rexsphere.repository;

import com.ak.Rexsphere.entity.Rec;
import com.ak.Rexsphere.entity.RecVote;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecVoteRepository extends JpaRepository<RecVote, Long> {

    RecVote findByRecAndUser(Rec rec, User user);

    long countByRecIdAndVoteType(Long recId, VoteType voteType);
}
