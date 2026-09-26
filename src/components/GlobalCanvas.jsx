import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GlobalCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.005);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 200, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const vortexGroup = new THREE.Group();
    scene.add(vortexGroup);

    const instanceCount = 3000;
    const geom = new THREE.OctahedronGeometry(1.5, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    const instancedMesh = new THREE.InstancedMesh(geom, mat, instanceCount);
    vortexGroup.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const instanceData = [];

    for (let i = 0; i < instanceCount; i++) {
      const y = (Math.random() - 0.5) * 800;
      const radius = 15 + Math.random() * 40;
      const angle = y * 0.02 + Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = Math.random() * 2 + 0.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      instanceData.push({
        rx: (Math.random() - 0.5) * 0.05,
        ry: (Math.random() - 0.5) * 0.05
      });
    }

    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(instanceCount * 3);
    for (let i = 0; i < instanceCount * 3; i += 3) {
      const y = (Math.random() - 0.5) * 800;
      const radius = Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      dustPos[i] = Math.cos(angle) * radius;
      dustPos[i + 1] = y;
      dustPos[i + 2] = Math.sin(angle) * radius;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dustPoints = new THREE.Points(dustGeom, dustMat);
    vortexGroup.add(dustPoints);

    let scrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => { scrollY = window.scrollY; };
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const animate = () => {
      const time = clock.getElapsedTime();
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const scrollRatio = Math.min(1, Math.max(0, scrollY / maxScroll));
      const targetY = 200 - (scrollRatio * 600);
      camera.position.y += (targetY - camera.position.y) * 0.1;
      vortexGroup.rotation.y = time * 0.1;

      for (let i = 0; i < instanceCount; i++) {
        instancedMesh.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.rotation.x += instanceData[i].rx;
        dummy.rotation.y += instanceData[i].ry;
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      camera.position.x = Math.sin(scrollRatio * Math.PI * 2) * 8 + mouseX * 5;
      camera.position.z = Math.cos(scrollRatio * Math.PI * 2) * 8 + mouseY * 5;
      camera.lookAt(0, camera.position.y - 100, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="global-3d-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
    />
  );
};

export default GlobalCanvas;
