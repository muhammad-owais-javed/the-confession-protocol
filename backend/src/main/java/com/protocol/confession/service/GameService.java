package com.protocol.confession.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.protocol.confession.dto.GameChoice;
import com.protocol.confession.dto.GameScene;
import com.protocol.confession.dto.GameState;
import com.protocol.confession.dto.StatModifier;
import com.protocol.confession.dto.ConversationHistory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GameService {

    @Autowired
    private StoryLoader storyLoader;

    /**
     * Initialize the game - return the first scene
     */
    public GameState initializeGame() {
        String startSceneId = storyLoader.getStartSceneId();
        GameScene startScene = storyLoader.getScene(startSceneId);
        
        if (startScene == null) {
            throw new RuntimeException("Start scene not found: " + startSceneId);
        }

        GameState gameState = new GameState();
        gameState.setCurrentSceneId(startSceneId);
        gameState.setPsychologicalStats(new HashMap<>());
        gameState.setConversationHistory(new ArrayList<>());
        gameState.setAvailableChoices(new ArrayList<>());

        // Map scene data to game state
        mapSceneToGameState(startScene, gameState, null);

        return gameState;
    }

    /**
     * Process player choice and return next game state
     */
    public GameState processPlayerChoice(String chosenText, List<ConversationHistory> conversationHistory,
                                    Map<String, Integer> currentStats, String currentSceneId) {
    
    // Get current scene
    GameScene currentScene = storyLoader.getScene(currentSceneId);
    if (currentScene == null) {
        throw new RuntimeException("Scene not found: " + currentSceneId);
    }

    // Find the matching choice
    GameChoice selectedChoice = null;
    if (currentScene.getChoices() != null) {
        for (GameChoice choice : currentScene.getChoices()) {
            if (choice.getChoiceText().equals(chosenText)) {
                selectedChoice = choice;
                break;
            }
        }
    }

    if (selectedChoice == null) {
        throw new RuntimeException("Choice not found: " + chosenText);
    }

    // Apply stat modifiers
    Map<String, Integer> updatedStats = new HashMap<>(currentStats);
    StatModifier statModifiers = selectedChoice.getStatModifiers();
    if (statModifiers != null) {
        if (statModifiers.getDenial() != null) {
            int currentValue = updatedStats.getOrDefault("denial", 0);
            updatedStats.put("denial", Math.max(0, Math.min(100, currentValue + statModifiers.getDenial())));
        }
        if (statModifiers.getGuilt() != null) {
            int currentValue = updatedStats.getOrDefault("guilt", 0);
            updatedStats.put("guilt", Math.max(0, Math.min(100, currentValue + statModifiers.getGuilt())));
        }
        if (statModifiers.getConfusion() != null) {
            int currentValue = updatedStats.getOrDefault("confusion", 0);
            updatedStats.put("confusion", Math.max(0, Math.min(100, currentValue + statModifiers.getConfusion())));
        }
        if (statModifiers.getEnlightenment() != null) {
            int currentValue = updatedStats.getOrDefault("enlightenment", 0);
            updatedStats.put("enlightenment", Math.max(0, Math.min(100, currentValue + statModifiers.getEnlightenment())));
        }
    }

    // Create conversation history entry
    List<ConversationHistory> updatedHistory = new ArrayList<>(conversationHistory);
    updatedHistory.add(new ConversationHistory(chosenText, "", ""));

    // Get next scene ID
    String nextSceneId = selectedChoice.getNextSceneId();

    // ===== NEW: CHECK IF THIS IS THE ENDING TRIGGER =====
    if ("ending_file_trigger".equals(nextSceneId)) {
        System.out.println("DEBUG: Ending trigger reached. Final stats: " + updatedStats);
        
        // Determine which ending is earned
        String earnedEndingId = determineEnding(updatedStats);
        
        if (earnedEndingId != null) {
            nextSceneId = earnedEndingId;
            System.out.println("DEBUG: Earned ending: " + earnedEndingId);
        } else {
            throw new RuntimeException("No ending condition met for stats: " + updatedStats);
        }
    }
    // ===== END OF NEW CODE =====

    // Get the (possibly updated) next scene
    GameScene nextScene = storyLoader.getScene(nextSceneId);
    if (nextScene == null) {
        throw new RuntimeException("Next scene not found: " + nextSceneId);
    }

    // Create new game state
    GameState gameState = new GameState();
    gameState.setCurrentSceneId(nextSceneId);
    gameState.setPsychologicalStats(updatedStats);
    gameState.setConversationHistory(updatedHistory);

    // Map scene data to game state
    mapSceneToGameState(nextScene, gameState, updatedStats);

    return gameState;
}

private String determineEnding(Map<String, Integer> stats) {
    List<Map<String, Object>> endingConditions = storyLoader.getEndingConditions();
    
    if (endingConditions == null || endingConditions.isEmpty()) {
        System.err.println("No ending conditions found");
        return null;
    }
    
    // Check each ending condition in order
    for (Map<String, Object> ending : endingConditions) {
        String endingId = (String) ending.get("endingId");
        Map<String, Object> conditions = (Map<String, Object>) ending.get("conditions");
        
        if (conditionsAreMet(stats, conditions)) {
            System.out.println("✓ Ending condition met: " + endingId);
            return endingId;
        }
    }
    
    System.err.println("No ending condition met for stats: " + stats);
    return null;
}

/**
 * Check if all stat conditions are satisfied for an ending
 */
private boolean conditionsAreMet(Map<String, Integer> stats, Map<String, Object> conditions) {
    for (String statName : conditions.keySet()) {
        Map<String, Integer> range = (Map<String, Integer>) conditions.get(statName);
        Integer min = range.get("min");
        Integer max = range.get("max");
        Integer currentValue = stats.getOrDefault(statName, 0);
        
        // If any stat doesn't meet its condition, return false
        if (currentValue < min || currentValue > max) {
            return false;
        }
    }
    
    return true;  // All stats meet conditions for this ending
}
    /**
     * Map GameScene data to GameState
     * This includes all visual fields (background, characters, music, etc.)
     */
    private void mapSceneToGameState(GameScene scene, GameState gameState, Map<String, Integer> stats) {
        // Original fields
        gameState.setSceneName(scene.getSceneName());
        gameState.setNarrativeText(scene.getNarrative());
        gameState.setSubjectDialogue(scene.getSubjectDialogue());
        
        // Extract phase from scene ID (e.g., "phase_1_scene_intro" -> "PHASE 1 - THE INTERVIEW")
        String phaseFromSceneId = extractPhaseFromSceneId(scene.getSceneId());
        gameState.setCurrentPhase(phaseFromSceneId);

        // Map available choices
        List<String> choiceTexts = new ArrayList<>();
        if (scene.getChoices() != null) {
            for (GameChoice choice : scene.getChoices()) {
                choiceTexts.add(choice.getChoiceText());
            }
        }
        gameState.setAvailableChoices(choiceTexts);

        // Map visual fields from scene
        if (scene.getBackgroundImage() != null) {
            gameState.setBackgroundImage(scene.getBackgroundImage());
        }

        if (scene.getCharacterImages() != null) {
            gameState.setCharacterImages(scene.getCharacterImages());
        }

        if (scene.getIntroImages() != null) {
            gameState.setIntroImages(scene.getIntroImages());
        }

        if (scene.getBackgroundMusic() != null) {
            gameState.setBackgroundMusic(scene.getBackgroundMusic());
        }

        if (scene.getMusicVolume() != null) {
            gameState.setMusicVolume(scene.getMusicVolume());
        }

        if (scene.getDialogueSound() != null) {
            gameState.setDialogueSound(scene.getDialogueSound());
        }

        if (scene.getNarrativeSounds() != null) {
            gameState.setNarrativeSounds(scene.getNarrativeSounds());
        }
    }

    /**
     * Extract phase name from scene ID
     * Example: "phase_1_scene_intro" -> "PHASE 1 - THE INTERVIEW"
     */
    private String extractPhaseFromSceneId(String sceneId) {
        if (sceneId.contains("phase_1")) return "PHASE 1 - THE INTERVIEW";
        if (sceneId.contains("phase_2")) return "PHASE 2 - THE REVELATION";
        if (sceneId.contains("phase_3")) return "PHASE 3 - THE BREAKDOWN";
        if (sceneId.contains("phase_4")) return "PHASE 4 - THE TRUTH";
        if (sceneId.contains("phase_5")) return "PHASE 5 - THE CHOICE";
        return "Unknown Phase";
    }

    /**
     * Check if current state reaches an ending condition
     */
    private boolean isEnding(String sceneId, Map<String, Integer> stats, 
                           List<Map<String, Object>> endingConditions) {
        // Simple check: if ending conditions list exists and scene matches
        if (endingConditions == null || endingConditions.isEmpty()) {
            return false;
        }

        for (Map<String, Object> condition : endingConditions) {
            // Check if scene ID matches any ending scene
            if (condition.get("sceneId") != null && 
                condition.get("sceneId").equals(sceneId)) {
                return true;
            }
        }

        return false;
    }
}