import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function updateCameraPosition() {
    camera.position.x = ballMesh.position.x;
    camera.position.y = ballMesh.position.y + 5;  // Slight elevation for better view
    camera.position.z = ballMesh.position.z + 10; // Follow behind the ball
    camera.lookAt(ballMesh.position); // Keep the camera looking at the ball
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(ambientLight, directionalLight);
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Increase Solver Precision
world.solver.iterations = 30;
world.solver.tolerance = 0.0001;

// Create Materials for Physics Interactions
const defaultMaterial = new CANNON.Material('default');
const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.3,
    restitution: 0.4,
});
world.addContactMaterial(contactMaterial);

// Bowling Lane (Plane)
const laneWidth = 4;
const laneLength = 20;
const floorGeometry = new THREE.PlaneGeometry(laneWidth, laneLength);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x804000 });
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

const floorBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: defaultMaterial,
});
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(floorBody);

// Bowling Ball
const ballRadius = 0.5;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
ballMesh.position.set(0, ballRadius, 10);
scene.add(ballMesh);

const ballBody = new CANNON.Body({
    mass: 8,
    shape: new CANNON.Sphere(ballRadius),
    position: new CANNON.Vec3(0, ballRadius, 7),
    material: defaultMaterial,
});
world.addBody(ballBody);

// Load Bowling Pins from Models Folder
const pins = [];
const pinBodies = [];
const loader = new GLTFLoader();
const pinRows = [
    [0],
    [-0.3, 0.3],
    [-0.6, 0, 0.6],
    [-0.9, -0.4, 0.4, 0.9],
];
const pinSpacing = 0.95;  // Moderate spacing between rows

const pinZStart = -5;





loader.load('models/bowling.gltf', (gltf) => {
    const bowlingAlley = gltf.scene;
    bowlingAlley.scale.set(10, 10, 10);
    bowlingAlley.position.set(0, 0, 0);
    bowlingAlley.rotation.set(0, Math.PI / 2, 0);
    scene.add(bowlingAlley);
}, undefined, (error) => {
    console.error("Error loading model:", error);
});
// Pin Material
const pinMaterial = new CANNON.Material('pinMaterial');
const pinContactMaterial = new CANNON.ContactMaterial(pinMaterial, defaultMaterial, {
    friction: 0.2,
    restitution: 0.3,
});
world.addContactMaterial(pinContactMaterial);

loader.load('models/scene.gltf', (gltf) => {
    const pinModel = gltf.scene;
    pinModel.scale.set(10, 6, 10);

    pinRows.forEach((row, rowIndex) => {
        row.forEach((xOffset) => {
            const pinClone = pinModel.clone();
            pinClone.position.set(xOffset, 0.3, pinZStart - rowIndex * pinSpacing);
            scene.add(pinClone);
            pins.push(pinClone);

            // Create a compound body for each pin
            const pinBody = new CANNON.Body({
                mass: 0.6,
                position: new CANNON.Vec3(xOffset, 0.6, pinZStart - rowIndex * pinSpacing),
                material: pinMaterial,
            });

            // Bottom cylinder (thicker part)
            const bottomShape = new CANNON.Cylinder(0.25, 0.25, 0.5, 16);
            pinBody.addShape(bottomShape, new CANNON.Vec3(0, -0.2, 0));

            // Middle part (narrower)
            const middleShape = new CANNON.Cylinder(0.175, 0.175, 0.5, 16);
            pinBody.addShape(middleShape, new CANNON.Vec3(0, 0.1, 0));

            // Top part (small part near the pin's top)
            const topShape = new CANNON.Cylinder(0.075, 0.075, 0.3, 16);
            pinBody.addShape(topShape, new CANNON.Vec3(0, 0.3, 0));

            // Add the compound body to the world
            world.addBody(pinBody);
            pinBodies.push(pinBody);
        });
    });
});

// Score Tracking
let score = 0;
const knockedDownPins = new Set();

const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score';
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.left = '10px';
scoreDisplay.style.fontSize = '24px';
scoreDisplay.style.color = 'white';
scoreDisplay.textContent = `Score: ${score}`;
document.body.appendChild(scoreDisplay);

