package com.protocol.confession.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.protocol.confession.dto.GameScene;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
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

    @Autowired
    private Gson gson;

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
     */
    public void loadStory() {
        if (isLoaded) {
            return;
        }

        try {
            System.out.println("DEBUG: Starting to load story...");
            
            // Load story index
            System.out.println("DEBUG: Loading story-index.json...");
            InputStream indexStream = resourceLoader
                .getResource("classpath:stories/story-index.json")
                .getInputStream();

            Map<String, Object> indexData = mapper.readValue(indexStream, Map.class);
            this.startSceneId = (String) indexData.get("startSceneId");
            System.out.println("DEBUG: startSceneId = " + this.startSceneId);

            // Load each phase file
            List<String> phaseFiles = (List<String>) indexData.get("phases");
            System.out.println("DEBUG: Found " + (phaseFiles != null ? phaseFiles.size() : 0) + " phase files");
            
            if (phaseFiles != null) {
                for (String phaseFile : phaseFiles) {
                    System.out.println("DEBUG: Loading phase file: " + phaseFile);
                    loadPhaseFile(phaseFile);
                }
            }

            // Load ending conditions
            System.out.println("DEBUG: Loading endings.json...");
            loadEndingsFile();

            isLoaded = true;
            System.out.println("✓ Story loaded successfully. Total scenes: " + scenesCache.size());
            System.out.println("DEBUG: All scene IDs: " + scenesCache.keySet());

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

        // Use Gson to parse and extract all fields including visual ones
        JsonElement element = JsonParser.parseReader(
            new java.io.InputStreamReader(inputStream));
        JsonObject phaseData = element.getAsJsonObject();
        
        // Extract phase-level visual fields
        String backgroundMusic = null;
        Double musicVolume = null;
        List<String> introImages = null;
        
        if (phaseData.has("backgroundMusic")) {
            backgroundMusic = phaseData.get("backgroundMusic").getAsString();
        }
        if (phaseData.has("musicVolume")) {
            musicVolume = phaseData.get("musicVolume").getAsDouble();
        }
        if (phaseData.has("introImages")) {
            JsonArray introArray = phaseData.getAsJsonArray("introImages");
            introImages = new java.util.ArrayList<>();
            for (JsonElement img : introArray) {
                introImages.add(img.getAsString());
            }
        }

        // Load scenes
        JsonArray scenesArray = phaseData.getAsJsonArray("scenes");
        if (scenesArray != null) {
            for (JsonElement sceneElement : scenesArray) {
                JsonObject sceneJson = sceneElement.getAsJsonObject();
                GameScene scene = gson.fromJson(sceneJson, GameScene.class);
                
                // Extract visual fields from scene JSON
                if (sceneJson.has("backgroundImage")) {
                    scene.setBackgroundImage(sceneJson.get("backgroundImage").getAsString());
                }
                
                // Extract character images
                if (sceneJson.has("characterImages")) {
                    JsonObject charImages = sceneJson.getAsJsonObject("characterImages");
                    Map<String, String> charMap = new HashMap<>();
                    if (charImages.has("auditor")) {
                        charMap.put("auditor", charImages.get("auditor").getAsString());
                    }
                    if (charImages.has("subject")) {
                        charMap.put("subject", charImages.get("subject").getAsString());
                    }
                    scene.setCharacterImages(charMap);
                }
                
                // Extract intro images (scene level)
                if (sceneJson.has("introImages")) {
                    JsonArray introArray = sceneJson.getAsJsonArray("introImages");
                    List<String> sceneIntros = new java.util.ArrayList<>();
                    for (JsonElement img : introArray) {
                        sceneIntros.add(img.getAsString());
                    }
                    scene.setIntroImages(sceneIntros);
                }
                
                // Extract music (scene level)
                if (sceneJson.has("backgroundMusic")) {
                    scene.setBackgroundMusic(sceneJson.get("backgroundMusic").getAsString());
                }
                if (sceneJson.has("musicVolume")) {
                    scene.setMusicVolume(sceneJson.get("musicVolume").getAsDouble());
                }
                
                // Extract sound effects
                if (sceneJson.has("dialogueSound")) {
                    scene.setDialogueSound(sceneJson.get("dialogueSound").getAsString());
                }
                if (sceneJson.has("narrativeSounds")) {
                    JsonObject sounds = sceneJson.getAsJsonObject("narrativeSounds");
                    Map<String, Object> soundMap = gson.fromJson(sounds, Map.class);
                    scene.setNarrativeSounds(soundMap);
                }
                
scenesCache.put(scene.getSceneId(), scene);
System.out.println("  Scene loaded: " + scene.getSceneId() + " (" + 
                 (scene.getChoices() != null ? scene.getChoices().size() : 0) + 
                 " choices)");
// DEBUG: Print visual fields
System.out.println("    - backgroundImage: " + scene.getBackgroundImage());
System.out.println("    - characterImages: " + scene.getCharacterImages());
System.out.println("    - introImages: " + scene.getIntroImages());
System.out.println("    - backgroundMusic: " + scene.getBackgroundMusic());
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
     * Retrieve a scene by its ID
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