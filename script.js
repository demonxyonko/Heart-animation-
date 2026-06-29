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

// ------------------------------
// HEART PARTICLES
// ------------------------------

const positions = [];
const colors = [];

const particleCount = 7000;

const color = new THREE.Color();

for (let i = 0; i < particleCount; i++) {

    const t = Math.random() * Math.PI * 2;

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

    const depth = (Math.random() - 0.5) * 8;

    const scale = 0.22 + Math.random() * 0.05;

    positions.push(
        x * scale + (Math.random() - 0.5) * 0.25,
        y * scale + (Math.random() - 0.5) * 0.25,
        depth
    );

    color.setHSL(
        0.95 + Math.random() * 0.03,
        1,
        0.6 + Math.random() * 0.2
    );

    colors.push(color.r, color.g, color.b);
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
);

geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
);

const material = new THREE.PointsMaterial({

    size: 0.18,

    vertexColors: true,

    transparent: true,

    opacity: 0.95,

    blending: THREE.AdditiveBlending,

    depthWrite: false

});

const heart = new THREE.Points(
    geometry,
    material
);

heartGroup.add(heart);

// ------------------------------
// ANIMATION
// ------------------------------

const clock = new THREE.Clock();

const original = geometry.attributes.position.array.slice();

function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    const pos = geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {

        const ox = original[i];
        const oy = original[i + 1];
        const oz = original[i + 2];

        const wave =
            Math.sin(
                time * 3 +
                ox * 0.7 +
                oy * 0.7
            ) * 0.25;

        pos[i] = ox;
        pos[i + 1] = oy + wave;
        pos[i + 2] = oz + Math.cos(time * 2 + oy) * 0.15;

    }

    geometry.attributes.position.needsUpdate = true;

    // Heartbeat

    const beat =
        1 +
        Math.sin(time * 4) * 0.04;

    heartGroup.scale.set(
        beat,
        beat,
        beat
    );

    // Rotation

    heartGroup.rotation.y += 0.004;

    heartGroup.rotation.x =
        Math.sin(time * 0.5) * 0.15;

    controls.update();

    composer.render();

}

animate();
