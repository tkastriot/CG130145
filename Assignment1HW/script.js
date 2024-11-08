import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Ground Plane (Grass)
const grassMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
const grassPlane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), grassMaterial);
grassPlane.rotation.x = -Math.PI / 2;
scene.add(grassPlane);

// Roads based on the specific layout in the satellite image
const roadMaterial = new THREE.MeshBasicMaterial({ color: 'gray' });

// Left road leading to left building
const road1 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 80), roadMaterial);
road1.position.set(-30, 0.1, 20);
road1.rotation.y = -Math.PI / 1; // Adjust rotation based on layout
scene.add(road1);

// Right road leading to the right building
const road2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 90), roadMaterial);
road2.position.set(7, 0.1, 2);
road2.rotation.y = Math.PI / 3; // Adjust rotation to connect center
scene.add(road2);

// Road between two roads 
const road3 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 40), roadMaterial);
road3.position.set(20, 0.1, 30);
road3.rotation.y = Math.PI / 1; // Adjust rotation for right side
scene.add(road3);

// Diagonal road leading to the down the "island" building
const road4 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 70), roadMaterial);
road4.position.set(15, 0.1, 55);
road4.rotation.y = -Math.PI / 2.8; // Adjust rotation for right side
scene.add(road4);

// Buildings positioned based on satellite layout
const building1Material = new THREE.MeshBasicMaterial({ color: 'blue' });
const building2Material = new THREE.MeshBasicMaterial({ color: 'lightblue' });
const building3Material = new THREE.MeshBasicMaterial({ color: 'skyblue' });

// Left building
const building1 = new THREE.Mesh(new THREE.BoxGeometry(15, 10, 100), building1Material);
building1.position.set(-50, 5, 18); // Positioned to the left
building1.rotation.y = Math.PI / 1; // Adjusted rotation to match layout
scene.add(building1);

// Center "island" building
const building2 = new THREE.Mesh(new THREE.BoxGeometry(25, 10, 35), building2Material);
building2.position.set(-2, 5, 25); // Center position for "island"
scene.add(building2);

// Right building
const building3 = new THREE.Mesh(new THREE.BoxGeometry(15, 10, 80), building3Material);
building3.position.set(0, 5, -25); // Positioned on the right side
building3.rotation.y = Math.PI / 3; // Adjusted rotation to match layout
scene.add(building3);

// Animated Object (Moving along campus roads in a triangular path)
const movingObjectMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const movingObject = new THREE.Mesh(new THREE.SphereGeometry(1), movingObjectMaterial);
scene.add(movingObject);

const waypoints = [
    { x: -30, y: 12, z: -40 },   // Start near bottom left building
    { x: -30, y: 12, z: 20 },    // Move straight along the road
    { x: 0, y: 12, z: 20 },      // Pivot to the central area
    { x: 15, y: 12, z: 20 },     // Continue toward the right building
    { x: 15, y: 12, z: 60 },     // Turn right to follow the road to the right building
    { x: 35, y: 12, z: 60 },     // Final road segment on the right side
];


// Initialize sphere position to the first waypoint
movingObject.position.set(waypoints[-0].x, waypoints[0].y, waypoints[0].z);

let currentWaypoint = 0;
const speed = 0.5; // Speed of movement

// Helper function to move the sphere to the next waypoint
function moveToWaypoint() {
    if (currentWaypoint >= waypoints.length) return; // Stop if we've reached the end

    const target = waypoints[currentWaypoint];
    const dx = target.x - movingObject.position.x;
    const dz = target.z - movingObject.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Check if we reached the current waypoint
    if (distance < 0.1) {
        currentWaypoint++; // Move to the next waypoint

        // Stop at the last waypoint
        if (currentWaypoint >= waypoints.length) {
            currentWaypoint = waypoints.length - 1; // Stay at the last waypoint
            return;
        }
    } else {
        // Move sphere toward the target
        movingObject.position.x += (dx / distance) * speed;
        movingObject.position.z += (dz / distance) * speed;
    }
}

// Set up the camera position
camera.position.set(100, 100, 100);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move the sphere along the path
    moveToWaypoint();

    controls.update();
    renderer.render(scene, camera);
}

animate();