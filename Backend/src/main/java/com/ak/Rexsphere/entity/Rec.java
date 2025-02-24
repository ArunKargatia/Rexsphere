package com.ak.Rexsphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rec")
public class Rec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "upvotes")
    private int upVotes = 0;

    @Column(name = "downvotes")
    private int downVotes = 0;

    @ManyToOne
    @JoinColumn(name = "ask_id")
    @JsonIgnore
    private Ask ask;
}
