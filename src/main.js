import './styles.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PARTS = [
  { name: '主体外壳', type: '工程塑料', color: '#f0bb13', offset: [0, 0, 0] },
  { name: '端子 A', type: '金属插针', color: '#617185', offset: [-18, -60, -3] },
  { name: '端子 B', type: '金属插针', color: '#617185', offset: [-6, -68, 4] },
  { name: '端子 C', type: '金属插针', color: '#617185', offset: [6, -68, -4] },
  { name: '端子 D', type: '金属插针', color: '#617185', offset: [18, -60, 3] },
  { name: '密封件', type: '密封胶件', color: '#00bfc5', offset: [0, -34, 0] },
];

document.querySelector('#app').innerHTML = `
  <main class="app-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="KZ 工业设计首页">
        <span class="brand__mark">KZ</span>
        <span class="brand__copy"><strong>ASSEMBLY VIEWER</strong><small>电控连接器</small></span>
      </a>
      <div class="model-id"><span>型号</span><strong>KZ08TEPAR0921</strong></div>
      <div class="status"><i></i><span>模型已就绪</span></div>
    </header>

    <section class="viewer-panel" aria-label="电控连接器 3D 模型查看器">
      <div class="viewer" id="viewer"></div>
      <div class="loading" id="loading" role="status">
        <span class="loading__ring"></span>
        <p>正在构建 3D 模型</p>
        <small id="loading-progress">0%</small>
      </div>

      <div class="viewer-title">
        <span>EXPLODED VIEW / 01</span>
        <h1>电控连接器</h1>
        <p>拖动旋转 · 滚轮缩放 · 点击零件查看</p>
      </div>

      <aside class="parts-panel" aria-label="零件列表">
        <div class="parts-panel__head"><span>零件清单</span><b>06</b></div>
        <div class="parts-list">
          ${PARTS.map((part, index) => `
            <button class="part-row" type="button" data-part="${index}" aria-label="查看${part.name}">
              <span class="part-row__index">${String(index + 1).padStart(2, '0')}</span>
              <i style="--part-color:${part.color}"></i>
              <span><strong>${part.name}</strong><small>${part.type}</small></span>
            </button>`).join('')}
        </div>
      </aside>

      <div class="selected-part" id="selected-part" aria-live="polite">
        <span id="selected-index">01</span>
        <div><small>当前零件</small><strong id="selected-name">主体外壳</strong></div>
      </div>

      <div class="view-controls" aria-label="视图控制">
        <button id="reset-view" type="button"><span class="control-icon">⌖</span><span>重置视图</span></button>
        <button id="auto-rotate" type="button" aria-pressed="false"><span class="control-icon">↻</span><span>自动旋转</span></button>
      </div>

      <button class="explode-button" id="explode" type="button" aria-pressed="false" disabled>
        <span class="explode-button__icon"><i></i><i></i><i></i></span>
        <span class="explode-button__copy"><small>ONE CLICK</small><strong>一键拆解</strong></span>
        <span class="explode-button__arrow">↗</span>
      </button>

      <div class="progress-track" aria-hidden="true"><span id="explode-progress"></span></div>
      <div class="axis-label axis-label--x">X</div>
      <div class="axis-label axis-label--y">Y</div>
      <div class="axis-label axis-label--z">Z</div>
    </section>
  </main>`;

const viewer = document.querySelector('#viewer');
const loading = document.querySelector('#loading');
const loadingProgress = document.querySelector('#loading-progress');
const explodeButton = document.querySelector('#explode');
const explodeProgress = document.querySelector('#explode-progress');
const autoRotateButton = document.querySelector('#auto-rotate');
const resetViewButton = document.querySelector('#reset-view');
const selectedPart = document.querySelector('#selected-part');
const selectedIndex = document.querySelector('#selected-index');
const selectedName = document.querySelector('#selected-name');
const partRows = [...document.querySelectorAll('.part-row')];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f8fa);
scene.fog = new THREE.Fog(0xf7f8fa, 230, 470);

const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 1000);
const homeCamera = new THREE.Vector3(128, 92, 150);
camera.position.copy(homeCamera);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 82;
controls.maxDistance = 380;
controls.target.set(0, 3, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xcbd2dc, 2.25));
const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
keyLight.position.set(80, 130, 100);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -150;
keyLight.shadow.camera.right = 150;
keyLight.shadow.camera.top = 150;
keyLight.shadow.camera.bottom = -150;
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xcad9ff, 2.3);
rimLight.position.set(-100, 35, -70);
scene.add(rimLight);

const grid = new THREE.GridHelper(460, 46, 0xd7dce3, 0xe7eaee);
grid.position.y = -49;
grid.material.opacity = 0.42;
grid.material.transparent = true;
scene.add(grid);

