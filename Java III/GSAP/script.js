import * as THREE from 'three';
import gsap from 'gsap'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.x = -2;
// Set the camera position
camera.position.z = 5;

// Animate the cube with GSAP
gsap.to(cube.position, { duration: 2, x: 2, ease: "power1.inOut", repeat: -1, yoyo: true });
gsap.to(cube.rotation, { duration: 2, y: Math.PI * 2, ease: "power1.inOut", repeat: -1, yoyo: true });

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
