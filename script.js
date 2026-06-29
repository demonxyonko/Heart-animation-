import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const container = document.getElementById("container");
const loading = document.getElementById("loading");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0, 0, 45);

// Renderer
const renderer = new THREE.WebGLRenderer({
antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);

const point = new THREE.PointLight(0xff2f75, 15);
point.position.set(0, 20, 20);
scene.add(point);

// Bloom
const composer = new EffectComposer(renderer);

composer.addPass(new RenderPass(scene, camera));

composer.addPass(
new UnrealBloomPass(
new THREE.Vector2(window.innerWidth, window.innerHeight),
1.8,
0.5,
0.1
)
);

// Group that will contain the heart particles
const heartGroup = new THREE.Group();
scene.add(heartGroup);

// Hide loading screen
setTimeout(() => {

loading.style.opacity = "0";

setTimeout(() => {
loading.remove();
}, 800);

}, 1200);

// Resize
window.addEventListener("resize", () => {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth, window.innerHeight);
composer.setSize(window.innerWidth, window.innerHeight);

});
