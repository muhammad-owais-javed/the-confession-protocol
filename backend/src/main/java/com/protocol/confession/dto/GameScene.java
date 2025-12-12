// src/main/java/com/protocol/confession/dto/GameScene.java

package com.protocol.confession.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameScene {

    // Original fields
    private String sceneId;
    private String sceneName;
    private String narrative;
    private String subjectDialogue;
    private List<GameChoice> choices;

    // NEW FIELDS - Add these
    private String backgroundImage;
    private Map<String, String> characterImages;
    private List<String> introImages;
    private String backgroundMusic;
    private Double musicVolume;
    private String dialogueSound;
    private Map<String, Object> narrativeSounds;

    // Default constructor
    public GameScene() {
        this.choices = new ArrayList<>();
        this.characterImages = new HashMap<>();
        this.introImages = new ArrayList<>();
    }

    // Getters and Setters for ORIGINAL fields
    public String getSceneId() {
        return sceneId;
    }

    public void setSceneId(String sceneId) {
        this.sceneId = sceneId;
    }

    public String getSceneName() {
        return sceneName;
    }

    public void setSceneName(String sceneName) {
        this.sceneName = sceneName;
    }

    public String getNarrative() {
        return narrative;
    }

    public void setNarrative(String narrative) {
        this.narrative = narrative;
    }

    public String getSubjectDialogue() {
        return subjectDialogue;
    }

    public void setSubjectDialogue(String subjectDialogue) {
        this.subjectDialogue = subjectDialogue;
    }

    public List<GameChoice> getChoices() {
        return choices;
    }

    public void setChoices(List<GameChoice> choices) {
        this.choices = choices;
    }

    // Getters and Setters for NEW fields
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
}