package com.anam.service;

import com.anam.dto.MembroDTO;
import com.anam.dto.PdfExtractionResponseDTO;
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64ImageSource;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.ImageBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.TextBlockParam;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class PdfExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(PdfExtractionService.class);

    private static final String EXTRACTION_PROMPT = """
            Analyze the images of ANAM member registration forms (Associação de Naturais e Amigos de Massinga).
            Each image is a page from a PDF that may contain 1-3 member registration forms.
            Extract the data of each member and return ONLY a valid JSON array with the following fields:

            [
              {
                "nomeCompleto": "string",
                "nomePai": "string",
                "nomeMae": "string",
                "dataNascimento": "YYYY-MM-DD",
                "estadoCivil": "string",
                "profissao": "string",
                "celular": "string",
                "email": "string",
                "telefone": "string or null",
                "rua": "string",
                "bairro": "string",
                "cidade": "string",
                "nomeConjuge": "string or null",
                "dataNascimentoConjuge": "YYYY-MM-DD or null",
                "filiacaoPaiConjuge": "string or null",
                "filiacaoMaeConjuge": "string or null",
                "localTrabalho": "string or null",
                "cargo": "string or null",
                "enderecoTrabalho": "string or null",
                "telefoneTrabalho": "string or null",
                "outrasInformacoes": "string or null",
                "aceitaTermos": true,
                "foto": null
              }
            ]

            Rules:
            - dataNascimento must be in ISO 8601 format: YYYY-MM-DD
            - If a required field is not legible, use empty string ""
            - If an optional field does not exist or is not legible, use null
            - Return ONLY the JSON array, no additional text, no markdown, no ```json fences
            """;

    @Value("${anthropic.api.key:}")
    private String apiKey;

    @Value("${pdf.extraction.max.pages:10}")
    private int maxPages;

    @Value("${pdf.extraction.render.dpi:150}")
    private float renderDpi;

    private AnthropicClient anthropicClient;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @PostConstruct
    private void initClient() {
        if (apiKey != null && !apiKey.isBlank()) {
            this.anthropicClient = AnthropicOkHttpClient.builder()
                    .apiKey(apiKey)
                    .build();
            logger.info("Anthropic client initialized successfully");
        } else {
            logger.warn("Anthropic API key is not configured. PDF extraction will not work.");
        }
    }

    public PdfExtractionResponseDTO extractMembersFromPdf(MultipartFile file) throws Exception {
        if (anthropicClient == null) {
            throw new IllegalStateException("Anthropic API key is not configured. Set the ANTHROPIC_API_KEY environment variable.");
        }

        logger.info("Starting PDF extraction for file: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());

        // Step 1: Render PDF pages to base64 images
        List<String> base64Pages = renderPdfToImages(file);
        logger.info("Rendered {} page(s) from PDF", base64Pages.size());

        // Step 2: Build Anthropic request with all page images
        List<ContentBlockParam> contentBlocks = new ArrayList<>();

        for (int i = 0; i < base64Pages.size(); i++) {
            contentBlocks.add(ContentBlockParam.ofImage(
                    ImageBlockParam.builder()
                            .source(Base64ImageSource.builder()
                                    .mediaType(Base64ImageSource.MediaType.IMAGE_PNG)
                                    .data(base64Pages.get(i))
                                    .build())
                            .build()
            ));
        }

        contentBlocks.add(ContentBlockParam.ofText(
                TextBlockParam.builder()
                        .text(EXTRACTION_PROMPT)
                        .build()
        ));

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-6")
                .maxTokens(4096)
                .addUserMessageOfBlockParams(contentBlocks)
                .build();

        // Step 3: Call Claude API
        logger.info("Sending {} page image(s) to Claude for extraction", base64Pages.size());
        Message response = anthropicClient.messages().create(params);

        // Step 4: Extract text from response
        String rawJson = response.content().stream()
                .filter(block -> block.isText())
                .map(block -> block.asText().text())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Claude returned no text response"));

        logger.debug("Raw Claude response: {}", rawJson);

        // Step 5: Clean up and parse JSON
        String cleanedJson = cleanJsonResponse(rawJson);
        List<MembroDTO> members = parseMembers(cleanedJson);

        // Step 6: Build response DTO
        PdfExtractionResponseDTO result = new PdfExtractionResponseDTO();
        result.setMembers(members);
        result.setTotalExtracted(members.size());
        result.setMessage(members.size() + " member(s) extracted successfully from " + base64Pages.size() + " page(s)");

        // Warn about members with missing required fields
        List<String> warnings = new ArrayList<>();
        for (int i = 0; i < members.size(); i++) {
            MembroDTO m = members.get(i);
            if (m.getNomeCompleto() == null || m.getNomeCompleto().isBlank()) {
                warnings.add("Member " + (i + 1) + ": name could not be read");
            }
            if (m.getEmail() == null || m.getEmail().isBlank()) {
                warnings.add("Member " + (i + 1) + ": email could not be read — required before saving");
            }
        }
        result.setWarnings(warnings);

        logger.info("Extraction complete: {} member(s) extracted, {} warning(s)", members.size(), warnings.size());
        return result;
    }

    private List<String> renderPdfToImages(MultipartFile file) throws Exception {
        System.setProperty("java.awt.headless", "true");

        List<String> pages = new ArrayList<>();

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            int totalPages = Math.min(document.getNumberOfPages(), maxPages);
            PDFRenderer renderer = new PDFRenderer(document);

            for (int pageIndex = 0; pageIndex < totalPages; pageIndex++) {
                BufferedImage image = renderer.renderImageWithDPI(pageIndex, renderDpi);

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "PNG", baos);

                String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
                pages.add(base64);

                logger.debug("Rendered page {} ({} bytes base64)", pageIndex + 1, base64.length());
            }
        }

        return pages;
    }

    private String cleanJsonResponse(String raw) {
        String cleaned = raw.strip();

        // Remove markdown code fences if present
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```(?:json)?\\s*", "");
            cleaned = cleaned.replaceAll("\\s*```$", "");
            cleaned = cleaned.strip();
        }

        return cleaned;
    }

    private List<MembroDTO> parseMembers(String json) throws Exception {
        try {
            return objectMapper.readValue(json, new TypeReference<List<MembroDTO>>() {});
        } catch (Exception e) {
            logger.error("Failed to parse Claude JSON response: {}", json);
            throw new RuntimeException("Failed to parse extracted member data: " + e.getMessage(), e);
        }
    }
}
