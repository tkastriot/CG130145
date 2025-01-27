// Create the scene
const sceneEl = document.createElement('a-scene');
document.getElementById('scene-container').appendChild(sceneEl);

// Create the classroom (cube)
const classroom = document.createElement('a-box');
classroom.setAttribute('position', '0 2.5 0');
classroom.setAttribute('width', '10');
classroom.setAttribute('height', '5');
classroom.setAttribute('depth', '10');
classroom.setAttribute('color', '#e0e0e0');  // Base color for the classroom
classroom.setAttribute('material', 'side: double;');
sceneEl.appendChild(classroom);

// Camera
const camera = document.createElement('a-camera');
camera.setAttribute('position', '0 1.6 5');  // Adjusted for better view
sceneEl.appendChild(camera);

// Lighting
const ambientLight = document.createElement('a-light');
ambientLight.setAttribute('type', 'ambient');
ambientLight.setAttribute('color', '#ffffff');
ambientLight.setAttribute('intensity', '0.5');
sceneEl.appendChild(ambientLight);

const pointLight = document.createElement('a-light');
pointLight.setAttribute('type', 'point');
pointLight.setAttribute('position', '0 4 0');
pointLight.setAttribute('intensity', '1.0');
pointLight.setAttribute('color', '#ffffff');
sceneEl.appendChild(pointLight);

// Add desks and chairs
const positions = [
    { desk: '-3 0 -3', chair1: '-3.5 0 -3.5', chair2: '-2.5 0 -3.5' },
    { desk: '3 0 -3', chair1: '2.5 0 -3.5', chair2: '3.5 0 -3.5' },
    { desk: '-3 0 1', chair1: '-3.5 0 0.5', chair2: '-2.5 0 0.5' },
    { desk: '3 0 1', chair1: '2.5 0 0.5', chair2: '3.5 0 0.5' }
];

positions.forEach(function(pos) {
    // Desk (using .obj and .mtl)
    const desk = document.createElement('a-entity');
    desk.setAttribute('obj-model', 'obj: ./models/Desk.obj; mtl: ./models/Desk.mtl'); // Specify both .obj and .mtl files
    desk.setAttribute('position', pos.desk);
    desk.setAttribute('scale', '0.03 0.015 0.02'); // Reduced the size of the desk to 10% of original size
    sceneEl.appendChild(desk);

    // Chair 1 (using only .obj)
    const chair1 = document.createElement('a-entity');
    chair1.setAttribute('obj-model', 'obj: ./models/Chair.obj');
    chair1.setAttribute('position', pos.chair1);
    chair1.setAttribute('scale', '0.012 0.014 0.012'); // Smaller chairs
    chair1.setAttribute('material', 'color:rgb(231, 13, 13)'); // Apply a plain color
    chair1.setAttribute('material', 'shader: standard; repeat: 5 1;');
    sceneEl.appendChild(chair1);

    // Chair 2 (using only .obj)
    const chair2 = document.createElement('a-entity');
    chair2.setAttribute('obj-model', 'obj: ./models/Chair.obj');
    chair2.setAttribute('position', pos.chair2);
    chair2.setAttribute('scale', '0.012 0.014 0.012'); // Smaller chairs
    chair2.setAttribute('material', 'shader: standard; repeat: 5 1;');
    sceneEl.appendChild(chair2);
});

// Window with texture and frame
// Create the outer frame
const windowFrame = document.createElement('a-box');
windowFrame.setAttribute('position', '0 2.5 -4.9'); // Position on the back wall
windowFrame.setAttribute('width', '6.2'); // Slightly larger than the window for the frame
windowFrame.setAttribute('height', '3.2'); // Slightly larger for frame effect
windowFrame.setAttribute('depth', '0.1'); // Thin frame
windowFrame.setAttribute('color', '#8B4513'); // Frame color (wood-like brown)
sceneEl.appendChild(windowFrame);

