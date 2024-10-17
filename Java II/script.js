import * as THREE from 'three';

const scene = new THREE.Scene();
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true 
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

for (var i=0; i<1000; i++)
{
    const sphereGeometry = new THREE.SphereGeometry(0.02, 32,32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color:0x00ff00
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(randomInt(-20,20), randomInt(-20,20), randomInt(-10,3));

    scene.add(sphere);
}
//scene.add(box)
const sizes = {
    width: 800,
    height: 600
}

box.rotation.x = Math.PI / 4;
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

scene.add(camera);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600)
document.getElementById("scene").appendChild(renderer.domElement);


renderer.render(scene, camera)

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  