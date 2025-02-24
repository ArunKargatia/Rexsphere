package com.ak.Rexsphere.controller;

import com.ak.Rexsphere.entity.Ask;
import com.ak.Rexsphere.service.AskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ask")
public class AskController {

    @Autowired
    private AskService askService;

    @PostMapping
    public ResponseEntity<Ask> createAsk(@RequestBody Ask ask) {
        return new ResponseEntity<>(askService.createAsk(ask), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ask>> getAllAsks(){
        return new ResponseEntity<>(askService.getAllAsks(), HttpStatus.OK);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Ask> getAskById(@PathVariable Long id) {
        return new ResponseEntity<>(askService.getAskById(id), HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Ask>> getAsksByCategory(@PathVariable String category) {
        return new ResponseEntity<>(askService.getAsksByCategory(category), HttpStatus.OK);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteAsk(@PathVariable Long id) {
        askService.deleteAsk(id);
        return ResponseEntity.ok("Ask deleted successfully.");
    }
}
