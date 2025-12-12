package com.protocol.confession.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameState {

    private String currentPhase;
    private String sceneName;
    private String narrativeText;
    private String subjectDialogue;
    private List<String> availableChoices;
    private List<ConversationHistory> conversationHistory;
    private Map<String, Integer> psychologicalStats;
    private String currentSceneId;
    private String chosenText;

    // NEW FIELDS FOR VISUALS
    private String backgroundImage;
    private Map<String, String> characterImages;
    private List<String> introImages;
    private String backgroundMusic;
    private Double musicVolume;
    private String dialogueSound;
    private Map<String, Object> narrativeSounds;
    private Boolean isEnding;

    // Default constructor
    public GameState() {
        this.availableChoices = new ArrayList<>();
        this.conversationHistory = new ArrayList<>();
        this.psychologicalStats = new HashMap<>();
        this.characterImages = new HashMap<>();
        this.introImages = new ArrayList<>();
        this.isEnding = false;
    }

    // Constructor with basic fields
    public GameState(String currentPhase, String narrativeText, String subjectDialogue,
                     List<String> availableChoices, List<ConversationHistory> conversationHistory,
                     String currentSceneId) {
        this(currentPhase, narrativeText, subjectDialogue, availableChoices, conversationHistory,
             new HashMap<>(), currentSceneId);
    }

    // Constructor with stats
    public GameState(String currentPhase, String narrativeText, String subjectDialogue,
                     List<String> availableChoices, List<ConversationHistory> conversationHistory,
                     Map<String, Integer> psychologicalStats, String currentSceneId) {
        this.currentPhase = currentPhase;
        this.narrativeText = narrativeText;
        this.subjectDialogue = subjectDialogue;
        this.availableChoices = availableChoices != null ? availableChoices : new ArrayList<>();
        this.conversationHistory = conversationHistory != null ? conversationHistory : new ArrayList<>();
        this.psychologicalStats = psychologicalStats != null ? psychologicalStats : new HashMap<>();
        this.currentSceneId = currentSceneId;
        this.characterImages = new HashMap<>();
        this.introImages = new ArrayList<>();
        this.isEnding = false;
    }

    // Simple constructor for quick instantiation
    public GameState(String currentPhase, List<String> availableChoices) {
        this(currentPhase, "", "...", availableChoices, new ArrayList<>(), new HashMap<>(), null);
    }

    // ORIGINAL GETTERS
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

    public Map<String, Integer> getPsychologicalStats() {
        return psychologicalStats;
    }

    public String getCurrentSceneId() {
        return currentSceneId;
    }

    public String getChosenText() {
        return chosenText;
    }

    public String getSceneName() {
        return sceneName;
    }

    // ORIGINAL SETTERS
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
        this.availableChoices = availableChoices != null ? availableChoices : new ArrayList<>();
    }

    public void setConversationHistory(List<ConversationHistory> conversationHistory) {
        this.conversationHistory = conversationHistory != null ? conversationHistory : new ArrayList<>();
    }

    public void setPsychologicalStats(Map<String, Integer> psychologicalStats) {
        this.psychologicalStats = psychologicalStats != null ? psychologicalStats : new HashMap<>();
    }

    public void setCurrentSceneId(String currentSceneId) {
        this.currentSceneId = currentSceneId;
    }

    public void setChosenText(String chosenText) {
        this.chosenText = chosenText;
    }

    public void setSceneName(String sceneName) {
        this.sceneName = sceneName;
    }

    // NEW GETTERS FOR VISUAL FIELDS
    public String getBackgroundImage() {
        return backgroundImage;
    }

    public Map<String, String> getCharacterImages() {
        return characterImages;
    }

    public List<String> getIntroImages() {
        return introImages;
    }

    public String getBackgroundMusic() {
        return backgroundMusic;
    }

    public Double getMusicVolume() {
        return musicVolume;
    }

    public String getDialogueSound() {
        return dialogueSound;
    }

    public Map<String, Object> getNarrativeSounds() {
        return narrativeSounds;
    }

    public Boolean getIsEnding() {
        return isEnding;
    }

    // NEW SETTERS FOR VISUAL FIELDS
    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public void setCharacterImages(Map<String, String> characterImages) {
        this.characterImages = characterImages != null ? characterImages : new HashMap<>();
    }

    public void setIntroImages(List<String> introImages) {
        this.introImages = introImages != null ? introImages : new ArrayList<>();
    }

    public void setBackgroundMusic(String backgroundMusic) {
        this.backgroundMusic = backgroundMusic;
    }

    public void setMusicVolume(Double musicVolume) {
        this.musicVolume = musicVolume;
    }

    public void setDialogueSound(String dialogueSound) {
        this.dialogueSound = dialogueSound;
    }

    public void setNarrativeSounds(Map<String, Object> narrativeSounds) {
        this.narrativeSounds = narrativeSounds;
    }

    public void setIsEnding(Boolean isEnding) {
        this.isEnding = isEnding != null ? isEnding : false;
    }
}