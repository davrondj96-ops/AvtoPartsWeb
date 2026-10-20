import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SelectedVehicle, SystemCategory, SystemCategoryId } from '../types/garage';
import { GARAGE_SYSTEMS } from '../data/vehicles';
import { VehicleSchematic2D } from './VehicleSchematic2D';
import { RotateCcw, Eye, Layers, Sparkles } from 'lucide-react';

interface GarageScene3DProps {
  vehicle: SelectedVehicle;
  selectedSystemId: SystemCategoryId | null;
  hoveredSystemId: SystemCategoryId | null;
  onSelectSystem: (systemId: SystemCategoryId) => void;
  onHoverSystem: (systemId: SystemCategoryId | null) => void;
  reducedMotion: boolean;
}

// Pre-allocated vectors outside render loop (Zero GC discipline)
const _projVec = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function createFloorGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090B0F';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle asphalt concrete micro-specks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 600; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137) % 512;
    ctx.fillRect(x, y, 2, 2);
  }

  // Architectural garage bay grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let step = 128; step < 512; step += 128) {
    ctx.beginPath();
    ctx.moveTo(step, 0);
    ctx.lineTo(step, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, step);
    ctx.lineTo(512, step);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.55)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const GarageScene3D: React.FC<GarageScene3DProps> = ({
  vehicle,
  selectedSystemId,
  hoveredSystemId,
  onSelectSystem,
  onHoverSystem,
  reducedMotion,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [force2DSchematic, setForce2DSchematic] = useState<boolean>(false);
  const [xrayBody, setXrayBody] = useState<boolean>(false);

  // Store mutable state for the WebGL animation loop without tearing down canvas
  const stateRef = useRef({
    selectedSystemId,
    hoveredSystemId,
    reducedMotion,
    xrayBody,
    bodyStyle: vehicle.bodyStyle,
    resetCameraRequested: false,
  });

  useEffect(() => {
    stateRef.current.selectedSystemId = selectedSystemId;
    stateRef.current.hoveredSystemId = hoveredSystemId;
    stateRef.current.reducedMotion = reducedMotion;
    stateRef.current.xrayBody = xrayBody;
    stateRef.current.bodyStyle = vehicle.bodyStyle;
  }, [selectedSystemId, hoveredSystemId, reducedMotion, xrayBody, vehicle.bodyStyle]);

  useEffect(() => {
    if (force2DSchematic) return;
    const container = canvasMountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglSupported(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090b10);
    scene.fog = new THREE.FogExp2(0x090b10, 0.055);

    // Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(4.1, 2.05, 4.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.4;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.target.set(0, 0.65, 0);

    // 3-Point Studio Lighting Rig + Neon Accents
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0b0d11, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.4);
    keyLight.position.set(4.5, 6.5, 4.0);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    const d = 3.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLightOrange = new THREE.SpotLight(0xf97316, 4.5, 14, Math.PI / 3, 0.6);
    rimLightOrange.position.set(-4.2, 3.2, -3.8);
    scene.add(rimLightOrange);

    const fillLightCyan = new THREE.SpotLight(0x0ea5e9, 3.8, 14, Math.PI / 3, 0.6);
    fillLightCyan.position.set(4.2, 2.8, -3.2);
    scene.add(fillLightCyan);

    // Garage Reflective Floor & Neon Framing
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const floorTex = createFloorGridTexture(maxAniso);
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.22,
      metalness: 0.65,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Contact Shadow Grounding (Offset on Y to avoid coplanar Z-fighting)
    const shadowTex = createContactShadowTexture();
    const contactShadowGeo = new THREE.PlaneGeometry(3.2, 5.6);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.78,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    scene.add(contactShadow);

    // Garage Neon Bay Strips & Overhead Light Arch
    const neonOrangeMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });

    const leftStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 5.4), neonCyanMat);
    leftStrip.rotation.x = -Math.PI / 2;
    leftStrip.position.set(-1.75, 0.02, 0);
    scene.add(leftStrip);

    const rightStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 5.4), neonOrangeMat);
    rightStrip.rotation.x = -Math.PI / 2;
    rightStrip.position.set(1.75, 0.02, 0);
    scene.add(rightStrip);

    // Overhead studio light bars
    const ceilingBarGeo = new THREE.BoxGeometry(2.6, 0.04, 0.12);
    const ceilingBarMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    [-1.4, 0, 1.4].forEach((zPos) => {
      const bar = new THREE.Mesh(ceilingBarGeo, ceilingBarMat);
      bar.position.set(0, 3.2, zPos);
      scene.add(bar);
    });

    // Atmospheric Smoke / Dust Particles (InstancedMesh > 20 items)
    const particleCount = 48;
    const particleGeo = new THREE.PlaneGeometry(0.32, 0.32);
    const particleMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
    });
    const smokeInstanced = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.2 + (i % 5) * 0.65;
      dummy.position.set(
        Math.cos(angle) * radius,
        0.25 + (i % 4) * 0.45,
        Math.sin(angle) * radius
      );
      dummy.rotation.y = angle;
      const s = 0.85 + (i % 3) * 0.15;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      smokeInstanced.setMatrixAt(i, dummy.matrix);
    }
    smokeInstanced.instanceMatrix.needsUpdate = true;
    smokeInstanced.computeBoundingSphere();
    scene.add(smokeInstanced);

    // =========================================================================
    // COMPOSITE 12-PART PROCEDURAL VEHICLE GROUP (THREE.Group)
    // =========================================================================
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);

    // Subsystem Materials Map so we can highlight hovered/selected systems smoothly
    const systemMaterials: Record<SystemCategoryId, THREE.MeshStandardMaterial[]> = {
      body: [],
      interior: [],
      engine: [],
      maintenance: [],
      suspension: [],
      brakes: [],
      wheels: [],
      steering: [],
      transmission: [],
      cooling: [],
      exhaust: [],
      electrical: [],
    };

    const registerMat = (
      sysId: SystemCategoryId,
      mat: THREE.MeshStandardMaterial
    ): THREE.MeshStandardMaterial => {
      mat.userData.baseColor = mat.color.getHex();
      mat.userData.baseEmissive = mat.emissive.getHex();
      systemMaterials[sysId].push(mat);
      return mat;
    };

    // 1. Кузов (Body Hull + Hood + Bumpers) - semi-transparent metallic shell so internal systems are visible!
    const bodyShellMat = registerMat(
      'body',
      new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        metalness: 0.75,
        roughness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      })
    );

    const chassisBaseGeo = new THREE.BoxGeometry(1.88, 0.42, 4.42);
    const chassisBase = new THREE.Mesh(chassisBaseGeo, bodyShellMat);
    chassisBase.position.set(0, 0.54, 0);
    chassisBase.renderOrder = 4;
    vehicleGroup.add(chassisBase);

    const cabinRoofGeo = new THREE.BoxGeometry(1.56, 0.48, 2.15);
    const cabinRoof = new THREE.Mesh(cabinRoofGeo, bodyShellMat);
    cabinRoof.position.set(0, 0.98, -0.22);
    cabinRoof.renderOrder = 4;
    vehicleGroup.add(cabinRoof);

    // Front & Rear Aero Bumpers
    const bumperMat = registerMat(
      'body',
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.85,
        roughness: 0.28,
      })
    );
    const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.14, 0.36), bumperMat);
    frontSplitter.position.set(0, 0.34, 2.12);
    frontSplitter.castShadow = true;
    vehicleGroup.add(frontSplitter);

    // 2. Салон (Interior Seats, Dashboard & Center Console)
    const interiorMat = registerMat(
      'interior',
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.2,
        roughness: 0.65,
      })
    );
    const seatGeo = new THREE.BoxGeometry(0.52, 0.64, 0.52);
    const seatLeft = new THREE.Mesh(seatGeo, interiorMat);
    seatLeft.position.set(-0.42, 0.72, -0.05);
    const seatRight = new THREE.Mesh(seatGeo, interiorMat);
    seatRight.position.set(0.42, 0.72, -0.05);
    const rearBench = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.56, 0.52), interiorMat);
    rearBench.position.set(0, 0.7, -0.88);
    vehicleGroup.add(seatLeft, seatRight, rearBench);

    // 3. Двигатель и навесное оборудование (Engine Block, Twin-Scroll Turbo, Valve Cover)
    const engineMat = registerMat(
      'engine',
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.88,
        roughness: 0.25,
      })
    );
    const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.78), engineMat);
    engineBlock.position.set(0, 0.68, 1.42);
    engineBlock.castShadow = true;
    const intakeManifold = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.16, 0.62), engineMat);
    intakeManifold.position.set(0, 0.94, 1.42);
    vehicleGroup.add(engineBlock, intakeManifold);

    // 4. Фильтры, масла и расходники (Oil Filter Housing & Air Intake Box)
    const maintenanceMat = registerMat(
      'maintenance',
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.5,
        roughness: 0.35,
      })
    );
    const airFilterBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.42), maintenanceMat);
    airFilterBox.position.set(0.52, 0.82, 1.32);
    const oilHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16),
      maintenanceMat
    );
    oilHousing.position.set(0.28, 0.88, 1.12);
    vehicleGroup.add(airFilterBox, oilHousing);

    // 5. Охлаждение и отопление (Front Radiator Core & Intercooler)
    const coolingMat = registerMat(
      'cooling',
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.85,
        roughness: 0.3,
      })
    );
    const radiatorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.44, 0.12), coolingMat);
    radiatorMesh.position.set(0, 0.62, 2.02);
    vehicleGroup.add(radiatorMesh);

    // 6. Электрика и освещение (Matrix LED Headlights & Taillights)
    const electricalMat = registerMat(
      'electrical',
      new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.85,
        metalness: 0.3,
        roughness: 0.15,
      })
    );
    const headLightGeo = new THREE.BoxGeometry(0.38, 0.12, 0.22);
    const headLightL = new THREE.Mesh(headLightGeo, electricalMat);
    headLightL.position.set(-0.68, 0.68, 2.06);
    const headLightR = new THREE.Mesh(headLightGeo, electricalMat);
    headLightR.position.set(0.68, 0.68, 2.06);
    vehicleGroup.add(headLightL, headLightR);

    // 7. Рулевое управление (Steering Wheel, Column & Front Rack)
    const steeringMat = registerMat(
      'steering',
      new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.75,
        roughness: 0.3,
      })
    );
    const steeringRack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 1.56, 12),
      steeringMat
    );
    steeringRack.rotation.z = Math.PI / 2;
    steeringRack.position.set(0, 0.42, 1.26);
    const steeringWheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.028, 12, 24),
      steeringMat
    );
    steeringWheel.position.set(0.42, 0.92, 0.45);
    steeringWheel.rotation.x = -0.35;
    vehicleGroup.add(steeringRack, steeringWheel);

    // 8. Трансмиссия (8-Speed Gearbox, Driveshaft & Rear Differential)
    const transMat = registerMat(
      'transmission',
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.82,
        roughness: 0.32,
      })
    );
    const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.75), transMat);
    gearbox.position.set(0, 0.46, 0.65);
    const driveShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 2.1, 14),
      transMat
    );
    driveShaft.rotation.x = Math.PI / 2;
    driveShaft.position.set(0, 0.42, -0.35);
    vehicleGroup.add(gearbox, driveShaft);

    // 9. Выхлопная система (Dual Exhaust Pipes & Rear Muffler Box)
    const exhaustMat = registerMat(
      'exhaust',
      new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        metalness: 0.92,
        roughness: 0.2,
      })
    );
    const mufflerBox = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.2, 0.42), exhaustMat);
    mufflerBox.position.set(0, 0.36, -1.88);
    const tipGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.32, 16);
    const tipL = new THREE.Mesh(tipGeo, exhaustMat);
    tipL.rotation.x = Math.PI / 2;
    tipL.position.set(-0.52, 0.35, -2.12);
    const tipR = new THREE.Mesh(tipGeo, exhaustMat);
    tipR.rotation.x = Math.PI / 2;
    tipR.position.set(0.52, 0.35, -2.12);
    vehicleGroup.add(mufflerBox, tipL, tipR);

    // 10. Ходовая часть и подвеска (4 Coilover Struts + Lower Control Arms)
    const suspensionMat = registerMat(
      'suspension',
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        metalness: 0.65,
        roughness: 0.28,
      })
    );
    // 11. Тормозная система (4 Ventilated Brake Rotors & Calipers)
    const brakeMat = registerMat(
      'brakes',
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.9,
        roughness: 0.22,
      })
    );
    // 12. Колёса и шины (4 Alloy Rims & Tires)
    const wheelMat = registerMat(
      'wheels',
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.55,
        roughness: 0.45,
      })
    );

    const wheelPositions: [number, number, number][] = [
      [0.92, 0.38, 1.38],
      [-0.92, 0.38, 1.38],
      [0.92, 0.38, -1.38],
      [-0.92, 0.38, -1.38],
    ];

    const strutGeo = new THREE.CylinderGeometry(0.085, 0.07, 0.58, 16);
    const armGeo = new THREE.BoxGeometry(0.55, 0.06, 0.22);
    const rotorGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 24);
    const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 28);

    wheelPositions.forEach(([wx, wy, wz]) => {
      const sign = wx > 0 ? 1 : -1;

      // Suspension strut & control arm
      const strut = new THREE.Mesh(strutGeo, suspensionMat);
      strut.position.set(wx - sign * 0.14, wy + 0.32, wz);
      strut.rotation.z = sign * 0.15;
      const controlArm = new THREE.Mesh(armGeo, suspensionMat);
      controlArm.position.set(wx - sign * 0.28, wy - 0.04, wz);
      vehicleGroup.add(strut, controlArm);

      // Ventilated brake rotor
      const rotor = new THREE.Mesh(rotorGeo, brakeMat);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.set(wx - sign * 0.06, wy, wz);
      vehicleGroup.add(rotor);

      // Tire & wheel rim
      const wheel = new THREE.Mesh(tireGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = true;
      vehicleGroup.add(wheel);
    });

    // Raycast proxy spheres for each of the 12 garage systems (Dedicated layer 1)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    const proxyMeshes: THREE.Mesh[] = [];
    const proxyGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

    GARAGE_SYSTEMS.forEach((sys) => {
      const proxy = new THREE.Mesh(proxyGeo, proxyMat);
      proxy.position.set(...sys.hotspotPosition);
      proxy.layers.set(1);
      proxy.userData.systemId = sys.id;
      vehicleGroup.add(proxy);
      proxyMeshes.push(proxy);
    });

    // Pointer Interaction (Hover & Click Raycasting with Throttling)
    let lastRaycastTime = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 45) return;
      lastRaycastTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(proxyMeshes, false);
      if (hits.length > 0) {
        const sysId = hits[0].object.userData.systemId as SystemCategoryId;
        renderer.domElement.style.cursor = 'pointer';
        onHoverSystem(sysId);
      } else {
        renderer.domElement.style.cursor = 'grab';
        onHoverSystem(null);
      }
    };

    let pointerDownPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Dragged orbit controls, ignore click

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(proxyMeshes, false);
      if (hits.length > 0) {
        const sysId = hits[0].object.userData.systemId as SystemCategoryId;
        onSelectSystem(sysId);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Resize observer
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const clock = new THREE.Clock();
    let animFrameId = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const {
        selectedSystemId: selId,
        hoveredSystemId: hovId,
        reducedMotion: redMot,
        xrayBody: isXray,
        bodyStyle,
        resetCameraRequested,
      } = stateRef.current;

      // Adapt roof height smoothly for SUV vs Sedan
      const targetRoofScaleY = bodyStyle === 'suv' ? 1.32 : 1.0;
      cabinRoof.scale.y = THREE.MathUtils.damp(cabinRoof.scale.y, targetRoofScaleY, 6, delta);

      // X-ray body shell opacity
      const activeSys = hovId || selId;
      const targetBodyOpacity = isXray
        ? 0.18
        : activeSys && activeSys !== 'body'
        ? 0.34
        : 0.68;
      bodyShellMat.opacity = THREE.MathUtils.damp(
        bodyShellMat.opacity,
        targetBodyOpacity,
        8,
        delta
      );

      // Highlight active subsystem meshes in orange/cyan
      (Object.keys(systemMaterials) as SystemCategoryId[]).forEach((sysKey) => {
        const isHighlighted = hovId === sysKey || selId === sysKey;
        systemMaterials[sysKey].forEach((mat) => {
          if (isHighlighted) {
            mat.emissive.setHex(0xf97316);
            mat.emissiveIntensity = THREE.MathUtils.damp(
              mat.emissiveIntensity,
              0.75,
              10,
              delta
            );
          } else {
            mat.emissive.setHex(mat.userData.baseEmissive || 0x000000);
            mat.emissiveIntensity = THREE.MathUtils.damp(
              mat.emissiveIntensity,
              sysKey === 'electrical' ? 0.65 : 0.0,
              10,
              delta
            );
          }
        });
      });

      // Camera smooth glide when reset or system selected
      if (resetCameraRequested) {
        _targetPos.set(4.1, 2.05, 4.4);
        _targetLook.set(0, 0.65, 0);
        camera.position.lerp(_targetPos, redMot ? 1 : 0.12);
        controls.target.lerp(_targetLook, redMot ? 1 : 0.12);
        if (camera.position.distanceTo(_targetPos) < 0.08) {
          stateRef.current.resetCameraRequested = false;
        }
      } else if (selId && !redMot) {
        const sysObj = GARAGE_SYSTEMS.find((s) => s.id === selId);
        if (sysObj) {
          _targetLook.set(...sysObj.cameraTarget);
          controls.target.lerp(_targetLook, 1 - Math.exp(-4.5 * delta));
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Project 3D Hotspot Pins onto 2D DOM Overlay coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      GARAGE_SYSTEMS.forEach((sys) => {
        const btn = hotspotRefs.current[sys.id];
        if (!btn) return;
        _projVec.set(...sys.hotspotPosition);
        _projVec.project(camera);

        if (_projVec.z > 1) {
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
        } else {
          const x = (_projVec.x * 0.5 + 0.5) * rect.width;
          const y = (-(_projVec.y * 0.5) + 0.5) * rect.height;
          btn.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      floorTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
    };
  }, [force2DSchematic]);

  if (!webglSupported || force2DSchematic) {
    return (
      <div className="relative w-full h-full">
        <VehicleSchematic2D
          vehicle={vehicle}
          selectedSystemId={selectedSystemId}
          hoveredSystemId={hoveredSystemId}
          onSelectSystem={onSelectSystem}
          onHoverSystem={onHoverSystem}
        />
        {webglSupported && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12161F] border border-white/15">
            <button
              type="button"
              onClick={() => setForce2DSchematic(false)}
              className="text-xs font-medium text-[#38BDF8] hover:text-white transition-colors whitespace-nowrap"
            >
              Вернуться в 3D-гараж
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#090B10] overflow-hidden select-none">
      {/* Dedicated Isolated WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="w-full h-full" />

      {/* Semantic 2D Projected Hotspot Pins over 3D Scene */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {GARAGE_SYSTEMS.map((sys: SystemCategory) => {
          const isSelected = selectedSystemId === sys.id;
          const isHovered = hoveredSystemId === sys.id;
          const isActive = isSelected || isHovered;

          return (
            <button
              key={sys.id}
              ref={(el) => {
                hotspotRefs.current[sys.id] = el;
              }}
              type="button"
              onClick={() => onSelectSystem(sys.id)}
              onMouseEnter={() => onHoverSystem(sys.id)}
              onMouseLeave={() => onHoverSystem(null)}
              aria-label={`Выбрать узел: ${sys.name}`}
              className="group absolute top-0 left-0 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded-full"
              style={{ willChange: 'transform' }}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-transform duration-150 ${
                  isActive
                    ? 'scale-125 bg-[#F97316] text-white border-white shadow-[0_0_18px_rgba(249,115,22,0.9)]'
                    : 'bg-[#12161F]/90 text-slate-100 border-[#38BDF8]/80 hover:border-[#F97316] hover:scale-110'
                }`}
              >
                +
              </span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-opacity ${
                  isActive
                    ? 'opacity-100 bg-[#12161F] text-white border border-[#F97316]'
                    : 'opacity-0 group-hover:opacity-100 bg-[#12161F]/95 text-slate-200 border border-white/15'
                }`}
              >
                {sys.shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mandatory Schematic Model Disclaimer + Camera Dock (No backdrop-blur over WebGL) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#12161F] border border-white/15 shadow-2xl max-w-[94vw]">
        <span className="text-xs text-slate-400 whitespace-nowrap pr-2 border-r border-white/10">
          Схематическое изображение ({vehicle.bodyStyle === 'suv' ? 'Кроссовер / SUV' : 'Седан'})
        </span>

        <button
          type="button"
          onClick={() => setXrayBody((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            xrayBody
              ? 'bg-[#F97316] text-white'
              : 'bg-[#1A202C] text-slate-200 hover:bg-[#232B3A]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Рентген кузова</span>
        </button>

        <button
          type="button"
          onClick={() => {
            stateRef.current.resetCameraRequested = true;
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A202C] text-slate-200 hover:bg-[#232B3A] transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сброс ракурса</span>
        </button>

        <button
          type="button"
          onClick={() => setForce2DSchematic(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A202C] text-slate-200 hover:bg-[#232B3A] transition-colors whitespace-nowrap shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D-схема</span>
        </button>
      </div>
    </div>
  );
};

export default GarageScene3D;