const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(360, 360),
  new THREE.ShadowMaterial({ color: 0x263449, opacity: 0.12 }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -48.8;
shadow.receiveShadow = true;
scene.add(shadow);

const modelPivot = new THREE.Group();
modelPivot.rotation.x = -Math.PI / 2;
scene.add(modelPivot);

const partObjects = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selected = -1;
let exploded = false;
let explosion = 0;
let animationStart = 0;
let animationFrom = 0;
let animationTo = 0;
let animationDuration = 0;
let pointerDown = null;

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2;
}

function setSelected(index) {
  selected = index;
  partRows.forEach((row, rowIndex) => row.classList.toggle('is-active', rowIndex === index));
  partObjects.forEach((part, partIndex) => {
    part.traverse((child) => {
      if (!child.isMesh) return;
      child.material.emissive?.setHex(partIndex === index ? 0x151c26 : 0x000000);
      child.material.emissiveIntensity = partIndex === index ? 0.18 : 0;
    });
  });
  if (index < 0) {
    selectedPart.classList.remove('is-visible');
    return;
  }
  selectedIndex.textContent = String(index + 1).padStart(2, '0');
  selectedName.textContent = PARTS[index].name;
  selectedPart.classList.add('is-visible');
}

function updateExplosion(value) {
  explosion = value;
  partObjects.forEach((part, index) => {
    const delay = index === 0 ? 0 : index === 5 ? 0.08 : 0.16 + (index - 1) * 0.035;
    const localProgress = index === 0 ? 0 : Math.max(0, Math.min(1, (value - delay) / (1 - delay)));
    const eased = easeInOutCubic(localProgress);
    const [x, y, z] = PARTS[index].offset;
    part.position.set(x * eased, y * eased, z * eased);
  });
  explodeProgress.style.transform = `scaleX(${value})`;
}

function animateExplosion(to) {
  animationStart = performance.now();
  animationFrom = explosion;
  animationTo = to;
  animationDuration = 1050 * Math.abs(to - explosion) + 280;
}

function resetView() {
  camera.position.copy(homeCamera);
  controls.target.set(0, 3, 0);
  controls.update();
  setSelected(-1);
}

function resize() {
  const { clientWidth, clientHeight } = viewer;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight, false);
}

new ResizeObserver(resize).observe(viewer);

const loader = new GLTFLoader();
loader.load(
  '/models/connector.glb',
  (gltf) => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.copy(center).multiplyScalar(-1);

    gltf.scene.children.forEach((part, index) => {
      part.userData.partIndex = index;
      part.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = child.material.clone();
        child.material.side = THREE.DoubleSide;
        child.userData.partIndex = index;
      });
      partObjects[index] = part;
    });
    modelPivot.add(gltf.scene);
    explodeButton.disabled = false;
    loading.classList.add('is-hidden');
    document.body.classList.add('model-ready');
  },
  (event) => {
    if (!event.total) return;
    loadingProgress.textContent = `${Math.round((event.loaded / event.total) * 100)}%`;
  },
  () => {
    loading.querySelector('p').textContent = '模型加载失败';
    loadingProgress.textContent = '请刷新重试';
    loading.classList.add('has-error');
  },
);

explodeButton.addEventListener('click', () => {
  exploded = !exploded;
  explodeButton.setAttribute('aria-pressed', String(exploded));
  explodeButton.querySelector('strong').textContent = exploded ? '一键复原' : '一键拆解';
  explodeButton.classList.toggle('is-exploded', exploded);
  animateExplosion(exploded ? 1 : 0);
  setSelected(-1);
});

autoRotateButton.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  controls.autoRotateSpeed = 1.15;
  autoRotateButton.setAttribute('aria-pressed', String(controls.autoRotate));
});

resetViewButton.addEventListener('click', resetView);
partRows.forEach((row, index) => row.addEventListener('click', () => setSelected(selected === index ? -1 : index)));

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerDown = { x: event.clientX, y: event.clientY };
});

renderer.domElement.addEventListener('pointerup', (event) => {
  if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 5) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(partObjects, true)[0];
  setSelected(hit ? hit.object.userData.partIndex : -1);
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !explodeButton.disabled) {
    event.preventDefault();
    explodeButton.click();
  }
  if (event.code === 'Escape') setSelected(-1);
});

function render(now) {
  if (animationDuration) {
    const elapsed = Math.min(1, (now - animationStart) / animationDuration);
    updateExplosion(animationFrom + (animationTo - animationFrom) * easeInOutCubic(elapsed));
    if (elapsed === 1) animationDuration = 0;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

resize();
requestAnimationFrame(render);
