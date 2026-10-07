package com.fittrack.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittrack.ai.config.GeminiConfig;
import com.fittrack.ai.dto.ChatRequest;
import com.fittrack.ai.dto.ChatResponse;
import com.fittrack.ai.entity.User;
import com.fittrack.ai.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiAiServiceImpl implements GeminiAiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiServiceImpl.class);

    private final GeminiConfig geminiConfig;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiAiServiceImpl(GeminiConfig geminiConfig,
                               UserRepository userRepository,
                               RestTemplate restTemplate) {
        this.geminiConfig = geminiConfig;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public ChatResponse getFitnessAdvice(ChatRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        String userContext = buildUserContext(userOpt.orElse(null));

        if (!geminiConfig.hasApiKey()) {
            log.warn("Gemini API key not configured. Providing personalized fallback response.");
            String fallbackReply = generateFallbackFitnessAdvice(request.getMessage(), userOpt.orElse(null));
            return ChatResponse.ok(fallbackReply);
        }

        try {
            String prompt = String.format("""
                %s

                User's Question:
                "%s"

                Please provide a direct, highly practical, motivating, and personalized response.
                Use bullet points and clear headings where appropriate.
                """, userContext, request.getMessage());

            String requestUrl = String.format("%s/%s:generateContent?key=%s",
                    geminiConfig.getBaseUrl(),
                    geminiConfig.getModel(),
                    geminiConfig.getApiKey());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini API JSON payload
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(contentMap));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 1200);
            requestBody.put("generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(requestUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String replyText = parseGeminiResponse(response.getBody());
                if (replyText != null && !replyText.trim().isEmpty()) {
                    return ChatResponse.ok(replyText);
                }
            }

            log.warn("Empty or unexpected response from Gemini API. Falling back to built-in coach.");
            return ChatResponse.ok(generateFallbackFitnessAdvice(request.getMessage(), userOpt.orElse(null)));

        } catch (Exception e) {
            log.error("Error communicating with Gemini API: {}", e.getMessage(), e);
            String fallback = generateFallbackFitnessAdvice(request.getMessage(), userOpt.orElse(null));
            return ChatResponse.ok(fallback + "\n\n*(Note: Live Gemini API request encountered an issue (" + e.getMessage() + "), so your personalized offline fitness guidelines are shown above).*");
        }
    }

    private String buildUserContext(User user) {
        if (user == null) {
            return """
                You are FitTrack AI, an elite, supportive certified fitness trainer and nutrition coach.
                Provide evidence-based fitness and wellness advice.
                """;
        }

        Double bmi = user.calculateBmi();
        String bmiCategory = user.getBmiCategory();

        return String.format("""
            You are FitTrack AI, an elite certified personal fitness trainer, strength coach, and sports nutritionist.
            Always tailor your advice specifically to this user's physical profile and goals:
            
            [CLIENT BIOMETRICS & PROFILE]
            - Name: %s
            - Age: %s
            - Height: %s cm
            - Weight: %s kg
            - BMI: %s (%s)
            - Activity Level: %s
            - Fitness Goal: %s

            Guidelines:
            1. Formulate personalized advice matching their current weight, BMI category, activity level, and goal.
            2. Be encouraging, precise, and scientifically grounded.
            3. Structure the response with clear takeaways (e.g., Quick Routine, Nutrition Tip, Recovery Focus).
            4. Keep safety and progressive overload in mind.
            """,
                user.getName(),
                user.getAge() != null ? user.getAge() : "Not specified",
                user.getHeight() != null ? user.getHeight() : "Not specified",
                user.getWeight() != null ? user.getWeight() : "Not specified",
                bmi != null ? bmi : "N/A",
                bmiCategory,
                user.getActivityLevel() != null ? user.getActivityLevel() : "Moderate",
                user.getFitnessGoal() != null ? user.getFitnessGoal() : "Healthy Lifestyle"
        );
    }

    private String parseGeminiResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode parts = firstCandidate.path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText();
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
        }
        return null;
    }

    private String generateFallbackFitnessAdvice(String query, User user) {
        String name = user != null ? user.getName() : "Athlete";
        String goal = user != null && user.getFitnessGoal() != null ? user.getFitnessGoal() : "General Fitness";
        String activity = user != null && user.getActivityLevel() != null ? user.getActivityLevel() : "Moderate";
        Double bmi = (user != null && user.calculateBmi() != null) ? user.calculateBmi() : 22.5;
        String bmiCategory = user != null ? user.getBmiCategory() : "Normal weight";

        String lowerQuery = query.toLowerCase();

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("### FitTrack AI Coach Insights for %s\n\n", name));
        sb.append(String.format("> **Target Goal:** %s | **Activity Level:** %s | **BMI:** %s (%s)\n\n",
                goal, activity, bmi != null ? bmi : "N/A", bmiCategory));

        if (lowerQuery.contains("workout") || lowerQuery.contains("exercise") || lowerQuery.contains("routine")) {
            sb.append("**Recommended Workout Plan:**\n");
            if (goal.toLowerCase().contains("muscle")) {
                sb.append("- **Focus:** Hypertrophy & progressive overload (3-4 days/week).\n");
                sb.append("- **Compound Lifts:** Squats, Romanian Deadlifts, Overhead Press, Pull-ups / Lat Pulldowns.\n");
                sb.append("- **Rep Ranges:** 3-4 sets of 8-12 reps with 90s rest between sets.\n");
                sb.append("- **Progression:** Increase weight or reps every 1-2 weeks.\n");
            } else if (goal.toLowerCase().contains("loss")) {
                sb.append("- **Focus:** Caloric expenditure + lean muscle retention.\n");
                sb.append("- **Circuit/HIIT:** 20-30 minutes of interval training 2x weekly + 3 strength sessions.\n");
                sb.append("- **Daily Movement:** Target 8,000–10,000 daily steps for steady NEAT.\n");
            } else {
                sb.append("- **Balanced Split:** 3 days full-body resistance training + 2 days brisk cardio/mobility.\n");
                sb.append("- **Mobility & Core:** 10 mins dynamic warm-up before sessions.\n");
            }
        } else if (lowerQuery.contains("eat") || lowerQuery.contains("food") || lowerQuery.contains("nutrition") || lowerQuery.contains("diet")) {
            sb.append("**Nutrition & Pre-Exercise Fuel:**\n");
            sb.append("- **Pre-Workout (60-90 min before):** Easily digestible carbohydrates + moderate protein (e.g., oatmeal with banana, or whole grain toast with peanut butter).\n");
            sb.append("- **Hydration:** 400-500ml water 1 hour prior to your session.\n");
            sb.append("- **Post-Workout Recovery (within 45 min):** 20-30g of complete protein (whey, Greek yogurt, or chicken breast) + complex carbohydrates to replenish glycogen.\n");
            sb.append("- **Daily Protein Target:** Aim for 1.6–2.0g of protein per kg of body weight.\n");
        } else if (lowerQuery.contains("hydration") || lowerQuery.contains("water") || lowerQuery.contains("recovery")) {
            sb.append("**Hydration & Recovery Protocol:**\n");
            sb.append("- **Daily Water Intake:** Target 30-35ml per kg of body weight (approx 2.5 - 3.5 Liters daily).\n");
            sb.append("- **Electrolytes:** Add a pinch of sea salt or electrolyte powder during intense workouts lasting > 45 mins.\n");
            sb.append("- **Sleep Quality:** 7-9 hours of consistent sleep is essential for hormonal balance and muscle repair.\n");
            sb.append("- **Active Recovery:** Foam rolling, 20-minute light walks, and static stretching on rest days.\n");
        } else {
            sb.append("**Personalized Fitness & Wellness Guidance:**\n");
            sb.append("- **Consistency First:** Adhere to 3-5 structured training sessions per week tailored to your ").append(goal).append(" goal.\n");
            sb.append("- **Track Progress:** Regularly log your body weight and workout metrics in your FitTrack dashboard.\n");
            sb.append("- **Mindful Nutrition:** Focus on whole foods, adequate dietary fiber, and quality protein sources.\n");
            sb.append("- **Rest:** Allow at least 48 hours before retraining the same muscle groups.\n");
        }

        sb.append("\n*Tip: Connect your Google Gemini API Key in the backend (`GEMINI_API_KEY`) to unlock unlimited conversational AI responses!*");

        return sb.toString();
    }
}
