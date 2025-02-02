import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { nodes } from './data/tools';
import { CameraController } from './components/camera/CameraController';
import { NodeManager } from './components/nodes/NodeManager';
import { UIManager } from './components/ui/UIManager';
import { BloomEffect } from './effects/Bloom';

export class Scene {
    private scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private labelRenderer: CSS2DRenderer;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private debugMode: boolean = false;
    private debugInfo: HTMLDivElement;
    private debugControls: HTMLDivElement;
    private bloomEffect: BloomEffect;
    private clock: THREE.Clock;

    private cameraController: CameraController;
    private nodeManager: NodeManager;
    private uiManager: UIManager;

    constructor(container: HTMLElement) {
        this.clock = new THREE.Clock();

        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            85,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 65;
        this.camera.position.y = 50;
        this.camera.rotation.x = -0.75;

        // Debug info setup
        this.debugInfo = document.createElement('div');
        this.debugInfo.style.position = 'fixed';
        this.debugInfo.style.top = '20px';
        this.debugInfo.style.left = '20px';
        this.debugInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.debugInfo.style.color = 'white';
        this.debugInfo.style.padding = '10px';
        this.debugInfo.style.borderRadius = '5px';
        this.debugInfo.style.fontFamily = 'monospace';
        this.debugInfo.style.fontSize = '12px';
        this.debugInfo.style.display = 'none';
        this.debugInfo.style.zIndex = '1000';
        container.appendChild(this.debugInfo);

        // Debug controls setup
        this.debugControls = document.createElement('div');
        this.debugControls.style.position = 'fixed';
        this.debugControls.style.top = '20px';
        this.debugControls.style.right = '20px';
        this.debugControls.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.debugControls.style.color = 'white';
        this.debugControls.style.padding = '10px';
        this.debugControls.style.borderRadius = '5px';
        this.debugControls.style.fontFamily = 'monospace';
        this.debugControls.style.fontSize = '12px';
        this.debugControls.style.display = 'none';
        this.debugControls.style.zIndex = '1000';
        this.debugControls.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label>Brightness: <span id="brightness-value">0.0</span></label><br>
                <input type="range" id="brightness" min="-0.2" max="0.2" step="0.01" value="0" style="width: 200px">
            </div>
            <div style="margin-bottom: 10px;">
                <label>Contrast: <span id="contrast-value">1.0</span></label><br>
                <input type="range" id="contrast" min="0.8" max="1.2" step="0.01" value="1" style="width: 200px">
            </div>
            <div style="margin-bottom: 10px;">
                <label>Saturation: <span id="saturation-value">1.0</span></label><br>
                <input type="range" id="saturation" min="0.8" max="1.5" step="0.01" value="1" style="width: 200px">
            </div>
        `;
        container.appendChild(this.debugControls);

        // Add event listeners for sliders
        const brightnessSlider = this.debugControls.querySelector('#brightness') as HTMLInputElement;
        const contrastSlider = this.debugControls.querySelector('#contrast') as HTMLInputElement;
        const saturationSlider = this.debugControls.querySelector('#saturation') as HTMLInputElement;

        brightnessSlider.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            this.bloomEffect.setBrightness(value);
            (this.debugControls.querySelector('#brightness-value') as HTMLSpanElement).textContent = value.toFixed(1);
        });

        contrastSlider.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            this.bloomEffect.setContrast(value);
            (this.debugControls.querySelector('#contrast-value') as HTMLSpanElement).textContent = value.toFixed(1);
        });

        saturationSlider.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            this.bloomEffect.setSaturation(value);
            (this.debugControls.querySelector('#saturation-value') as HTMLSpanElement).textContent = value.toFixed(1);
        });

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        container.appendChild(this.renderer.domElement);

        // Skybox setup
        const textureLoader = new THREE.TextureLoader();
        const skyboxTexture = textureLoader.load('/skybox.jpg');
        skyboxTexture.mapping = THREE.EquirectangularReflectionMapping;
        skyboxTexture.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = skyboxTexture;

        // Bloom setup
        this.bloomEffect = new BloomEffect(this.scene, this.camera, this.renderer);

        // Label renderer setup
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        container.appendChild(this.labelRenderer.domElement);

        // Initialize components
        this.cameraController = new CameraController(this.camera);
        this.nodeManager = new NodeManager(this.scene, true); // true to enable glow
        this.uiManager = new UIManager();

        // Raycaster setup
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));

        // Start animation loop
        this.animate();
    }

    private onClick(event: MouseEvent): void {
        if (!this.cameraController.isInLookMode()) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(
                Array.from(this.nodeManager.getNodeObjects().values())
            );

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object as THREE.Mesh;
                const clickedNodeId = Array.from(this.nodeManager.getNodeObjects().entries())
                    .find(([_, mesh]) => mesh === clickedMesh)?.[0];

                if (clickedNodeId) {
                    const node = nodes.find(n => n.id === clickedNodeId);
                    if (node) {
                        this.uiManager.showNodeInfo(node);
                    }
                }
            }
        }
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.bloomEffect.resize();
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'D' && event.shiftKey) {
            this.debugMode = !this.debugMode;
            this.debugInfo.style.display = this.debugMode ? 'block' : 'none';
            this.debugControls.style.display = this.debugMode ? 'block' : 'none';
        }
    }

    private updateDebugInfo(): void {
        if (this.debugMode) {
            const pos = this.camera.position;
            const euler = new THREE.Euler().setFromQuaternion(this.camera.quaternion);
            this.debugInfo.innerHTML = `
                Camera Position:<br>
                X: ${pos.x.toFixed(2)}<br>
                Y: ${pos.y.toFixed(2)}<br>
                Z: ${pos.z.toFixed(2)}<br>
                <br>
                Camera Rotation:<br>
                X: ${(euler.x * 180 / Math.PI).toFixed(1)}°<br>
                Y: ${(euler.y * 180 / Math.PI).toFixed(1)}°<br>
                Z: ${(euler.z * 180 / Math.PI).toFixed(1)}°
            `;
        }
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        const deltaTime = this.clock.getDelta();
        
        this.nodeManager.updateLabels(this.camera);
        this.updateDebugInfo();
        
        // Render with post-processing
        this.bloomEffect.render();
        // Don't render again with the normal renderer as it would override the post-processing
        // Only render the CSS labels
        this.labelRenderer.render(this.scene, this.camera);
    }

    public updateCameraPosition(keysPressed: Set<string>): void {
        this.cameraController.updatePosition(keysPressed);
    }
} 