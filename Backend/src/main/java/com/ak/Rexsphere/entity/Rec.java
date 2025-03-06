package com.ak.Rexsphere.entity;

import com.ak.Rexsphere.enums.Category;
import com.ak.Rexsphere.enums.VoteType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "ask_id")
    @JsonIgnore
    private Ask ask;

    @OneToMany(mappedBy = "rec", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<RecVote> votes = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public long getUpVotes() {
        return votes != null ? votes.stream()
                .filter(vote -> vote.getVoteType() == VoteType.UPVOTE)
                .count() : 0;
    }

    public long getDownVotes() {
        return votes != null ? votes.stream()
                .filter(vote -> vote.getVoteType() == VoteType.DOWNVOTE)
                .count() : 0;
    }
}
