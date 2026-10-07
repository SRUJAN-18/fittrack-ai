package com.fittrack.ai.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ChatResponse {

    private boolean success;
    private String reply;
    private String timestamp;

    public ChatResponse() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    public ChatResponse(boolean success, String reply) {
        this.success = success;
        this.reply = reply;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    public static ChatResponse ok(String reply) {
        return new ChatResponse(true, reply);
    }

    public static ChatResponse error(String message) {
        return new ChatResponse(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
