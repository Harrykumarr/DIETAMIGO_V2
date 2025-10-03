'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

const AIFitnessTracker = () => {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const stageRef = useRef('up');
  const lastSpokenFeedbackRef = useRef('');

  // State
  const [repCounter, setRepCounter] = useState(0);
  const [feedbackText, setFeedbackText] = useState("Let's start!");
  const [currentExercise, setCurrentExercise] = useState('squats');
  const [exerciseTitle, setExerciseTitle] = useState('SQUATS (SIDE VIEW)');
  const [resizeScale, setResizeScale] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Helper Functions
  const calculateAngle = useCallback((a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) { angle = 360 - angle; }
    return angle;
  }, []);

  const speak = useCallback((text) => {
    if (text && text !== lastSpokenFeedbackRef.current && 'speechSynthesis' in window) {
      try {
        console.log(`[Audio] Speaking: "${text}" at volume ${speechVolume.toFixed(1)}`);
        
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = speechVolume;
        utterance.rate = 1.2;
        window.speechSynthesis.speak(utterance);
        lastSpokenFeedbackRef.current = text;
      } catch (speechError) {
        console.warn('Speech synthesis error:', speechError);
      }
    }
  }, [speechVolume]);

  // Exercise Logic
  const exerciseLogic = {
    'squats': {
      requiredLandmarks: [11, 23, 25, 27],
      initialStage: 'up',
      process: function(landmarks) {
        const shoulder = landmarks[11];
        const hip = landmarks[23];
        const knee = landmarks[25];
        const ankle = landmarks[27];
        const kneeAngle = calculateAngle(hip, knee, ankle);
        const backAngle = calculateAngle(shoulder, hip, knee);

        console.log(`[Squats] Stage: ${stageRef.current}, Knee Angle: ${kneeAngle.toFixed(1)}, Back Angle: ${backAngle.toFixed(1)}`);

        let feedbackMessages = [];

        if (kneeAngle < 100) { stageRef.current = 'down'; }
        if (kneeAngle > 160 && stageRef.current === 'down') {
          setRepCounter(prev => prev + 1);
          feedbackMessages.push('Good Rep!');
          stageRef.current = 'up';
        }
        if (stageRef.current === 'down') {
          if (hip.y < knee.y) { feedbackMessages.push('Go deeper!'); }
          if (backAngle < 80) { feedbackMessages.push('Keep your back straight!'); }
          if (knee.x > ankle.x + 0.05) { feedbackMessages.push('Keep knees behind toes!'); }
        }
        return feedbackMessages.join(' ');
      }
    },
    'front_squats': {
      requiredLandmarks: [23, 24, 25, 26],
      initialStage: 'up',
      process: function(landmarks) {
        const hipY = (landmarks[23].y + landmarks[24].y) / 2;
        const kneeY = (landmarks[25].y + landmarks[26].y) / 2;
        
        console.log(`[Front Squats] Stage: ${stageRef.current}, HipY: ${hipY.toFixed(2)}, KneeY: ${kneeY.toFixed(2)}`);

        let feedbackMessages = [];

        if (hipY > kneeY) { stageRef.current = 'down'; }
        if (hipY < kneeY && stageRef.current === 'down') {
          setRepCounter(prev => prev + 1);
          feedbackMessages.push('Good Rep!');
          stageRef.current = 'up';
        }
        return feedbackMessages.join(' ');
      }
    },
    'pushups': {
      requiredLandmarks: [11, 13, 15, 23, 25],
      initialStage: 'up',
      process: function(landmarks) {
        const shoulder = landmarks[11];
        const elbow = landmarks[13];
        const wrist = landmarks[15];
        const hip = landmarks[23];
        const knee = landmarks[25];
        const elbowAngle = calculateAngle(shoulder, elbow, wrist);
        const backAngle = calculateAngle(shoulder, hip, knee);
        const shoulderAngle = calculateAngle(hip, shoulder, elbow);

        console.log(`[Pushups] Stage: ${stageRef.current}, Elbow Angle: ${elbowAngle.toFixed(1)}, Back Angle: ${backAngle.toFixed(1)}`);

        let feedbackMessages = [];

        if (elbowAngle < 90) { stageRef.current = 'down'; }
        if (elbowAngle > 160 && stageRef.current === 'down') {
          setRepCounter(prev => prev + 1);
          feedbackMessages.push('Good Rep!');
          stageRef.current = 'up';
        }
        if (backAngle < 160) { feedbackMessages.push('Keep your back straight!'); }
        if (stageRef.current === 'down') {
          if (shoulder.y > wrist.y - 0.05) { feedbackMessages.push('Lower your chest more!'); }
          if (shoulderAngle > 80) { feedbackMessages.push('Tuck your elbows in!'); }
        }
        return feedbackMessages.join(' ');
      }
    },
    'bicep_curls': {
      requiredLandmarks: [11, 13, 15],
      initialStage: 'down',
      process: function(landmarks) {
        const shoulder = landmarks[11];
        const elbow = landmarks[13];
        const wrist = landmarks[15];
        const elbowAngle = calculateAngle(shoulder, elbow, wrist);

        console.log(`[Bicep Curls] Stage: ${stageRef.current}, Elbow Angle: ${elbowAngle.toFixed(1)}`);

        let feedbackMessages = [];

        if (elbowAngle > 160) { stageRef.current = 'down'; }
        if (elbowAngle < 45 && stageRef.current === 'down') {
          setRepCounter(prev => prev + 1);
          feedbackMessages.push('Good Rep!');
          stageRef.current = 'up';
        }
        if (Math.abs(shoulder.y - elbow.y) > 0.05) {
          feedbackMessages.push('Keep your elbow still!');
        }
        return feedbackMessages.join(' ');
      }
    },
    'jumping_jacks': {
      requiredLandmarks: [11, 12, 15, 16, 27, 28],
      initialStage: 'in',
      process: function(landmarks) {
        const shoulderWidth = Math.abs(landmarks[11].x - landmarks[12].x);
        const ankleDistance = Math.abs(landmarks[27].x - landmarks[28].x);
        const armsUp = landmarks[15].y < landmarks[11].y && landmarks[16].y < landmarks[12].y;
        const legsOut = ankleDistance > shoulderWidth * 1.5;

        console.log(`[Jumping Jacks] Stage: ${stageRef.current}, Arms Up: ${armsUp}, Legs Out: ${legsOut}`);

        let feedbackMessages = [];

        if (armsUp && legsOut) { stageRef.current = 'out'; }
        if (landmarks[15].y > landmarks[11].y && ankleDistance < shoulderWidth && stageRef.current === 'out') {
          setRepCounter(prev => prev + 1);
          feedbackMessages.push('Good Rep!');
          stageRef.current = 'in';
        }
        return feedbackMessages.join(' ');
      }
    }
  };

  // Reset function
  const resetForNewExercise = useCallback((exerciseName) => {
    setRepCounter(0);
    stageRef.current = exerciseLogic[exerciseName].initialStage;
    setFeedbackText("Let's start!");
    lastSpokenFeedbackRef.current = '';
    let title = exerciseName.replace('_', ' ');
    if (exerciseName === 'squats') title += ' (Side View)';
    setExerciseTitle(title.toUpperCase());
  }, []);

  // Main pose results handler
  const onResults = useCallback((results) => {
    if (!canvasRef.current) return;
    
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    if (results.poseLandmarks) {
      // Draw pose connections and landmarks
      try {
        if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
          window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
          window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
        } else {
          // Fallback: draw simple points if MediaPipe drawing utils not available
          results.poseLandmarks.forEach((landmark) => {
            const x = landmark.x * canvasRef.current.width;
            const y = landmark.y * canvasRef.current.height;
            
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 3, 0, 2 * Math.PI);
            canvasCtx.fillStyle = '#00FF00';
            canvasCtx.fill();
          });
        }
      } catch (drawError) {
        console.warn('Drawing error:', drawError);
      }
      
      try {
        const landmarks = results.poseLandmarks;
        const visibilityThreshold = 0.7;
        const allLandmarksVisible = exerciseLogic[currentExercise].requiredLandmarks.every(
          index => landmarks[index] && landmarks[index].visibility > visibilityThreshold
        );
        
        if (allLandmarksVisible) {
          const feedback = exerciseLogic[currentExercise].process(landmarks);
          if (feedback) {
            setFeedbackText(feedback);
            speak(feedback);
          }
        }
      } catch (error) {
        console.error("Error processing exercise logic:", error);
      }
    }
  }, [currentExercise, speak]);

  // Initialize MediaPipe
  useEffect(() => {
    const initializeCamera = async () => {
      if (typeof window === 'undefined') return;
      
      // Wait for MediaPipe libraries to load
      if (!window.Pose || !window.Camera || !window.drawConnectors || !window.drawLandmarks || !window.POSE_CONNECTIONS) {
        console.log('Waiting for MediaPipe libraries to load...');
        setTimeout(initializeCamera, 1000);
        return;
      }
      
      console.log('MediaPipe libraries loaded successfully');

      try {
        console.log('Initializing MediaPipe Pose...');
        // Initialize pose
        const pose = new window.Pose({ 
          locateFile: (file) => {
            console.log('Loading MediaPipe file:', file);
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`;
          }
        });
        
        pose.setOptions({ 
          modelComplexity: 1, 
          smoothLandmarks: true, 
          minDetectionConfidence: 0.5, 
          minTrackingConfidence: 0.5 
        });
        
        pose.onResults(onResults);
        poseRef.current = pose;

        // Initialize camera
        if (videoRef.current) {
          console.log('Initializing camera...');
          const camera = new window.Camera(videoRef.current, { 
            onFrame: async () => { 
              if (poseRef.current && videoRef.current) {
                try {
                  await poseRef.current.send({ image: videoRef.current }); 
                } catch (frameError) {
                  console.warn('Frame processing error:', frameError);
                }
              }
            }, 
            width: 640, 
            height: 480 
          });
          
          cameraRef.current = camera;
          await camera.start();
          console.log('Camera started successfully');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing MediaPipe:', error);
        setError('Failed to initialize camera. Please check if your browser supports MediaPipe and camera access.');
        setFeedbackText('Error initializing camera. Please refresh the page.');
      }
    };

    initializeCamera();
  }, [onResults]);

  // Handle exercise change
  const handleExerciseChange = (e) => {
    const newExercise = e.target.value;
    setCurrentExercise(newExercise);
    resetForNewExercise(newExercise);
  };

  // Handle resize change
  const handleResizeChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setResizeScale(newScale);
    const transformValue = `scaleX(-1) scale(${newScale})`;
    if (videoRef.current) {
      videoRef.current.style.transform = transformValue;
    }
    if (canvasRef.current) {
      canvasRef.current.style.transform = transformValue;
    }
  };

  // Initialize on mount
  useEffect(() => {
    resetForNewExercise(currentExercise);
  }, [currentExercise, resetForNewExercise]);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: '20px 0',
      backgroundColor: '#f4f4f9',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ color: '#333', marginTop: 0 }}>Dietamigo AI Fitness Tracker</h1>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ef5350',
          maxWidth: '640px',
          textAlign: 'center'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '640px',
        marginTop: '15px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
          <label htmlFor="exerciseSelect">Choose Exercise:</label>
          <select 
            id="exerciseSelect" 
            value={currentExercise}
            onChange={handleExerciseChange}
            style={{ 
              cursor: 'pointer', 
              padding: '5px', 
              borderRadius: '5px', 
              border: '1px solid #ccc', 
              backgroundColor: '#fff' 
            }}
          >
            <option value="squats">Squats (Side View)</option>
            <option value="front_squats">Front Squats</option>
            <option value="pushups">Push-ups</option>
            <option value="bicep_curls">Bicep Curls</option>
            <option value="jumping_jacks">Jumping Jacks</option>
          </select>
        </div>
      </div>

      <div style={{
        position: 'relative',
        width: '640px',
        height: '480px',
        margin: 'auto',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backgroundColor: '#000',
        marginTop: '20px'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            transform: `scaleX(-1) scale(${resizeScale})`,
            transition: 'transform 0.2s ease-in-out'
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `scaleX(-1) scale(${resizeScale})`
          }}
        />
      </div>
      
      <p style={{ 
        fontSize: '1.5em', 
        fontWeight: 'bold', 
        marginTop: '20px', 
        color: '#333' 
      }}>
        {exerciseTitle}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '640px',
        marginTop: '20px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.2em', color: '#555', textTransform: 'uppercase' }}>Reps</p>
          <span style={{ fontSize: '3em', fontWeight: 'bold', color: '#007bff' }}>{repCounter}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.2em', color: '#555', textTransform: 'uppercase' }}>Feedback</p>
          <span style={{ fontSize: '1.5em', color: '#d9534f', fontWeight: 'bold', minHeight: '1.5em' }}>
            {feedbackText}
          </span>
          {!isInitialized && !error && (
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
              Loading camera and AI detection...
            </div>
          )}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '640px',
        marginTop: '15px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
          <label htmlFor="resizeSlider">🔎 Zoom</label>
          <input 
            type="range" 
            id="resizeSlider" 
            min="0.5" 
            max="1.5" 
            step="0.1" 
            value={resizeScale}
            onChange={handleResizeChange}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
          <label htmlFor="volumeSlider">🔊 Volume</label>
          <input 
            type="range" 
            id="volumeSlider" 
            min="0" 
            max="1" 
            step="0.1" 
            value={speechVolume}
            onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIFitnessTracker;