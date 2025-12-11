package com.protocol.confession.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.protocol.confession.dto.GameState;
import com.protocol.confession.dto.PlayerChoice;
import com.protocol.confession.service.GameService;

import java.util.List;

@RestController
public class GameController {
   
    @Autowired
    private GameService gameService;

    @GetMapping("/menu")
public String getMenu() {
    return "<!DOCTYPE html><html><body>" +
           "<h1>The Confession Protocol</h1>" +
           "<p>A psychological thriller about truth, guilt, and cycles.</p>" +
           "<button onclick=\"startGame()\">Start Game</button>" +
           "<script>" +
           "function startGame() { window.location.href = '/'; }" +
           "</script>" +
           "</body></html>";
}


    @GetMapping("/start")
    public GameState startGame() {

        return gameService.initializeGame();

    }
    
@PostMapping("/choice")
public GameState makeChoice(@RequestBody GameState gameState) {
    String chosenText = gameState.getChosenText();
    
    return gameService.processPlayerChoice(chosenText, gameState.getConversationHistory(), 
                                          gameState.getPsychologicalStats(), gameState.getCurrentSceneId());
}
}


