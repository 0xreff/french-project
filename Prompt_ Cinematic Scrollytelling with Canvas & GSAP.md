### **Prompt: Cinematic Scrollytelling with Canvas & GSAP**

Goal: Create a cinematic "Scrollytelling" effect following same thechnique as this project (nextjs u think) application. The core idea is to play an image sequence (video frames) based on the user's scroll position, creating a high-performance video-like illusion controlled entirely by the mouse wheel.  
Technical Stack:

* Framework: nextjs (TypeScript)  
* Styling: Tailwind CSS  
* Rendering: HTML5 \<canvas\>  
* Animation: GSAP (with ScrollToPlugin)

Detailed Requirements:

1. Frame Preloading & Loading State:  
   * frames are located in sequence-4 folder just for salle 04 in website.
   * Preload a sequence of 180 images (e.g., frame-001.jpg to frame-240.jpg) into a memory array before rendering starts.  
   * Implement a "Loading Screen" overlay that displays the real-time percentage of loaded frames.  
2.   
3. Canvas Rendering Logic:  
   * Use a fullscreen \<canvas\> element (fixed inset-0 w-full h-full).  
   * Create a drawFrame(index) function to render the specific frame to the canvas.  
   * Crucial: Implement a manual object-fit: cover logic using aspect ratio math so the images always fill the screen perfectly without distortion, regardless of window size.  
   * Include a ZOOM\_FACTOR variable (e.g., 1.35) in the draw calculation to slightly zoom into the frames, effectively hiding any baked-in black bars or letterboxing.  
4.   
5. Scroll-to-Frame Mapping:  
   * Set the container height to 500vh to create a long scrollable area.  
   * Listen for the scroll event and calculate a scrollFraction (0 to 1\) based on window.scrollY and the maximum scrollable height.  
   * Map this fraction to the frame index (0–179) and use requestAnimationFrame to trigger drawFrame for buttery-smooth performance.
   * use same informations gived in salle 04 for " gallerie d'innovation"
6.   
7. Interactive Mouse Parallax:  
   * Add a mousemove event listener.  
   * Use gsap.to() to smoothly shift the canvas position in the opposite direction of the mouse movement to create a sense of 3D depth.  
   * Apply a CSS scale: 1.05 to the canvas to ensure that its edges never become visible during the parallax offset.  
8.   
9. Performance & UX:  
   * Ensure the canvas handles window resizing dynamically.  
   * The background should remain solid black to maintain a cinematic atmosphere.  
   * Use GSAP's ScrollToPlugin for smooth programmatic navigation (e.g., "Scroll to Top" buttons).  
10. 

