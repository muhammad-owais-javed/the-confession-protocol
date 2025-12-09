package com.protocol.confession.dto;

import java.util.List;

public class GameState {

    private String currentPhase;
    private String narrativeText;
    private String subjectDialogue;
    private List<String> availableChoices;

    // Making default constructor to avoid serialization scenarios failure
     public GameState() {
    }   
    
    public GameState(String currentPhase, String narrativeText, String subjectDialogue, List<String> availableChoices) {
        
        this.currentPhase = currentPhase;
        this.narrativeText = narrativeText;
        this.subjectDialogue = subjectDialogue;
        this.availableChoices = availableChoices;

    }

    public String getCurrentPhase() {
        return currentPhase;
    }

    public String getNarrativeText() {
        return narrativeText;
    }

    
    public String getSubjectDialogue() {
        return subjectDialogue;
    }

    public List<String> getAvailableChoices() {
        return availableChoices;
    }
    
}
