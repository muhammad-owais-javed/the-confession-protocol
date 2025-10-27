package com.protocol.confession.dto;

public class PlayerChoice {

    private String choiceText;

    // Default constructor for JSON deserialization (Testing for Jackson)
    public PlayerChoice() {
    }

    public String getChoiceText() {
        return choiceText;
    }
    
    public void setChoiceText(String choiceText){
        this.choiceText = choiceText;
    }

}
