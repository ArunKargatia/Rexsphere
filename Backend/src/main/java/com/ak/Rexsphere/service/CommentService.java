package com.ak.Rexsphere.service;

import com.ak.Rexsphere.entity.Comment;

import java.util.List;

public interface CommentService {

    Comment addComment(Comment comment);
    List<Comment> getAllComments();
    List<Comment> getCommentsForAsk(Long askId);
    List<Comment> getCommentsForRec(Long recId);
    Comment updateComment(Long id, Comment updatedComment);
    void deleteComment(Long id);
    Long getCommentCountForRec(Long recId);
    Long getCommentCountForAsk(Long askId);

}