function isPinKnockedDown(pinBody) {
    const threshold = 0.5;
    const rotationX = Math.abs(pinBody.quaternion.x);
    const rotationZ = Math.abs(pinBody.quaternion.z);
    return rotationX > threshold || rotationZ > threshold;
}

function updateScore() {
    pinBodies.forEach((pinBody, index) => {
        if (isPinKnockedDown(pinBody) && !knockedDownPinsThisRound.has(index)) {
            knockedDownPinsThisRound.add(index);  // Add to knocked-down set
        }
    });

    // If a strike is detected, automatically move to the next round after the first hit
    if (hitsInCurrentRound === 1 && checkStrike()) {
        resetBall();  // Move to the next round without a second hit
    }

    // Update the score after each hit
    scoreDisplay.textContent = `Score: ${score}`;
}

// Resize Event
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Keyboard Controls
const keysPressed = {};

window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

let ballSpeed = 50; // Speed of the ball
let ballSpin = 15;   // Spin of the ball (controls angular velocity)

function handleBallMovement() {
    const force = ballSpeed;
    const spinForce = ballSpin;

    if (keysPressed['ArrowUp']) {
        ballBody.applyForce(new CANNON.Vec3(0, 0, -force), ballBody.position);
    }
    if (keysPressed['ArrowDown']) {
        ballBody.applyForce(new CANNON.Vec3(0, 0, force), ballBody.position);
    }
    if (keysPressed['ArrowLeft']) {
        ballBody.applyForce(new CANNON.Vec3(-force, 0, 0), ballBody.position);
    }
    if (keysPressed['ArrowRight']) {
        ballBody.applyForce(new CANNON.Vec3(force, 0, 0), ballBody.position);
    }
    
    if (keysPressed['a']) { // Spin left
        ballBody.angularVelocity.set(0, -spinForce, 0.5);  // Apply spin force around Y-axis
    }
    if (keysPressed['d']) { // Spin right
        ballBody.angularVelocity.set(0, spinForce, 0.5);   // Apply spin force around Y-axis
    }
}


// Physics and Rendering Loop
function updatePhysics() {
    world.step(1 / 60);

    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);

    pins.forEach((pin, index) => {
        pin.position.copy(pinBodies[index].position);
        pin.quaternion.copy(pinBodies[index].quaternion);
    });
    
}

// Declare round management variables at the top
let currentRound = 1;  // Track the current round (starts at 1)
let hitsInCurrentRound = 0;  // Number of hits in the current round (max 2)
let roundScore = 0;  // The score for the current round (number of pins knocked down)
let knockedDownPinsThisRound = new Set();  // Keep track of pins knocked down in the current round

let currentPlayer = 1;  // Start with Player 1
let playerScores = [0, 0];  // [Player 1 score, Player 2 score]



// Check if all pins have been knocked down
function checkStrike() {
    let knockedPins = 0;
    pinBodies.forEach((pinBody, index) => {
        if (isPinKnockedDown(pinBody)) {
            knockedPins += 1;
        }
    });
    return knockedPins === 10;
}

function updateScoreboard() {
    document.getElementById('scorePlayer1').textContent = playerScores[0];
    document.getElementById('scorePlayer2').textContent = playerScores[1];
}

function updateRoundScore() {
    if (checkStrike()) {
        // If it's a strike, give the player 10 points and go to the next round
        playerScores[currentPlayer - 1] += 10;  // 10 points for a strike
    } else {
        // Add the number of knocked-down pins to the player's score
        playerScores[currentPlayer - 1] += getRoundScore();
    }
    updateScoreboard();
}


function getRoundScore() {
    // Here you could check the number of knocked pins and return the score
    // For simplicity, return the number of knocked down pins
    let knockedPins = 0;
    pinBodies.forEach((pinBody, index) => {
        if (isPinKnockedDown(pinBody)) {
            knockedPins += 1;
        }
    });
    return knockedPins;
}

