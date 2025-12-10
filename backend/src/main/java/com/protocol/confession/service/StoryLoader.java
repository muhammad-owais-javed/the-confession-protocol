package com.protocol.confession.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.protocol.confession.dto.GameScene;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StoryLoader {

    @Autowired
    private ResourceLoader resourceLoader;

    // Declare ObjectMapper as instance variable
    private ObjectMapper mapper = new ObjectMapper();

    private Map<String, GameScene> scenesCache = new HashMap<>();
    private String startSceneId;
    private boolean isLoaded = false;

    /**
     * Loads the story from game-story.json on first use
     */
    public void loadStory() {
        if (isLoaded) {
            return;  // Already loaded, don't load again
        }

        try {
            // Read the JSON file from resources folder
            InputStream inputStream = resourceLoader
                .getResource("classpath:game-story.json")
                .getInputStream();

            // Parse JSON
            Map<String, Object> storyData = mapper.readValue(inputStream, Map.class);

            // Extract game object
            Map<String, Object> gameData = (Map<String, Object>) storyData.get("game");
            this.startSceneId = (String) gameData.get("startSceneId");

            // Extract all scenes and cache them
            List<Map<String, Object>> phases = (List<Map<String, Object>>) gameData.get("phases");
            
            for (Map<String, Object> phase : phases) {
                List<Map<String, Object>> scenes = (List<Map<String, Object>>) phase.get("scenes");
                
                for (Map<String, Object> sceneData : scenes) {
                    // Convert map to GameScene object
                    GameScene scene = mapper.convertValue(sceneData, GameScene.class);
                    scenesCache.put(scene.getSceneId(), scene);
                }
            }

            isLoaded = true;
            System.out.println("✓ Story loaded successfully. Total scenes: " + scenesCache.size());

        } catch (Exception e) {
            System.err.println("✗ Error loading story: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Retrieve a scene by its ID
     * @param sceneId The ID of the scene to retrieve
     * @return The GameScene object, or null if not found
     */
    public GameScene getScene(String sceneId) {
        if (!isLoaded) {
            loadStory();
        }

        GameScene scene = scenesCache.get(sceneId);
        if (scene == null) {
            System.err.println("Scene not found: " + sceneId);
        }
        return scene;
    }

    /**
     * Get the starting scene ID
     * @return The ID of the first scene
     */
    public String getStartSceneId() {
        if (!isLoaded) {
            loadStory();
        }
        return startSceneId;
    }
}