package com.anam.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PdfExtractionResponseDTO {

    private List<MembroDTO> members = new ArrayList<>();
    private String message;
    private int totalExtracted;
    private List<String> warnings = new ArrayList<>();
}
