import * as THREE from 'three';

const scene = new THREE.Scene();
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff0000 ,
    wireframe:true

});

const box = new THREE.Mesh(boxGeometry, boxMaterial);
const sphereGeometry = new THREE.SphereGeometry(0.5,32,32);
const sphereMaterial = new THREE.MeshBasicMaterial({
     color: 0x00ff00,
});
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);

const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
const sphere1Geometry = new THREE.SphereGeometry(0.5,32,32);
const sphere1Material = new THREE.MeshBasicMaterial({
     color: 0x00ff00,
});
const sphere1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere1);

const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
const sphere2Geometry = new THREE.SphereGeometry(0.5,32,32);
const sphere2Material = new THREE.MeshBasicMaterial({
     color: 0x00ff00,
});
const sphere2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere2);




scene.add(box)
const sizes = {
    width: 800,
    height: 600
}
//mesh.scale.x=0,5;
//mesh.scale.y=4;
box.rotation.x=Math.PI/4;

//mesh.position.x=-1
//mesh.position.y=1
//mesh.position.z=1

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

scene.add(camera);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600)
document.getElementById("scene").appendChild(renderer.domElement);


renderer.render(scene, camera)