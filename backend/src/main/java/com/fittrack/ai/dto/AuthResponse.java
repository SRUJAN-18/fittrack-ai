package com.fittrack.ai.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String name;
    private String email;
    private String token; // Token or session identifier for REST communication

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, Long userId, String name, String email, String token) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.token = token;
    }

    public static AuthResponse failure(String message) {
        return new AuthResponse(false, message, null, null, null, null);
    }

    public static AuthResponse success(String message, Long userId, String name, String email, String token) {
        return new AuthResponse(true, message, userId, name, email, token);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
