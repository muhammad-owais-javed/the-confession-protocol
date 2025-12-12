package com.protocol.confession.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents a single scene in the game
 * A scene has narrative, character dialogue, and choices
 */
public class GameScene {

    private String sceneId;
    private String sceneName;
    private String narrative;
    private String subjectDialogue;
    private List<GameChoice> choices;
    private List<Map<String, Object>> characters;
    private String currentSceneId;

    // NEW FIELDS FOR VISUALS
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
        this.characters = new ArrayList<>();
        this.characterImages = new HashMap<>();
        this.introImages = new ArrayList<>();
    }

    // Constructor with original fields
    public GameScene(String sceneId, String sceneName, String narrative, String subjectDialogue,
                     List<GameChoice> choices) {
        this.sceneId = sceneId;
        this.sceneName = sceneName;
        this.narrative = narrative;
        this.subjectDialogue = subjectDialogue;
        this.choices = choices != null ? choices : new ArrayList<>();
        this.characters = new ArrayList<>();
        this.characterImages = new HashMap<>();
        this.introImages = new ArrayList<>();
    }

    // ORIGINAL GETTERS
    public String getSceneId() {
        return sceneId;
    }

    public String getSceneName() {
        return sceneName;
    }

    public String getNarrative() {
        return narrative;
    }

    public String getSubjectDialogue() {
        return subjectDialogue;
    }

    public List<GameChoice> getChoices() {
        return choices;
    }

    public String getCurrentSceneId() {
        return currentSceneId;
    }

    public List<Map<String, Object>> getCharacters() {
        return characters;
    }

    // ORIGINAL SETTERS
    public void setSceneId(String sceneId) {
        this.sceneId = sceneId;
    }

    public void setSceneName(String sceneName) {
        this.sceneName = sceneName;
    }

    public void setNarrative(String narrative) {
        this.narrative = narrative;
    }

    public void setSubjectDialogue(String subjectDialogue) {
        this.subjectDialogue = subjectDialogue;
    }

    public void setChoices(List<GameChoice> choices) {
        this.choices = choices != null ? choices : new ArrayList<>();
    }

    public void setCurrentSceneId(String currentSceneId) {
        this.currentSceneId = currentSceneId;
    }

    public void setCharacters(List<Map<String, Object>> characters) {
        this.characters = characters != null ? characters : new ArrayList<>();
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
}