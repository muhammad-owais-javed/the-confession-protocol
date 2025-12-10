package com.protocol.confession.services;

import java.util.ArrayList;
import java.util.List;


import org.slf4j.helpers.CheckReturnValue;
import org.springframework.stereotype.Service;

import com.protocol.confession.dto.GameState;
import com.protocol.confession.dto.ConversationHistory;


@Service
public class GameService {

    public GameState initializeGame(){


        String phase = "Phase 1 - The Interview";
        String narrative = "You enter the room. The Subject sits calmly, hands resting on the table. They look up as you enter. Something in their eyes—recognition? No. Impossible.";
        String subjectDialogue = "..."; // The subject is silent initially
        List<String> choices = List.of(
            "\"You understand why you're here?\"",
            "\"Let's start with your name.\"",
            "[Say nothing and wait]"
        );

        return new GameState(phase, narrative, subjectDialogue, choices, new ArrayList<>());
    }

    public GameState processPlayerChoice(String chosenText, List<ConversationHistory> currentHistory) {
        String nextPhase = "Phase 1 - The Interview";
        String nextNarrative = "";
        String nextSubjectDialogue;
        List<String> nextChoices;

        if (chosenText.contains("understand why you're here")) {
            nextNarrative = "The Subject's voice is calm, measured. It holds no trace of fear.";
            nextSubjectDialogue = "I understand why *you* think I'm here.";
            nextChoices = List.of("\"Then you admit involvement.\"", "\"Don't play games with me.\"");
        } else if (chosenText.contains("your name")) {
            nextNarrative = "They lean forward slightly, their eyes fixed on yours.";
            nextSubjectDialogue = "A name is a label. It doesn't define what's inside. Wouldn't you agree, Auditor?";
            nextChoices = List.of("\"Just answer the question.\"", "\"What do you mean by that?\"");
        } else if (chosenText.contains("Say nothing")) {
            nextNarrative = "The silence stretches. Uncomfortable. The Subject studies you carefully.";
            nextSubjectDialogue = "I was wondering when you'd try that. The silent approach. How many times has it worked for you?";
            nextChoices = List.of("\"More than you'd think.\"", "\"Are you here to answer questions or ask them?\"");
        } else {
            // Default response for unhandled choices
            nextNarrative = "The Subject tilts their head slightly.";
            nextSubjectDialogue = "Interesting choice of words.";
            nextChoices = List.of("\"Let's try this again.\"", "\"What are you smiling about?\"");
        }

        ConversationHistory newTurn = new ConversationHistory (
            chosenText,              
            nextSubjectDialogue,    
            nextNarrative            
        );

        List<ConversationHistory> updatedHistory = new ArrayList<>(currentHistory);  
        updatedHistory.add(newTurn);

        return new GameState(nextPhase, nextNarrative, nextSubjectDialogue, nextChoices, updatedHistory);
    }
    
}
