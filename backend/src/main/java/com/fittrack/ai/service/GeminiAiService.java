package com.fittrack.ai.service;

import com.fittrack.ai.dto.ChatRequest;
import com.fittrack.ai.dto.ChatResponse;

public interface GeminiAiService {

    ChatResponse getFitnessAdvice(ChatRequest request);
}
