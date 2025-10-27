package com.protocol.confession.dto;

import java.util.List;

public class GameState {

    private String currentPhase;
    private String dialogue;
    private List<String> availableChoices;

    public GameState(String currentPhase, String dialogue, List<String> availableChoices) {
        
        this.currentPhase = currentPhase;
        this.dialogue = dialogue;
        this.availableChoices = availableChoices;

    }

    public String getCurrentPhase() {
        return currentPhase;
    }
    
    public String getDialogue() {
        return dialogue;
    }

    public List<String> getAvailableChoices() {
        return availableChoices;
    }
    
}
