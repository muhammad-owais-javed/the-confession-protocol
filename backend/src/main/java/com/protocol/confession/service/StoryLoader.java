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

    private ObjectMapper mapper = new ObjectMapper();

    private Map<String, GameScene> scenesCache = new HashMap<>();
    private List<Map<String, Object>> endingConditions;
    private String startSceneId;
    private boolean isLoaded = false;

    /**
     * Loads the story from multiple files:
     * - story-index.json (phases list)
     * - phase_X.json files (scenes)
     * - endings.json (ending conditions)
     * - endings_scenes.json (ending scene narratives)
     */
    public void loadStory() {
        if (isLoaded) {
            return;
        }

        try {
            // Load story index
            InputStream indexStream = resourceLoader
                .getResource("classpath:stories/story-index.json")
                .getInputStream();

            Map<String, Object> indexData = mapper.readValue(indexStream, Map.class);
            this.startSceneId = (String) indexData.get("startSceneId");

            // Load each phase file
            List<String> phaseFiles = (List<String>) indexData.get("phases");
            for (String phaseFile : phaseFiles) {
                loadPhaseFile(phaseFile);
            }

            // Load ending conditions
            loadEndingsFile();

            // Load ending scenes
            loadEndingScenesFile();

            isLoaded = true;
            System.out.println("✓ Story loaded successfully. Total scenes: " + scenesCache.size());

        } catch (Exception e) {
            System.err.println("✗ Error loading story: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Load a single phase file and cache all its scenes
     */
    private void loadPhaseFile(String phaseFileName) throws Exception {
        InputStream inputStream = resourceLoader
            .getResource("classpath:stories/phases/" + phaseFileName)
            .getInputStream();

        Map<String, Object> phaseData = mapper.readValue(inputStream, Map.class);
        List<Map<String, Object>> scenes = (List<Map<String, Object>>) phaseData.get("scenes");

        if (scenes != null) {
            for (Map<String, Object> sceneData : scenes) {
                GameScene scene = mapper.convertValue(sceneData, GameScene.class);
                scenesCache.put(scene.getSceneId(), scene);
                System.out.println("  Scene loaded: " + scene.getSceneId() + " (" + 
                                 (scene.getChoices() != null ? scene.getChoices().size() : 0) + 
                                 " choices)");
            }
        }
    }

    /**
     * Load ending conditions from endings.json
     */
    private void loadEndingsFile() throws Exception {
        InputStream endingsStream = resourceLoader
            .getResource("classpath:stories/endings.json")
            .getInputStream();

        Map<String, Object> endingsData = mapper.readValue(endingsStream, Map.class);
        this.endingConditions = (List<Map<String, Object>>) endingsData.get("endingConditions");

        System.out.println("✓ Endings loaded: " + 
                         (endingConditions != null ? endingConditions.size() : 0) + 
                         " condition(s)");
    }

    /**
     * Load ending scenes from endings_scenes.json and cache them
     */
    private void loadEndingScenesFile() throws Exception {
        InputStream endingScenesStream = resourceLoader
            .getResource("classpath:stories/endings_scenes.json")
            .getInputStream();

        Map<String, Object> endingScenesData = mapper.readValue(endingScenesStream, Map.class);
        List<Map<String, Object>> endingScenes = (List<Map<String, Object>>) endingScenesData.get("endingScenes");

        if (endingScenes != null) {
            for (Map<String, Object> sceneData : endingScenes) {
                GameScene scene = mapper.convertValue(sceneData, GameScene.class);
                scenesCache.put(scene.getSceneId(), scene);
                System.out.println("  Ending scene loaded: " + scene.getSceneId());
            }
        }

        System.out.println("✓ Ending scenes loaded: " + 
                         (endingScenes != null ? endingScenes.size() : 0) + 
                         " ending(s)");
    }

    /**
     * Retrieve a scene by its ID
     * Works for both regular scenes and ending scenes
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
     */
    public String getStartSceneId() {
        if (!isLoaded) {
            loadStory();
        }
        return startSceneId;
    }

    /**
     * Get all ending conditions
     */
    public List<Map<String, Object>> getEndingConditions() {
        if (!isLoaded) {
            loadStory();
        }
        return endingConditions;
    }
}