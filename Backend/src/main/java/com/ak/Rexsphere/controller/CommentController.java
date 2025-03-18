package com.ak.Rexsphere.controller;

import com.ak.Rexsphere.entity.Comment;
import com.ak.Rexsphere.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment){
        return ResponseEntity.ok(commentService.addComment(comment));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    @GetMapping("/ask/{askId}")
    public ResponseEntity<List<Comment>> getCommentsForAsk(@PathVariable Long askId) {
        return ResponseEntity.ok(commentService.getCommentsForAsk(askId));
    }

    @GetMapping("/rec/{recId}")
    public ResponseEntity<List<Comment>> getCommentsForRec(@PathVariable Long recId) {
        return ResponseEntity.ok(commentService.getCommentsForRec(recId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment updatedComment){
        return ResponseEntity.ok(commentService.updateComment(id, updatedComment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rec/{recId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCountForRec(@PathVariable Long recId) {
        long count = commentService.getCommentCountForRec(recId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @GetMapping("/ask/{askId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCountForAsk(@PathVariable Long askId) {
        long count = commentService.getCommentCountForAsk(askId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }
}