// Pin Reset Function (for round tracking)
function resetPins() {
    // Remove current pin meshes and physics bodies from the world
    pins.forEach((pin) => {
        scene.remove(pin);  // Remove from scene
    });

    pinBodies.forEach((pinBody) => {
        world.removeBody(pinBody);  // Remove from physics world
    });

    // Clear the pins and pinBodies arrays for the next round
    pins.length = 0;
    pinBodies.length = 0;

    // Recreate pins at initial positions
    loader.load('models/scene.gltf', (gltf) => {
        const pinModel = gltf.scene;
        pinModel.scale.set(10, 6, 10);  // Adjust scale of pin model

        pinRows.forEach((row, rowIndex) => {
            row.forEach((xOffset) => {
                const pinClone = pinModel.clone();
                pinClone.position.set(xOffset, 0.3, pinZStart - rowIndex * pinSpacing);
                scene.add(pinClone);
                pins.push(pinClone);

                // Create a compound body for each pin
                const pinBody = new CANNON.Body({
                    mass: 0.6,
                    position: new CANNON.Vec3(xOffset, 0.6, pinZStart - rowIndex * pinSpacing),
                    material: pinMaterial,
                });

                // Bottom cylinder (thicker part)
                const bottomShape = new CANNON.Cylinder(0.25, 0.25, 0.5, 16);
                pinBody.addShape(bottomShape, new CANNON.Vec3(0, -0.2, 0));

                // Middle part (narrower)
                const middleShape = new CANNON.Cylinder(0.175, 0.175, 0.5, 16);
                pinBody.addShape(middleShape, new CANNON.Vec3(0, 0.1, 0));

                // Top part (small part near the pin's top)
                const topShape = new CANNON.Cylinder(0.075, 0.075, 0.3, 16);
                pinBody.addShape(topShape, new CANNON.Vec3(0, 0.3, 0));

                // Add the compound body to the world
                world.addBody(pinBody);
                pinBodies.push(pinBody);
            });
        });
    });
}



function resetBall() {
    // Reset the ball's position and physics properties
    ballBody.position.set(0, ballRadius, 7);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
    ballMesh.position.set(0, ballRadius, 7);
    ballMesh.quaternion.set(0, 0, 0, 1);
    
    hitsInCurrentRound++;

    // If the ball gets reset and it's a strike, go to the next round immediately
    if (hitsInCurrentRound === 1 && checkStrike()) {
        updateRoundScore();
        switchPlayer();
        resetPins();
    }

    // If it's the second hit or a strike after first hit, switch player and go to next round
    if (hitsInCurrentRound >= 2 || (hitsInCurrentRound === 1 && checkStrike())) {
        updateRoundScore();
        if (currentPlayer === 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
            currentRound++; // Move to the next round after both players have completed their turn
        }
        hitsInCurrentRound = 0; // Reset hits count for next player
        resetPins();
    }

    // Update the current player's turn
    document.getElementById('currentPlayer').textContent = `Player ${currentPlayer}'s Turn`;
}

function switchPlayer() {
    // Switch to the other player
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    hitsInCurrentRound = 0;  // Reset the round hits count
    updateScoreboard();
}

// Ball Exiting the Lane Logic (same as before, but with round management)
function checkBallExit() {
    const laneEndZ = -laneLength;  // Set the threshold for the ball exiting the lane

    // If the ball’s Z position goes beyond the end of the lane (negative direction)
    if (ballBody.position.z < laneEndZ) {
        resetBall();  // Reset the ball if it has exited the lane
    }
}

// Display the current round
const roundDisplay = document.createElement('div');
roundDisplay.id = 'round';
roundDisplay.style.position = 'absolute';
roundDisplay.style.top = '50px';
roundDisplay.style.left = '10px';
roundDisplay.style.fontSize = '24px';
roundDisplay.style.color = 'white';
roundDisplay.textContent = `Round: ${currentRound}`;
document.body.appendChild(roundDisplay);

// Update the round display after each round
function updateRoundDisplay() {
    roundDisplay.textContent = `Round: ${currentRound}`;
}

// Update the animate function
function animate() {
    requestAnimationFrame(animate);
    handleBallMovement();
    updatePhysics();
    updateCameraPosition();
    updateScore();
    checkBallExit();  // Check if the ball has exited the lane
    updateRoundDisplay();  // Update the round display
    renderer.render(scene, camera);
}

animate();
