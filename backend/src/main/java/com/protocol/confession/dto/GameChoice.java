package com.protocol.confession.dto;

import java.util.List;

/**
 * Represents a single choice available to the player in a scene
 */
public class GameChoice {

    private String choiceId;
    private String choiceText;
    private String nextSceneId;
    private StatModifier statModifiers;
    private List<ConditionalResponse> conditionalResponses;

    public GameChoice() {
    }

    public GameChoice(String choiceId, String choiceText, String nextSceneId, 
                      StatModifier statModifiers, List<ConditionalResponse> conditionalResponses) {
        this.choiceId = choiceId;
        this.choiceText = choiceText;
        this.nextSceneId = nextSceneId;
        this.statModifiers = statModifiers;
        this.conditionalResponses = conditionalResponses;
    }

    public String getChoiceId() {
        return choiceId;
    }

    public String getChoiceText() {
        return choiceText;
    }

    public String getNextSceneId() {
        return nextSceneId;
    }

    public StatModifier getStatModifiers() {
        return statModifiers;
    }

    public List<ConditionalResponse> getConditionalResponses() {
        return conditionalResponses;
    }

    public void setChoiceId(String choiceId) {
        this.choiceId = choiceId;
    }

    public void setChoiceText(String choiceText) {
        this.choiceText = choiceText;
    }

    public void setNextSceneId(String nextSceneId) {
        this.nextSceneId = nextSceneId;
    }

    public void setStatModifiers(StatModifier statModifiers) {
        this.statModifiers = statModifiers;
    }

    public void setConditionalResponses(List<ConditionalResponse> conditionalResponses) {
        this.conditionalResponses = conditionalResponses;
    }
}