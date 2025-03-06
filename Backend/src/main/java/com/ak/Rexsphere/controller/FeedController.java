package com.ak.Rexsphere.controller;

import com.ak.Rexsphere.entity.Feed;
import com.ak.Rexsphere.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @PostMapping
    public Feed addToFeed(@RequestBody Feed feed){
        return feedService.savetoFeed(feed);
    }

    @GetMapping
    public List<Feed> getAllFeed(){
        return feedService.getAllFeed();
    }

    @GetMapping("/category/{category}")
    public List<Feed> getByCategory(@PathVariable String category){
        return feedService.getFeedByCategory(category);
    }
}
