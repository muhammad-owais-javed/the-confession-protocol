package com.protocol.confession.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController {
   
    @GetMapping("/start")
    public String startGame() {
        return "You are Auditor 07. You've been called in for a special case. You head to Interrogation Room 07, confident as always.";
    }

}
