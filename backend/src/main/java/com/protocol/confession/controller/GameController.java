package com.protocol.confession.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.protocol.confession.dto.GameState;

import java.util.List;

@RestController
public class GameController {
   
    @GetMapping("/start")
    public GameState startGame() {

        String phase = "Phase 1 - The Interview";
        String openingDialogue = "You enter the room. The Subject sits calmly, hands resting on the table. They look up as you enter. Something in their eyes—recognition? No. Impossible.";
        List<String> choices = List.of(
            "\"You understand why you're here?\"",
            "\"Let's start with your name.\"",
            "[Say nothing and wait]"
        );



        return new GameState(phase, openingDialogue, choices);
    }

}
