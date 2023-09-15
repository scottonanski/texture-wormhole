import * as THREE from 'three';

// Global Variables
let camera, scene, renderer;
let cylinder;
let texture;

const normal_speed = 0.0007;

// Get the containing element dimensions
function getWormholeDimensions() {
    const wormholeSection = document.querySelector('.wormhole');
    return {
        width: wormholeSection.clientWidth,
        height: wormholeSection.clientHeight
    };
}

// Initialization function
function init() {
    setupRenderer();
    setupScene();
    setupCamera();
    setupLights();
    setupTextureAndMesh();
    window.addEventListener('resize', onWindowResize, false);
}

// Resize the canvas on window resize
function onWindowResize() {
    const { width, height } = getWormholeDimensions();

    // Update camera's aspect ratio
    camera.aspect = width / height;
    // Update the camera's frustum
    camera.updateProjectionMatrix();
    // Update the size of the renderer AND the canvas
    renderer.setSize(width, height);
}

// Set up the renderer
function setupRenderer() {
    const { width, height } = getWormholeDimensions();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    const wormholeSection = document.querySelector('.wormhole');
    wormholeSection.appendChild(renderer.domElement);
}

// Set up the scene.
function setupScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010101, 0.15);
}

// Set up the camera
function setupCamera() {
    const { width, height } = getWormholeDimensions();
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 0, 7);
    camera.lookAt(scene.position);
    scene.add(camera);
}

//Set up the lights
function setupLights() {
    const directionalLight1 = createDirectionalLight('rgb(226, 136, 0)', 0.5, 1, 1, 0);
    scene.add(directionalLight1);

    const directionalLight2 = createDirectionalLight('rgb(226, 136, 0)', 0.5, -1, 1, 0);
    scene.add(directionalLight2);

    const pointLight1 = createPointLight('rgb(226, 136, 0)', 10, 0, -3, 0, 25);
    scene.add(pointLight1);

    const pointLight2 = createPointLight('rgb(226, 136, 0)', 15, 3, 3, 0, 30);
    scene.add(pointLight2);
}

// This creates a directional light
function createDirectionalLight(color, intensity, x, y, z) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z).normalize();
    return light;
}

// This creates a point light
function createPointLight(color, intensity, x, y, z, distance) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    return light;
}

// Set up the texture and mesh
function setupTextureAndMesh() {
  const loader = new THREE.TextureLoader();
  
  loader.load(
      "./img/texture.png",
      (loadedTexture) => {
          texture = loadedTexture;
          texture.wrapT = THREE.RepeatWrapping;
          texture.wrapS = THREE.RepeatWrapping;

          const material = new THREE.MeshLambertMaterial({
              color: 0xff9900,
              opacity: 1,
              map: texture
          });

          const cylinder_geometry = new THREE.CylinderGeometry(1, 1, 20, 30, 1, true);
          cylinder = new THREE.Mesh(cylinder_geometry, material);
          
          material.side = THREE.BackSide;
          cylinder.rotation.x = Math.PI / 2;
          scene.add(cylinder);

          // start the animation only after texture is loaded
          animate();
      }
  );
}

// Animation loop function
function animate() {
    requestAnimationFrame(animate);
    render();
}

// Let's render this!
function render() {
  if (texture) { // Check if texture has been loaded
      texture.offset.y -= normal_speed;
      texture.offset.y %= 9;
      texture.needsUpdate = true;
  }

  const seconds = Date.now() / 1000;
  const angle = 0.3 * seconds;
  camera.rotation.z = angle;

  renderer.render(scene, camera);
}

// Execute the functions
init();
animate();