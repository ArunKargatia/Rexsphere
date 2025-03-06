package com.ak.Rexsphere.entity;

import com.ak.Rexsphere.enums.Category;
import com.ak.Rexsphere.enums.FeedType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Feed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedType type;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Feed(Ask ask) {
        this.content = ask.getQuestion();
        this.category = ask.getCategory();
        this.type = FeedType.ASK;
        this.user = ask.getUser();
    }

    public Feed(Rec rec) {
        this.content = rec.getContent();
        this.category = rec.getCategory();
        this.type = FeedType.REC;
        this.user = rec.getUser();
    }

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Override
    public String toString() {
        return "Feed{id=" + id + ", content='" + content + "', category=" + category + ", type=" + type + ", user=" + user.getId() + "}";
    }
}
