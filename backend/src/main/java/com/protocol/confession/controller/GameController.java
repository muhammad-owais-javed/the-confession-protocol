package com.protocol.confession.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.protocol.confession.dto.GameState;
import com.protocol.confession.dto.PlayerChoice;
import com.protocol.confession.services.GameService;

import java.util.List;

@RestController
public class GameController {
   
    @Autowired
    private GameService gameService;



    @GetMapping("/start")
    public GameState startGame() {

        return gameService.initializeGame();

    }

    @PostMapping("/choice")
    public GameState makeChoice(@RequestBody GameState gameState) {

        String chosenText = gameState.getAvailableChoices().get(0);
        return gameService.processPlayerChoice(chosenText, gameState.getConversationHistory());

    }

    @GetMapping("/end")
    public GameState endGame() {

        return new GameState(null, null, null, null);
    }
}


