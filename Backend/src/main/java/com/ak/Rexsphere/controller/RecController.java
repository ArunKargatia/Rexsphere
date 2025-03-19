package com.ak.Rexsphere.controller;

import com.ak.Rexsphere.entity.Rec;
import com.ak.Rexsphere.service.RecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rec")
public class RecController {

    @Autowired
    private RecService recService;

    @PostMapping
    public ResponseEntity<Rec> createRec(@RequestBody Rec rec) {
        Rec savedRec = recService.createRec(rec);
        return new ResponseEntity<>(savedRec, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rec>> getAllRecs(){
        return new ResponseEntity<>(recService.getAllRecs(), HttpStatus.OK);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Rec> getRecById(@PathVariable Long id) {
        return new ResponseEntity<>(recService.getRecById(id), HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Rec>> getRecByCategory(@PathVariable String category){
        return new ResponseEntity<>(recService.getRecsByCategory(category), HttpStatus.OK);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteRec(@PathVariable Long id){
        recService.deleteRec(id);
        return ResponseEntity.ok("Rec deleted successfully");
    }
}
