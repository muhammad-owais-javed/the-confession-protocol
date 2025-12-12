

package com.protocol.confession.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameState {

    private String currentPhase;
    private String sceneName;           // ADD THIS
    private String narrativeText;
    private String subjectDialogue;
    private List<String> availableChoices;
    private List<ConversationHistory> conversationHistory;

    private Map<String, Integer> psychologicalStats;
    private String currentSceneId;
    private String chosenText;

    // NEW FIELDS FOR VISUALS - ADD THESE
    private String backgroundImage;
    private Map<String, String> characterImages;
    private List<String> introImages;
    private String backgroundMusic;
    private Double musicVolume;
    private String dialogueSound;
    private Map<String, Object> narrativeSounds;
    private Boolean isEnding;
    // END NEW FIELDS

    public GameState() {
        this.conversationHistory = List.of();
        this.psychologicalStats = new HashMap<>();
        this.currentSceneId = null;
        this.characterImages = new HashMap<>();
        this.introImages = new ArrayList<>();
    }

    // ... KEEP ALL EXISTING CONSTRUCTORS AND GETTERS/SETTERS ...

    // ADD NEW GETTERS AND SETTERS
    public String getSceneName() {
        return sceneName;
    }

    public void setSceneName(String sceneName) {
        this.sceneName = sceneName;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public Map<String, String> getCharacterImages() {
        return characterImages;
    }

    public void setCharacterImages(Map<String, String> characterImages) {
        this.characterImages = characterImages;
    }

    public List<String> getIntroImages() {
        return introImages;
    }

    public void setIntroImages(List<String> introImages) {
        this.introImages = introImages;
    }

    public String getBackgroundMusic() {
        return backgroundMusic;
    }

    public void setBackgroundMusic(String backgroundMusic) {
        this.backgroundMusic = backgroundMusic;
    }

    public Double getMusicVolume() {
        return musicVolume;
    }

    public void setMusicVolume(Double musicVolume) {
        this.musicVolume = musicVolume;
    }

    public String getDialogueSound() {
        return dialogueSound;
    }

    public void setDialogueSound(String dialogueSound) {
        this.dialogueSound = dialogueSound;
    }

    public Map<String, Object> getNarrativeSounds() {
        return narrativeSounds;
    }

    public void setNarrativeSounds(Map<String, Object> narrativeSounds) {
        this.narrativeSounds = narrativeSounds;
    }

    public Boolean getIsEnding() {
        return isEnding;
    }

    public void setIsEnding(Boolean isEnding) {
        this.isEnding = isEnding;
    }
}