package com.protocol.confession.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.protocol.confession.dto.ConversationHistory;
import com.protocol.confession.dto.GameChoice;
import com.protocol.confession.dto.GameScene;
import com.protocol.confession.dto.GameState;

@Service
public class GameService {

    @Autowired
    private StoryLoader storyLoader;

    /**
     * Initializes the game - loads starting scene from JSON
     * @return Initial GameState
     */
    public GameState initializeGame() {
    String startSceneId = storyLoader.getStartSceneId();
    GameScene scene = storyLoader.getScene(startSceneId);
    
    if (scene == null) {
        return createErrorState("Failed to load starting scene");
    }

    Map<String, Integer> initialStats = createInitialStats();

    return new GameState(
        scene.getSceneName(),
        scene.getNarrative(),
        scene.getSubjectDialogue(),
        convertChoicesToText(scene.getChoices()),
        new ArrayList<>(),
        initialStats,
        startSceneId  // ADD THIS
        );
    }
    /**
     * Processes player's choice and returns next game state
     * @param chosenText The text of the choice player selected
     * @param currentHistory The conversation history so far
     * @param currentStats The current psychological stats
     * @return Updated GameState with next scene and updated stats
     */
    public GameState processPlayerChoice(String chosenText, List<ConversationHistory> currentHistory, 
                                    Map<String, Integer> currentStats, String currentSceneId) {
    
    // Get current scene from JSON
    GameScene currentScene = storyLoader.getScene(currentSceneId);
    if (currentScene == null) {
        return createErrorState("Current scene not found");
    }


    if (chosenText != null && chosenText.contains("[Restart Game]")) {
        // Reset stats when restarting
        Map<String, Integer> resetStats = createInitialStats();
        return initializeGame();
    }

    // Find the choice that matches chosenText
    GameChoice selectedChoice = null;
    for (GameChoice choice : currentScene.getChoices()) {
        if (choice.getChoiceText().equals(chosenText)) {
            selectedChoice = choice;
            break;
        }
    }

    if (selectedChoice == null) {
        return createErrorState("Choice not found");
    }

    // Get next scene using nextSceneId from the choice
    String nextSceneId = selectedChoice.getNextSceneId();
    GameScene nextScene = storyLoader.getScene(nextSceneId);

    if (nextScene == null) {
        return createErrorState("Next scene not found: " + nextSceneId);
    }

    // Update stats based on statModifiers from the choice
    Map<String, Integer> updatedStats = new HashMap<>(currentStats);
    if (selectedChoice.getStatModifiers() != null) {
        updatedStats.put("denial", updatedStats.get("denial") + selectedChoice.getStatModifiers().getDenial());
        updatedStats.put("guilt", updatedStats.get("guilt") + selectedChoice.getStatModifiers().getGuilt());
        updatedStats.put("confusion", updatedStats.get("confusion") + selectedChoice.getStatModifiers().getConfusion());
        updatedStats.put("enlightenment", updatedStats.get("enlightenment") + selectedChoice.getStatModifiers().getEnlightenment());
        
        // Clamp stats 0-100
        for (String statName : updatedStats.keySet()) {
            int value = updatedStats.get(statName);
            updatedStats.put(statName, Math.max(0, Math.min(100, value)));
        }
    }

    // Create conversation history entry
    ConversationHistory newTurn = new ConversationHistory(
        chosenText,
        nextScene.getSubjectDialogue(),
        nextScene.getNarrative()
    );

    List<ConversationHistory> updatedHistory = new ArrayList<>(currentHistory);
    updatedHistory.add(newTurn);

    return new GameState(
        nextScene.getSceneName(),  // Use scene name instead of hardcoded phase
    nextScene.getNarrative(),
    nextScene.getSubjectDialogue(),
    convertChoicesToText(nextScene.getChoices()),
    updatedHistory,
    updatedStats,
        nextSceneId
        );
    }

    /**
     * Create initial psychological stats (all at 0)
     */
    private Map<String, Integer> createInitialStats() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("denial", 0);
        stats.put("guilt", 0);
        stats.put("confusion", 0);
        stats.put("enlightenment", 0);
        return stats;
    }

    /**
     * Convert GameChoice list to simple text list for frontend
     */
    private List<String> convertChoicesToText(List<GameChoice> choices) {
        List<String> choiceTexts = new ArrayList<>();
        if (choices != null) {
            for (GameChoice choice : choices) {
                choiceTexts.add(choice.getChoiceText());
            }
        }
        return choiceTexts;
    }

    /**
     * Find the next scene based on player's choice
     * (Simplified - in full game, track current scene in GameState)
     */
    private GameScene findNextScene(String chosenText, List<ConversationHistory> history) {
        // This is a temporary placeholder
        // In a full implementation, you'd:
        // 1. Track current scene ID in GameState
        // 2. Look up the choice that matches chosenText
        // 3. Get nextSceneId from that choice
        // 4. Load that scene
        
        // For now, return a generic next scene (hardcoded for testing)
        return storyLoader.getScene("phase_1_scene_q1_response");
    }

    /**
     * Apply stat modifiers based on the choice made
     */
    private void applyStatModifiers(Map<String, Integer> stats, String chosenText) {
        // This would normally look up the choice in JSON and apply its statModifiers
        // For now, simple example:
        
        if (chosenText.contains("understand why you're here")) {
            stats.put("denial", stats.get("denial") + 5);
            stats.put("guilt", stats.get("guilt") - 5);
        } else if (chosenText.contains("your name")) {
            stats.put("denial", stats.get("denial") + 10);
            stats.put("enlightenment", stats.get("enlightenment") - 5);
        }
        
        // Clamp stats between 0-100
        for (String statName : stats.keySet()) {
            int value = stats.get(statName);
            stats.put(statName, Math.max(0, Math.min(100, value)));
        }
    }

    /**
     * Get dialogue that might change based on current stats
     */
    private String getConditionalDialogue(String baseDialogue, List<GameChoice> choices, 
                                         Map<String, Integer> stats) {
        // This would check conditionalResponses in the choice
        // For now, just return base dialogue
        return baseDialogue;
    }

    /**
     * Create an error state if something goes wrong
     */
    private GameState createErrorState(String message) {
        return new GameState(
            "ERROR",
            message,
            "...",
            List.of("[Restart Game]"),
            new ArrayList<>(),
            createInitialStats(),
            "error"
        );
    }



    private boolean checkEndingConditions(Map<String, Integer> stats) {
    int denial = stats.get("denial");
    int guilt = stats.get("guilt");
    int confusion = stats.get("confusion");
    int enlightenment = stats.get("enlightenment");
    
    // Check Ending A: Acceptance
    if (guilt >= 65 && denial <= 35 && enlightenment <= 60) {
        return true;  // Trigger Ending A
    }
    
    // Check Ending B: Denial
    if (denial >= 70) {
        return true;  // Trigger Ending B
    }
    
    // Check Ending C: Awakening
    if (enlightenment >= 70 && confusion >= 65 && denial <= 50) {
        return true;  // Trigger Ending C
    }
    
    // Check Ending D: Willing Return
    if (enlightenment >= 70 && guilt >= 65 && confusion <= 55) {
        return true;  // Trigger Ending D
    }
    
    return false;
    }


}