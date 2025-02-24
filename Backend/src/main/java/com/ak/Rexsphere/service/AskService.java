package com.ak.Rexsphere.service;

import com.ak.Rexsphere.entity.Ask;

import java.util.List;

public interface AskService {
    Ask createAsk(Ask ask);
    List<Ask> getAllAsks();
    Ask getAskById(Long id);
    List<Ask> getAsksByCategory(String category);
    void deleteAsk(Long id);
}