// Create the window (transparent glass effect)
const window = document.createElement('a-plane');
window.setAttribute('position', '0 2.5 -4.85'); // Slightly forward to avoid blending into the frame
window.setAttribute('width', '6');
window.setAttribute('height', '3');
window.setAttribute('material', 'src: #windowTexture; transparent: true; opacity: 0.7;'); // Adjusted opacity for glass effect
sceneEl.appendChild(window);

// Create the vertical middle frame divider
const verticalFrame = document.createElement('a-box');
verticalFrame.setAttribute('position', '0 2.5 -4.85'); // Positioned at the center of the window
verticalFrame.setAttribute('width', '0.1'); // Thin vertical divider
verticalFrame.setAttribute('height', '3.2'); // Same height as the window frame
verticalFrame.setAttribute('depth', '0.1'); // Same depth as the frame
verticalFrame.setAttribute('color', '#8B4513'); // Same color as the frame
sceneEl.appendChild(verticalFrame);

// Create the horizontal middle frame divider
const horizontalFrame = document.createElement('a-box');
horizontalFrame.setAttribute('position', '0 2.5 -4.85'); // Positioned at the center of the window horizontally
horizontalFrame.setAttribute('width', '6.2'); // Same width as the window frame
horizontalFrame.setAttribute('height', '0.1'); // Thin horizontal divider
horizontalFrame.setAttribute('depth', '0.1'); // Same depth as the frame
horizontalFrame.setAttribute('color', '#8B4513'); // Same color as the frame
sceneEl.appendChild(horizontalFrame);

// Assets for window texture
const assets = document.createElement('a-assets');
const windowTexture = document.createElement('img');
windowTexture.setAttribute('id', 'windowTexture');
windowTexture.setAttribute('src', 'https://images.unsplash.com/photo-1494526585095-c41746248156'); // Tree texture for the glass
assets.appendChild(windowTexture);
sceneEl.appendChild(assets);

// Walls: Apply light blue and strong blue colors with minimal lighting effect
// Left wall: Light blue
const leftWall = document.createElement('a-plane');
leftWall.setAttribute('position', '-5 2.5 0');
leftWall.setAttribute('rotation', '0 90 0'); // Vertical wall
leftWall.setAttribute('width', '10');
leftWall.setAttribute('height', '5');
leftWall.setAttribute('material', 'color: #ADD8E6; shader: flat;'); // Light blue with minimal lighting effect
sceneEl.appendChild(leftWall);

// Right wall: Strong blue
const rightWall = document.createElement('a-plane');
rightWall.setAttribute('position', '5 2.5 0');
rightWall.setAttribute('rotation', '0 90 0'); // Vertical wall
rightWall.setAttribute('width', '10');
rightWall.setAttribute('height', '5');
rightWall.setAttribute('material', 'color: #0000FF; shader: flat;'); // Strong blue with minimal lighting effect
sceneEl.appendChild(rightWall);

// Upper wall (ceiling): White
const upperWall = document.createElement('a-plane');
upperWall.setAttribute('position', '0 5 0');
upperWall.setAttribute('rotation', '-90 0 0'); // Ceiling
upperWall.setAttribute('width', '10');
upperWall.setAttribute('height', '10');
upperWall.setAttribute('material', 'color: #FFFFFF; shader: flat;'); // White ceiling
sceneEl.appendChild(upperWall);

// Floor: Solid grey with minimal lighting effect
const floor = document.createElement('a-plane');
floor.setAttribute('position', '0 0 0');
floor.setAttribute('rotation', '-90 0 0'); // Floor is horizontal
floor.setAttribute('width', '10');
floor.setAttribute('height', '10');
floor.setAttribute('material', 'color: #808080; roughness: 1; metalness: 0; emissive: #808080; emissiveIntensity: 0.5; shader: standard;'); // Better grey control
sceneEl.appendChild(floor);
