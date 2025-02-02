import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Node } from '../../data/types';
import { categories } from '../../data/categories';
import { nodes } from '../../data/tools/index';

export class NodeManager {
    private scene: THREE.Scene;
    private nodeObjects: Map<string, THREE.Mesh>;
    private nodeLabels: Map<string, CSS2DObject>;
    private categoryLabels: CSS2DObject[] = [];
    private lines: THREE.Line[];
    private categoryObjects: Map<string, THREE.Mesh>;
    private enableGlow: boolean;
    private activeNodeId: string | null = null;
    private highlightedNodeIds: Set<string> = new Set();
    private connections: Map<string, THREE.Line> = new Map();

    constructor(scene: THREE.Scene, enableGlow: boolean = false) {
        this.scene = scene;
        this.nodeObjects = new Map();
        this.nodeLabels = new Map();
        this.lines = [];
        this.categoryObjects = new Map();
        this.enableGlow = enableGlow;

        // Initialize everything in the correct order
        this.setupLighting();
        this.initializeCategories();
        this.createNodes();
        this.createConnections();
    }

    private initializeCategories(): void {
        const categoryGeometry = new THREE.SphereGeometry(2, 32, 32);
        
        // Create category nodes
        categories.forEach((category, index) => {
            const angle = (index / categories.length) * Math.PI * 2;
            const radius = 40;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = 0;

            const material = new THREE.MeshPhongMaterial({
                color: category.color,
                emissive: category.color,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.7
            });

            const mesh = new THREE.Mesh(categoryGeometry, material);
            mesh.position.set(x, y, z);
            this.scene.add(mesh);
            this.categoryObjects.set(category.id, mesh);

            this.createCategoryLabel(category, x, y, z);
        });
    }

    private createNodes(): void {
        const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nodesPerCategory = new Map<string, Node[]>();
        
        // Group nodes by category
        nodes.forEach(node => {
            const categoryNodes = nodesPerCategory.get(node.category) || [];
            categoryNodes.push(node);
            nodesPerCategory.set(node.category, categoryNodes);
        });

        // Create nodes for each category
        nodesPerCategory.forEach((categoryNodes, categoryId) => {
            const categoryCenter = this.categoryObjects.get(categoryId);
            if (!categoryCenter) {
                console.warn(`Category ${categoryId} not found for nodes`);
                return;
            }

            const nodeCount = categoryNodes.length;
            categoryNodes.forEach((node, index) => {
                this.createNode(node, index, nodeCount, categoryCenter.position, nodeGeometry);
            });
        });
    }

    private createNodeMaterial(color: number): THREE.Material {
        if (this.enableGlow) {
            return new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
        } else {
            return new THREE.MeshPhongMaterial({
                color: color
            });
        }
    }

    private createNode(node: Node, index: number, nodeCount: number, categoryCenter: THREE.Vector3, geometry: THREE.BufferGeometry): void {
        const angle = (index / nodeCount) * Math.PI * 4;
        const spiralRadius = 8 + (index / nodeCount) * 4;
        const x = categoryCenter.x + Math.cos(angle) * spiralRadius;
        const z = categoryCenter.z + Math.sin(angle) * spiralRadius;
        const y = categoryCenter.y + (index / nodeCount) * 4 - 2;

        node.position = { x, y, z };

        const category = categories.find(c => c.id === node.category);
        const material = this.createNodeMaterial(category ? parseInt(category.color.replace('#', '0x')) : 0xffffff);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        // Add pulsing animation if glow is enabled
        if (this.enableGlow) {
            const pulseSpeed = 0.5 + Math.random() * 0.5; // Random speed between 0.5 and 1
            const initialPhase = Math.random() * Math.PI * 2; // Random starting phase
            
            mesh.userData.pulse = {
                speed: pulseSpeed,
                phase: initialPhase
            };
            
            // Start the pulse animation
            this.animateNodePulse(mesh);
        }

        this.scene.add(mesh);
        this.nodeObjects.set(node.id, mesh);

        this.createNodeLabel(node, x, y, z);
    }

