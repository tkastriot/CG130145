import * as THREE from 'three';

// Krijo skenën
const scene = new THREE.Scene();

// Parametrat për PlaneGeometry
const width = 10;          // Gjerësia e plane (dyshemesë)
const height = 10;         // Lartësia e plane (dyshemesë)
const widthSegments = 10;  // Numri i segmenteve përgjatë boshtit X
const heightSegments = 10; // Numri i segmenteve përgjatë boshtit Y

// Krijo PlaneGeometry
const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);

// Material për dysheme
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });

// Krijo mesh-in dhe vendos si dysheme
const floor = new THREE.Mesh(geometry, material);

// Rrotullo plane që të jetë horizontal si dysheme
floor.rotation.x = -Math.PI / 2; // Rrotullim 90 gradë rreth boshtit X

// Vendos dyshemenë në pozicionin e duhur
floor.position.y = 0;

// Shto dyshemenë në skenë
scene.add(floor);

// Krijo një BoxGeometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // Gjerësia, lartësia, thellësia
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Ngjyrë e kuqe
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, 0); // Vendos kutinë pak mbi dysheme
scene.add(box);

// Krijo një ConeGeometry
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32); // Rrezja, lartësia, numri i segmenteve
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Ngjyrë e blu
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(2, 0.5, 0); // Vendos konin pak mbi dysheme
scene.add(cone);

// Përcakto kamerën dhe renderuesin
const sizes = { width: 800, height: 600 };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(5, 5, 5); // Pozita e kamerës
camera.lookAt(0, 0, 0); // Kamera shikon drejt qendrës

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.getElementById("scene").appendChild(renderer.domElement);

renderer.render(scene,camera)