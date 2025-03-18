package com.ak.Rexsphere.service.impl;

import com.ak.Rexsphere.entity.Comment;
import com.ak.Rexsphere.entity.User;
import com.ak.Rexsphere.repository.CommentRepository;
import com.ak.Rexsphere.repository.UserRepository;
import com.ak.Rexsphere.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Comment addComment(Comment comment) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        comment.setUser(user);

        if (comment.getAskId() == null && comment.getRecId() == null) {
            throw new IllegalArgumentException("Either askId or recId must be provided");
        }

        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Override
    public List<Comment> getCommentsForAsk(Long askId) {
        return commentRepository.findByAskId(askId);
    }

    @Override
    public List<Comment> getCommentsForRec(Long recId) {
        return commentRepository.findByAskId(recId);
    }

    @Override
    public Comment updateComment(Long id, Comment updatedComment) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            Comment existingComment = comment.get();

            if (updatedComment.getContent() != null) existingComment.setContent(updatedComment.getContent());

            return commentRepository.save(existingComment);
        } else {
            return null;
        }
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    public Long getCommentCountForRec(Long recId) {
        return commentRepository.countByRecId(recId);
    }

    @Override
    public Long getCommentCountForAsk(Long askId) {
        return commentRepository.countByAskId(askId);
    }
}
