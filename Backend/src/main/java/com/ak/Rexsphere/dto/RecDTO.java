package com.ak.Rexsphere.dto;

import com.ak.Rexsphere.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecDTO {

    private Long id;

    private String content;

    private Category category;

    private String userName;

    private Long upVotes;

    private Long downVotes;
}
