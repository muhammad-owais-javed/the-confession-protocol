package com.protocol.confession.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameState {

    private String currentPhase;
    private String narrativeText;
    private String subjectDialogue;
    private List<String> availableChoices;
    private List<ConversationHistory> conversationHistory;

    private Map<String, Integer> psychologicalStats;
    private String currentSceneId;
    private String chosenText;



    // Making default constructor to avoid serialization scenarios failure
     public GameState() {

        this.conversationHistory = List.of();
        this.psychologicalStats = new HashMap<>();
        this.currentSceneId = null;


    }   

    public GameState(String currentPhase, String narrativeText, String subjectDialogue, 
                 List<String> availableChoices, List<ConversationHistory> conversationHistory, String currentSceneId) {
        this(currentPhase, narrativeText, subjectDialogue, availableChoices, conversationHistory, new HashMap<>(), currentSceneId);
    }
    
    public GameState(String currentPhase, String narrativeText, String subjectDialogue, 
                 List<String> availableChoices, List<ConversationHistory> conversationHistory,
                 Map<String, Integer> psychologicalStats, String currentSceneId) {
        this.currentPhase = currentPhase;
        this.narrativeText = narrativeText;
        this.subjectDialogue = subjectDialogue;
        this.availableChoices = availableChoices;
        this.conversationHistory = conversationHistory;
        this.psychologicalStats = psychologicalStats;
        this.currentSceneId = currentSceneId;

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
    
    public Map<String, Integer> getPsychologicalStats() {
    return psychologicalStats;
    }

    public void setPsychologicalStats(Map<String, Integer> psychologicalStats) {
    this.psychologicalStats = psychologicalStats;
    }


    public GameState(String currentPhase, List<String> availableChoices){
        this(currentPhase,"", "...", availableChoices, new ArrayList<>(), new HashMap<>(), null);
    }

    public String getChosenText() {
    return chosenText;
}

    public void setChosenText(String chosenText) {
    this.chosenText = chosenText;
}

    public String getCurrentSceneId() {
    return currentSceneId;

    }

    public void setCurrentSceneId(String currentSceneId) {
    this.currentSceneId = currentSceneId;
    }
}