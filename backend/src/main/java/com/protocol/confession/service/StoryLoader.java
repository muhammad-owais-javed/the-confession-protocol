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
        return;
    }

    try {
        // Load index file
        InputStream indexStream = resourceLoader
            .getResource("classpath:stories/story-index.json")
            .getInputStream();

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> indexData = mapper.readValue(indexStream, Map.class);

        this.startSceneId = (String) indexData.get("startSceneId");
        
        // Load phase files
        List<String> phaseFiles = (List<String>) indexData.get("phases");
        for (String phaseFile : phaseFiles) {
            loadPhaseFile(phaseFile, mapper);
        }

        // Load endings file - ADD THIS
        loadEndingsFile(mapper);

        isLoaded = true;
        System.out.println("✓ Story loaded successfully. Total scenes: " + scenesCache.size());

    } catch (Exception e) {
        System.err.println("✗ Error loading story: " + e.getMessage());
        e.printStackTrace();
    }
}

private void loadPhaseFile(String phaseFileName, ObjectMapper mapper) throws Exception {
    InputStream inputStream = resourceLoader
        .getResource("classpath:stories/phases/" + phaseFileName)
        .getInputStream();

    Map<String, Object> phaseData = mapper.readValue(inputStream, Map.class);

    // Extract scenes from this phase
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


    private List<Map<String, Object>> endingConditions;

    public List<Map<String, Object>> getEndingConditions() {
    if (!isLoaded) {
        loadStory();
    }
    return endingConditions;
}

/**
 * Load ending conditions from separate endings.json file
 */
private void loadEndingsFile(ObjectMapper mapper) throws Exception {
    InputStream endingsStream = resourceLoader
        .getResource("classpath:stories/endings.json")
        .getInputStream();

    Map<String, Object> endingsData = mapper.readValue(endingsStream, Map.class);
    this.endingConditions = (List<Map<String, Object>>) endingsData.get("endingConditions");
    
    System.out.println("✓ Endings loaded: " + (endingConditions != null ? endingConditions.size() : 0) + " conditions");
}

}