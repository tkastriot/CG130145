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

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(ambientLight, directionalLight);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create Materials for Physics Interactions
const defaultMaterial = new CANNON.Material('default');
const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.2,
    restitution: 0.1, // Reduce bouncing
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
ballMesh.position.set(0, ballRadius, 7);
scene.add(ballMesh);

const ballBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(ballRadius),
    position: new CANNON.Vec3(0, ballRadius, 7),
    material: defaultMaterial,
});
world.addBody(ballBody);

// Load Bowling Pins
const pins = [];
const pinBodies = [];
const loader = new GLTFLoader();
const pinRows = [
    [0],
    [-0.3, 0.3],
    [-0.6, 0, 0.6],
    [-0.9, -0.4, 0.4, 0.9],
];
const pinZStart = -5;
const pinSpacing = 1;

loader.load('models/scene.gltf', (gltf) => {
    const pinModel = gltf.scene;
    pinModel.scale.set(6, 6, 6);

    pinRows.forEach((row, rowIndex) => {
        row.forEach((xOffset, colIndex) => {
            const pinClone = pinModel.clone();
            pinClone.position.set(xOffset, 0.3, pinZStart - rowIndex * pinSpacing);
            scene.add(pinClone);
            pins.push(pinClone);

            const pinBody = new CANNON.Body({
                mass: 0.5,
                shape: new CANNON.Cylinder(0.15, 0.15, 0.4, 16),
                position: new CANNON.Vec3(xOffset, 0.3, pinZStart - rowIndex * pinSpacing),
                material: defaultMaterial,
            });
            world.addBody(pinBody);
            pinBodies.push(pinBody);
        });
    });
});

// Score and Turn Management
let score = 0;
let chance = 1;
let totalPinsKnocked = 0;
let isResetting = false;
const totalChances = 2;
const maxPins = 10;

const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.fontSize = '24px';
scoreElement.style.color = 'white';
document.body.appendChild(scoreElement);

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    console.log("Updated Score:", score); // Debugging log for score updates
}
function resetPins() {
    isResetting = true;
    console.log("Resetting pins...");
    pinBodies.forEach((body, index) => {
        const rowIndex = Math.floor(index / pinRows.length);
        const colIndex = index % pinRows[0].length || 0;

        if (pinRows[rowIndex] && pinRows[rowIndex][colIndex] !== undefined) {
            body.position.set(
                pinRows[rowIndex][colIndex],
                0.3,
                pinZStart - rowIndex * pinSpacing
            );
            body.velocity.set(0, 0, 0);
            body.angularVelocity.set(0, 0, 0);
            pins[index].position.copy(body.position);
            body.quaternion.setFromEuler(0, 0, 0);
            pins[index].quaternion.copy(body.quaternion);
        }
    });
    totalPinsKnocked = 0; // Reset knock count
    console.log('Pins Reset');
    isResetting = false;
}

function resetBall() {
    console.log("Resetting ball...");
    ballBody.position.set(0, ballRadius, 7);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
    ballMesh.position.copy(ballBody.position);
}

function endTurn() {
    const knockedPins = countKnockedPins();
    score += knockedPins;
    console.log(`Knocked Pins: ${knockedPins}`);
    console.log("End of turn with score:", score);

    if (knockedPins === maxPins) {
        console.log("Strike!");
    }

    // Reset pins and ball for the next turn
    resetPins();
    resetBall();
    chance = 1; // Reset chance to 1 for the next turn
    updateScore(); // Update the displayed score
}

function countKnockedPins() {
    let knockedPins = 0;
    pinBodies.forEach((body) => {
        if (body.position.y < 0.1) {
            knockedPins++;
        }
    });
    return knockedPins;
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

function handleBallMovement() {
    const force = 5;
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
}

// Physics and Rendering Loop
function updatePhysics() {
    world.step(1 / 60);

    // Sync Ball
    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);

    console.log("UPDATE PHYSICS ");
    // Sync Pins
    if (!isResetting) {
        pins.forEach((pin, index) => {
            pin.position.copy(pinBodies[index].position);
            pin.quaternion.copy(pinBodies[index].quaternion);
        });
    }
}

function animate() {
    requestAnimationFrame(animate);
    handleBallMovement();
    updatePhysics();

    const knockedPins = countKnockedPins();
    if (knockedPins > totalPinsKnocked) {
        totalPinsKnocked = knockedPins;
        updateScore(); // Update the score only when pins are knocked down
    }

    if (ballBody.position.z < pinZStart - pinRows.length * pinSpacing) {
        endTurn(); // End turn after ball passes the pins
    }

    renderer.render(scene, camera);
}

animate();
