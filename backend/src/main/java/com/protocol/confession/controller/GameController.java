package com.protocol.confession.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.protocol.confession.dto.GameState;
import com.protocol.confession.dto.PlayerChoice;

import java.util.List;

@RestController
public class GameController {
   
    @GetMapping("/start")
    public GameState startGame() {

        String phase = "Phase 1 - The Interview";
        String narrative = "You enter the room. The Subject sits calmly, hands resting on the table. They look up as you enter. Something in their eyes—recognition? No. Impossible.";
        String subjectDialogue = "..."; // The subject is silent initially
        List<String> choices = List.of(
            "\"You understand why you're here?\"",
            "\"Let's start with your name.\"",
            "[Say nothing and wait]"
        );

        return new GameState(phase, narrative, subjectDialogue, choices);

    }

    @PostMapping("/choice")
    public GameState makeChoice(@RequestBody PlayerChoice playerChoice) {

        String chosenText = playerChoice.getChoiceText();
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
        } else {
            nextNarrative = "The Subject smiles faintly, a knowing look in their eyes. The silence stretches, becoming a weapon in its own right.";
            nextSubjectDialogue = "..."; // The subject remains silent
            nextChoices = List.of("\"The security breach occurred at 0347 hours. Where were you?\"", "\"Let's try this again.\"");
        }

        return new GameState(nextPhase, nextNarrative, nextSubjectDialogue, nextChoices);
    }


}


