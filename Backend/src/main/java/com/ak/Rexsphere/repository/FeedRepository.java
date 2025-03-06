package com.ak.Rexsphere.repository;

import com.ak.Rexsphere.entity.Feed;
import com.ak.Rexsphere.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
    List<Feed> findByCategory(Category category);
}
