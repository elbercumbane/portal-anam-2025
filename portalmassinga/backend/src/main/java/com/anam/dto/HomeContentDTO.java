package com.anam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeContentDTO {
    private UUID id;
    private String sectionKey;
    private String title;
    private String subtitle;
    private String content;
    private String imageUrl;
    private Integer orderIndex;
    private Boolean isActive;
    private String metadata;
}

