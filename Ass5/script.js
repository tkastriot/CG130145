import * as THREE from 'three';
import GUI from 'lil-gui';

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

// Krijo një CylinderGeometry
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); // Rrezja e sipërme, rrezja e poshtme, lartësia, numri i segmenteve
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Ngjyrë e verdhë
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(-2, 0.5, 0); // Vendos cilindrin pak mbi dysheme
scene.add(cylinder);

// Krijo GUI
const gui = new GUI();

// Shto kontroll për kutinë
const boxFolder = gui.addFolder('Box Controls');

// Shto kontroll për pozitat
boxFolder.add(box.position, 'x', -5, 5, 0.1).name('Position X');
boxFolder.add(box.position, 'y', 0, 5, 0.1).name('Position Y');
boxFolder.add(box.position, 'z', -5, 5, 0.1).name('Position Z');

// Shto kontroll për ngjyrën
boxFolder.addColor({ color: '#ff0000' }, 'color').onChange((color) => {
    box.material.color.set(color);
});

// Shto kontroll për wireframe
boxFolder.add(box.material, 'wireframe');

// Shto kontroll për konin
const coneFolder = gui.addFolder('Cone Controls');

// Shto kontroll për pozitat
coneFolder.add(cone.position, 'x', -5, 5, 0.1).name('Position X');
coneFolder.add(cone.position, 'y', 0, 5, 0.1).name('Position Y');
coneFolder.add(cone.position, 'z', -5, 5, 0.1).name('Position Z');

// Shto kontroll për ngjyrën
coneFolder.addColor({ color: '#0000ff' }, 'color').onChange((color) => {
    cone.material.color.set(color);
});

// Shto kontroll për wireframe
coneFolder.add(cone.material, 'wireframe');

// Shto kontroll për cilindrin
const cylinderFolder = gui.addFolder('Cylinder Controls');

// Shto kontroll për pozitat
cylinderFolder.add(cylinder.position, 'x', -5, 5, 0.1).name('Position X');
cylinderFolder.add(cylinder.position, 'y', 0, 5, 0.1).name('Position Y');
cylinderFolder.add(cylinder.position, 'z', -5, 5, 0.1).name('Position Z');

// Shto kontroll për ngjyrën
cylinderFolder.addColor({ color: '#ffff00' }, 'color').onChange((color) => {
    cylinder.material.color.set(color);
});

// Shto kontroll për wireframe
cylinderFolder.add(cylinder.material, 'wireframe');

// Shto kontroll për dyshemenë
const floorFolder = gui.addFolder('Floor Controls');

// Shto kontroll për ngjyrën e dyshemesë
floorFolder.addColor({ color: '#00ff00' }, 'color').onChange((color) => {
    floor.material.color.set(color);
});

// Shto kontroll për wireframe e dyshemesë
floorFolder.add(floor.material, 'wireframe');

// Përcakto kamerën dhe renderuesin
const sizes = { width: 800, height: 600 };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(5, 5, 5); // Pozita e kamerës
camera.lookAt(0, 0, 0); // Kamera shikon drejt qendrës

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.getElementById("scene").appendChild(renderer.domElement);

// Animimi i skenës
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
