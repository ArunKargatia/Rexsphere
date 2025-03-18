package com.ak.Rexsphere.repository;

import com.ak.Rexsphere.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByAskId(Long askId);
    List<Comment> findByRecId(Long recId);
    long countByRecId(Long recId);
    long countByAskId(Long askId);
}
