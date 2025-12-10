package com.protocol.confession.dto;

public class ConversationHistory {

    private String auditorDialogue;
    private String subjectDialogue;
    private String narrativeText;

    public ConversationHistory() {
    }
    
    public ConversationHistory(String auditorDialogue, String subjectDialogue, String narrativeText) {
        this.auditorDialogue = auditorDialogue;
        this.subjectDialogue = subjectDialogue;
        this.narrativeText = narrativeText;
    }

    public String getAuditorDialogue() {
        return auditorDialogue;
    }

    public void setAuditorDialogue(String auditorDialogue) {
        this.auditorDialogue = auditorDialogue;
    }

    public String getSubjectDialogue() {
        return subjectDialogue;
    }

    public void setSubjectDialogue(String subjectDialogue) {
        this.subjectDialogue = subjectDialogue;
    }

    public String getNarrativeText() {
        return narrativeText;
    }

    public void setNarrativeText(String narrativeText) {
        this.narrativeText = narrativeText;
    }
    
}
