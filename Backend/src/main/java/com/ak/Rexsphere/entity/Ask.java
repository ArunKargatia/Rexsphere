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
@Table(name = "ask")
public class Ask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "ask", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vote> votes = new ArrayList<>();

}
