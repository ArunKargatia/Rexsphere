package com.ak.Rexsphere.service;

import com.ak.Rexsphere.entity.Feed;

import java.util.List;

public interface FeedService {
    Feed savetoFeed(Feed feed);
    List<Feed> getAllFeed();
    List<Feed> getFeedByCategory(String category);
}
