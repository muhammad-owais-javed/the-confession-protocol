package com.protocol.confession.dto;

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


    public GameScene() {
    }

    public GameScene(String sceneId, String sceneName, String narrative,String subjectDialogue, List<GameChoice> choices) {
        this.sceneId = sceneId;
        this.sceneName = sceneName;
        this.narrative = narrative;
        this.subjectDialogue = subjectDialogue;
        this.choices = choices;
    }

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
        this.choices = choices;
    }

    public String getCurrentSceneId() {
        return currentSceneId;
    }

    public void setCurrentSceneId(String currentSceneId) {
    this.currentSceneId = currentSceneId;
    }

    public List<Map<String, Object>> getCharacters() {
    return characters;
    }

    public void setCharacters(List<Map<String, Object>> characters) {
        this.characters = characters;
    }

}