package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.Feed;
import com.ak.Rexsphere.enums.Category;
import com.ak.Rexsphere.repository.FeedRepository;
import com.ak.Rexsphere.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedServiceImpl implements FeedService {

    @Autowired
    private FeedRepository feedRepository;

    @Override
    public Feed savetoFeed(Feed feed) {
        return feedRepository.save(feed);
    }

    @Override
    public List<Feed> getAllFeed() {
        return feedRepository.findAll();
    }

    @Override
    public List<Feed> getFeedByCategory(String category) {
        return feedRepository.findByCategory(Category.valueOf(category.toUpperCase()));
    }
}
