package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.Ask;
import com.ak.Rexsphere.entity.Rec;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.repository.AskRepository;
import com.ak.Rexsphere.repository.RecRepository;
import com.ak.Rexsphere.repository.UserRepository;
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

        return recRepository.save(rec);
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
}
