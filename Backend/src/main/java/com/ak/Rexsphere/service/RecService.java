package com.ak.Rexsphere.service;

import com.ak.Rexsphere.dto.RecDTO;
import com.ak.Rexsphere.entity.Rec;

import java.util.List;

public interface RecService {
    Rec createRec(Rec rec, Long askId);
    List<Rec> getAllRecs();
    RecDTO getRecWithVotes(Long recId);
    Rec getRecById(Long id);
    List<Rec> getRecsByAskId(Long askId);
    List<Rec> getStandaloneRecs();
    List<Rec> getRecsByCategory(String category);
    void deleteRec(Long id);
    void voteRec(Long recId, boolean isUpvote);
    long getUpVotes(Long recId);
    long getDownVotes(Long recId);
}
