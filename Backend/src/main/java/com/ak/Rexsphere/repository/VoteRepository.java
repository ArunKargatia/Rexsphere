package com.ak.Rexsphere.repository;

import com.ak.Rexsphere.entity.Ask;
import com.ak.Rexsphere.entity.Rec;
import com.ak.Rexsphere.entity.Vote;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    Vote findByRecAndUser(Rec rec, User user);

    Vote findByAskAndUser(Ask ask, User user);

    long countByRecIdAndVoteType(Long recId, VoteType voteType);

    long countByAskIdAndVoteType(Long askId, VoteType voteType);
}
