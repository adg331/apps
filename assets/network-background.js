import * as THREE from './vendor/three.module.min.js';

const canvas = document.getElementById('network-bg');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!canvas || reduceMotion.matches) {
  if (canvas) canvas.hidden = true;
} else {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 600);
    camera.position.z = 240;

    const network = new THREE.Group();
    scene.add(network);

    const isCompact = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    const nodeCount = isCompact ? 34 : 58;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const velocities = [];
    const blue = new THREE.Color(0x8ed8ff);
    const cyan = new THREE.Color(0x62f1ef);

    let width = 1;
    let height = 1;
    let linkDistance = 130;

    function seedNodes() {
      for (let i = 0; i < nodeCount; i += 1) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * width;
        positions[i3 + 1] = (Math.random() - 0.5) * height;
        positions[i3 + 2] = (Math.random() - 0.5) * 60;
        velocities[i] = {
          x: (Math.random() - 0.5) * (isCompact ? 0.075 : 0.11),
          y: (Math.random() - 0.5) * (isCompact ? 0.075 : 0.11)
        };
        const color = Math.random() > 0.78 ? cyan : blue;
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pointMaterial = new THREE.PointsMaterial({
      size: isCompact ? 2.2 : 2.7,
      sizeAttenuation: false,
      transparent: true,
      opacity: isCompact ? 0.46 : 0.58,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    network.add(new THREE.Points(pointGeometry, pointMaterial));

    const maxLinks = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLinks * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x9de4ff,
      transparent: true,
      opacity: isCompact ? 0.075 : 0.11,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    network.add(lines);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      linkDistance = Math.max(105, Math.min(155, width * 0.13));
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function updateNodes() {
      for (let i = 0; i < nodeCount; i += 1) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        if (positions[i3] > width / 2) positions[i3] = -width / 2;
        if (positions[i3] < -width / 2) positions[i3] = width / 2;
        if (positions[i3 + 1] > height / 2) positions[i3 + 1] = -height / 2;
        if (positions[i3 + 1] < -height / 2) positions[i3 + 1] = height / 2;
      }
      pointGeometry.attributes.position.needsUpdate = true;
    }

    function updateLinks() {
      let cursor = 0;
      let links = 0;
      for (let i = 0; i < nodeCount; i += 1) {
        const i3 = i * 3;
        for (let j = i + 1; j < nodeCount; j += 1) {
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          if ((dx * dx) + (dy * dy) > linkDistance * linkDistance) continue;
          linePositions[cursor++] = positions[i3];
          linePositions[cursor++] = positions[i3 + 1];
          linePositions[cursor++] = positions[i3 + 2];
          linePositions[cursor++] = positions[j3];
          linePositions[cursor++] = positions[j3 + 1];
          linePositions[cursor++] = positions[j3 + 2];
          links += 1;
        }
      }
      lineGeometry.setDrawRange(0, links * 2);
      lineGeometry.attributes.position.needsUpdate = true;
    }

    const pointerTarget = { x: 0, y: 0 };
    if (!isCompact) {
      window.addEventListener('pointermove', (event) => {
        pointerTarget.x = ((event.clientX / width) - 0.5) * 12;
        pointerTarget.y = -((event.clientY / height) - 0.5) * 8;
      }, { passive: true });
    }

    let frame = 0;
    function animate() {
      frame = requestAnimationFrame(animate);
      updateNodes();
      updateLinks();
      camera.position.x += (pointerTarget.x - camera.position.x) * 0.025;
      camera.position.y += (pointerTarget.y - camera.position.y) * 0.025;
      renderer.render(scene, camera);
    }

    function start() {
      if (!frame) animate();
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
    window.addEventListener('resize', resize, { passive: true });

    resize();
    seedNodes();
    start();
    canvas.dataset.state = 'active';
    document.documentElement.classList.add('three-ready');
  } catch (error) {
    canvas.hidden = true;
    console.warn('Three.js background disabled:', error);
  }
}
