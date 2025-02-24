package com.ak.Rexsphere.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "ask")
public class Ask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;

    @OneToMany(mappedBy = "ask",  cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rec> recs;
}
