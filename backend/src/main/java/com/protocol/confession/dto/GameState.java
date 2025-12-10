package com.protocol.confession.dto;

import java.util.ArrayList;
import java.util.List;

public class GameState {

    private String currentPhase;
    private String narrativeText;
    private String subjectDialogue;
    private List<String> availableChoices;
    private List<ConversationHistory> conversationHistory;

    // Making default constructor to avoid serialization scenarios failure
     public GameState() {

        this.conversationHistory = List.of();
    }   

    public GameState(String currentPhase, String narrativeText, String subjectDialogue, List<String> availableChoices) {
        this(currentPhase, narrativeText, subjectDialogue, availableChoices, new ArrayList<>());
    }
    
    public GameState(String currentPhase, String narrativeText, String subjectDialogue, List<String> availableChoices, List<ConversationHistory> conversationHistory) {
        
        this.currentPhase = currentPhase;
        this.narrativeText = narrativeText;
        this.subjectDialogue = subjectDialogue;
        this.availableChoices = availableChoices;
        this.conversationHistory = conversationHistory;

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

    public List<ConversationHistory> getConversationHistory() {
        return conversationHistory;
    }

    public void setCurrentPhase(String currentPhase) {
        this.currentPhase = currentPhase;
    }

    public void setNarrativeText(String narrativeText) {
        this.narrativeText = narrativeText;
    }

    public void setSubjectDialogue(String subjectDialogue) {
        this.subjectDialogue = subjectDialogue;
    }

    public void setAvailableChoices(List<String> availableChoices) {
        this.availableChoices = availableChoices;
    }

    public void setConversationHistory(List<ConversationHistory> conversationHistory) {
        this.conversationHistory = conversationHistory;
    }
    
}
