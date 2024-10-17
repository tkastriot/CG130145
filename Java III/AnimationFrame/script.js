import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.y = 1;
camera.position.z = 5;

var mixer = new THREE.AnimationMixer();

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/Capoeira.fbx',
    (object) => {
        object.scale.set(0.02, 0.02, 0.02);
        scene.add(object)
        mixer = new THREE.AnimationMixer(object);
        console.log(object.animations);
        const action = mixer.clipAction(object.animations[0]);
        action.play();
    }
)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    if (mixer) {
        mixer.update(deltaTime);
    }
    renderer.render(scene, camera);
}
animate();

