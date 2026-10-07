package com.fittrack.ai.controller;

import com.fittrack.ai.dto.ApiResponse;
import com.fittrack.ai.dto.ChatRequest;
import com.fittrack.ai.dto.ChatResponse;
import com.fittrack.ai.service.GeminiAiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiAiService geminiAiService;

    public AiController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = geminiAiService.getFitnessAdvice(request);
        return ResponseEntity.ok(ApiResponse.ok("AI response generated", response));
    }
}