    private animateNodePulse(mesh: THREE.Mesh) {
        const material = mesh.material as THREE.MeshPhongMaterial;
        const pulse = mesh.userData.pulse;
        
        const animate = () => {
            if (!this.nodeObjects.has(mesh.uuid)) return; // Stop if node is removed
            
            pulse.phase += pulse.speed * 0.016; // Assuming 60fps
            const intensity = 0.3 + Math.sin(pulse.phase) * 0.2;
            material.emissiveIntensity = intensity;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    private createCategoryLabel(category: any, x: number, y: number, z: number): void {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'node-label category-label';
        labelDiv.textContent = category.name;
        labelDiv.style.color = category.color;
        labelDiv.style.padding = '4px';
        labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        labelDiv.style.borderRadius = '4px';
        labelDiv.style.fontSize = '14px';
        labelDiv.style.fontWeight = 'bold';

        const label = new CSS2DObject(labelDiv);
        label.position.set(x, y + 3, z);
        this.scene.add(label);
        this.categoryLabels.push(label);
    }

    private createNodeLabel(node: Node, x: number, y: number, z: number): void {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'node-label';
        labelDiv.textContent = node.name;
        labelDiv.style.color = 'white';
        labelDiv.style.padding = '2px';
        labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        labelDiv.style.borderRadius = '4px';

        const label = new CSS2DObject(labelDiv);
        label.position.set(x, y + 1, z);
        this.scene.add(label);
        this.nodeLabels.set(node.id, label);
    }

    private createConnections(): void {
        nodes.forEach(node => {
            const sourcePosition = node.position!;

            // Create connections for all relationship types
            const allRelations = [
                ...node.links || [],
                ...node.dependencies || [],
                ...node.alternatives || []
            ];

            allRelations.forEach(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (targetNode && targetNode.position) {
                    const points = [
                        new THREE.Vector3(sourcePosition.x, sourcePosition.y, sourcePosition.z),
                        new THREE.Vector3(targetNode.position.x, targetNode.position.y, targetNode.position.z)
                    ];

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({ 
                        color: 0x444444,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    this.scene.add(line);
                    
                    // Store connection with a unique ID combining both node IDs
                    const connectionId = [node.id, targetId].sort().join('-');
                    this.connections.set(connectionId, line);
                }
            });
        });
    }

    private highlightConnections(nodeId: string, visible: boolean): void {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Get all related node IDs
        const relatedIds = new Set([
            ...node.links || [],
            ...node.dependencies || [],
            ...node.alternatives || []
        ]);

        // Highlight or dim connections
        this.connections.forEach((line, connectionId) => {
            const [nodeA, nodeB] = connectionId.split('-');
            const isRelated = (nodeA === nodeId && relatedIds.has(nodeB)) || 
                             (nodeB === nodeId && relatedIds.has(nodeA));

            const material = line.material as THREE.LineBasicMaterial;
            if (isRelated) {
                material.opacity = visible ? 0.8 : 0.3;
                material.color.setHex(visible ? 0x88aaff : 0x444444);
            } else {
                material.opacity = visible ? 0.1 : 0.3;
            }
            material.needsUpdate = true;
        });
    }

    private setupLighting(): void {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }

    public updateLabels(camera: THREE.PerspectiveCamera): void {
        this.nodeLabels.forEach((label, nodeId) => {
            // If node is highlighted, keep it visible
            if (this.highlightedNodeIds.has(nodeId)) {
                label.element.style.display = 'block';
                label.element.style.opacity = '1';
                return;
            }

            // Otherwise apply distance-based visibility
            const distance = camera.position.distanceTo(label.position);
            const opacity = 1 - Math.min(Math.max((distance - 20) / 30, 0), 1);
            label.element.style.opacity = opacity.toString();
            label.element.style.display = opacity > 0 ? 'block' : 'none';
        });
    }

    public getNodeObjects(): Map<string, THREE.Mesh> {
        return this.nodeObjects;
    }

    public showLabel(nodeId: string, visible: boolean): void {
        const label = this.nodeLabels.get(nodeId);
        if (label) {
            label.element.style.display = visible ? 'block' : 'none';
            label.element.style.opacity = '1';
            if (visible) {
                this.highlightedNodeIds.add(nodeId);
                this.setCategoryLabelsVisibility(false);
                this.highlightConnections(nodeId, true);
            } else {
                this.highlightedNodeIds.delete(nodeId);
                this.highlightConnections(nodeId, false);
                if (this.highlightedNodeIds.size === 0) {
                    this.setCategoryLabelsVisibility(true);
                }
            }
        }
    }

    public resetLabelVisibility(): void {
        this.highlightedNodeIds.clear();
        this.nodeLabels.forEach((label) => {
            label.element.style.display = 'block';
        });
        this.setCategoryLabelsVisibility(true);
        
        // Reset all connections
        this.connections.forEach((line) => {
            const material = line.material as THREE.LineBasicMaterial;
            material.opacity = 0.3;
            material.color.setHex(0x444444);
            material.needsUpdate = true;
        });
    }

    private setCategoryLabelsVisibility(visible: boolean): void {
        this.categoryLabels.forEach(label => {
            label.element.style.opacity = visible ? '1' : '0.2';
        });
    }
} 