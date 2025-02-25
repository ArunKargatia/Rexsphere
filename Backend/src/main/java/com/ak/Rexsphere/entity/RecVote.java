package com.ak.Rexsphere.entity;

import com.ak.Rexsphere.enums.VoteType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rec_votes", uniqueConstraints = @UniqueConstraint(columnNames = {"rec_id", "user_id"}))
public class RecVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rec_id", nullable = false)
    private Rec rec;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteType voteType;

}