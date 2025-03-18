package com.ak.Rexsphere.service;

import com.ak.Rexsphere.entity.Rec;

import java.util.List;

public interface RecService {
    Rec createRec(Rec rec);
    List<Rec> getAllRecs();
    Rec getRecWithVotes(Long recId);
    Rec getRecById(Long id);
    List<Rec> getRecsByCategory(String category);
    void deleteRec(Long id);
}
