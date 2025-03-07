package com.ak.Rexsphere.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Category {
    TECHNOLOGY,
    SPORTS,
    MUSIC,
    EDUCATION,
    HEALTH,
    TRAVEL,
    GAMING,
    FOOD,
    BUSINESS,
    MOVIES,
    FITNESS,
    ART,
    SCIENCE,
    BOOKS,
    AUTOMOBILE,
    ENTERTAINMENT,
    PROGRAMMING,
    LIFESTYLE,
    OTHER;

    @JsonCreator
    public static Category fromString(String value) {
        for (Category category : Category.values()) {
            if (category.name().equalsIgnoreCase(value)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Invalid category: "+ value);
    }
}
