import "./style.css";

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  ShaderMaterial,
  Mesh,
  AmbientLight,
  DirectionalLight,
  OrthographicCamera,
  NearestFilter,
  RGBAFormat,
  WebGLRenderTarget,
  Color,
  Vector4,
  SphereGeometry,
  Clock,
  Sphere,
} from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer.js";

import vertexShader from "./glsl/glsl.vert?raw";
import fragmentShader from "./glsl/glsl.frag?raw";
import shadowFragmentShader from "./glsl/shadow.frag?raw";

const intensity_0 = new Vector4(1, 0, 0, 0);
let time = 0;
let delta = 0;
let clock = new Clock();
clock.start();

function createMaterial(color: number, vertexShader: any, fragmentShader: any) {
  const uniforms = {
    uTime: {
      value: 0,
    },
    uColor: {
      value: new Color(color),
    },
    uLightPos: {
      value: light.position,
    },
    uDepthMap: {
      value: light.shadow.map.texture,
    },
    uShadowCameraP: {
      value: shadowCamera.projectionMatrix,
    },
    uShadowCameraV: {
      value: shadowCamera.matrixWorldInverse,
    },
    uIntensity_0: {
      value: intensity_0,
    },
  };

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  });

  const shadowMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader: shadowFragmentShader,
    uniforms,
  });

  return { material, shadowMaterial };
}

function createObj(geometry: any, color: number) {
  const { material, shadowMaterial } = createMaterial(
    color,
    vertexShader,
    fragmentShader
  );
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);
  return { mesh, material, shadowMaterial };
}

// let gui = new GUI();
// let params = {
//   scale: 1.0,
// };
// gui.add(params, 'scale', 1.0, 4.0).onChange(() => { cube.scale.set(params.scale, params.scale, params.scale) });

const uniforms = {
  uTick: { type: "f", value: 0.0 },
};

let scene = new Scene();

let camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(90, 60, 90).multiplyScalar(2);
camera.lookAt(scene.position);

let renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xe1e5ea);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// 指向性ライトを配置
const light = new DirectionalLight(0xffffff, 1);
light.position.set(-60, 50, 40);
scene.add(light);

// シャドウカメラ
const frustumSize = 200;
const shadowCamera = (light.shadow.camera = new OrthographicCamera(
  -frustumSize / 2,
  frustumSize / 2,
  frustumSize / 2,
  -frustumSize / 2,
  1,
  frustumSize
));
scene.add(shadowCamera);
light.shadow.camera.position.copy(light.position);
light.shadow.camera.lookAt(scene.position);

// 深度マップ
light.shadow.mapSize.x = 2048;
light.shadow.mapSize.y = 2048;

const pars = {
  minFilter: NearestFilter,
  magFilter: NearestFilter,
  format: RGBAFormat,
};

light.shadow.map = new WebGLRenderTarget(
  light.shadow.mapSize.x,
  light.shadow.mapSize.y,
  pars
);

const depthViewer = new ShadowMapViewer(light);
depthViewer.size.set(300, 300);

// 床
const groundGeometry = new BoxGeometry(250, 250, 250);
const { material: groundMaterial, shadowMaterial: groundShadowMaterial } =
  createMaterial(0xe1e5ea, vertexShader, fragmentShader);
const ground = new Mesh(groundGeometry, groundMaterial);
ground.position.y = -125;
scene.add(ground);

// オブジェクトを色々配置
const cube = createObj(new BoxGeometry(20, 20, 20), 0xfaf3f3);
cube.mesh.position.set(40, 10, -30);

const sphere = createObj(new SphereGeometry(24, 32, 32), 0xfaf3f3);
sphere.mesh.position.set(-20, 24, 0);

function updateLight() {
  let x = light.position.x;
  let z = light.position.z;

  const s = Math.sin(delta * 0.2);
  const c = Math.cos(delta * 0.2);

  const nx = x * c - z * s;
  const nz = x * s + z * c;

  light.position.x = nx;
  light.position.z = nz;

  shadowCamera.position.copy(light.position);
  shadowCamera.lookAt(scene.position);
}

function loop() {
  delta = clock.getDelta();
  time += delta;

  updateLight();

  // 深度を表示
  ground.material = groundShadowMaterial;
  cube.mesh.material = cube.shadowMaterial;
  sphere.mesh.material = sphere.shadowMaterial;
  renderer.setRenderTarget(light.shadow.map);
  renderer.render(scene, shadowCamera);

  // 通常のマテリアルを表示
  ground.material = groundMaterial;
  cube.mesh.material = cube.material;
  sphere.mesh.material = sphere.material;
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  depthViewer.render(renderer);

  requestAnimationFrame(loop);
}
loop();

let resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);
resize();
