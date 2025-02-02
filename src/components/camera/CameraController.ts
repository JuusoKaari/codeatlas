import * as THREE from 'three';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private euler: THREE.Euler;
    private clock: THREE.Clock;
    private moveSpeed: number = 20;
    private mouseSensitivity: number = 0.002;
    private isRightMouseDown: boolean = false;
    
    // New properties for inertia
    private currentVelocity: THREE.Vector3;
    private acceleration: number = 40; // Units per second^2
    private deceleration: number = 10; // Units per second^2
    private maxSpeed: number = 20; // Maximum speed units per second

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.clock = new THREE.Clock();
        this.currentVelocity = new THREE.Vector3();

        // Event listeners
        window.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    private onMouseDown(event: MouseEvent): void {
        if (event.button === 2) {
            this.isRightMouseDown = true;
            document.body.style.cursor = 'grabbing';
        }
    }

    private onMouseUp(event: MouseEvent): void {
        if (event.button === 2) {
            this.isRightMouseDown = false;
            document.body.style.cursor = 'auto';
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.isRightMouseDown) {
            this.euler.y -= event.movementX * this.mouseSensitivity;
            this.euler.x -= event.movementY * this.mouseSensitivity;
            this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
            this.camera.quaternion.setFromEuler(this.euler);
        }
    }

    public updatePosition(keysPressed: Set<string>): void {
        const deltaTime = this.clock.getDelta();
        const targetVelocity = new THREE.Vector3();

        // Get camera's local axes
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

        // Calculate target velocity based on keys pressed
        if (keysPressed.has('w')) targetVelocity.add(forward);
        if (keysPressed.has('s')) targetVelocity.sub(forward);
        if (keysPressed.has('a')) targetVelocity.sub(right);
        if (keysPressed.has('d')) targetVelocity.add(right);
        if (keysPressed.has('e')) targetVelocity.add(new THREE.Vector3(0, 1, 0));
        if (keysPressed.has('q')) targetVelocity.add(new THREE.Vector3(0, -1, 0));

        // Normalize and scale target velocity
        if (targetVelocity.length() > 0) {
            targetVelocity.normalize().multiplyScalar(this.maxSpeed);
        }

        // Apply acceleration or deceleration
        const accelerationVector = new THREE.Vector3();
        
        if (targetVelocity.length() > 0) {
            // Accelerate towards target velocity
            accelerationVector.subVectors(targetVelocity, this.currentVelocity);
            if (accelerationVector.length() > this.acceleration * deltaTime) {
                accelerationVector.normalize().multiplyScalar(this.acceleration * deltaTime);
            }
        } else {
            // Decelerate when no keys are pressed
            const decelAmount = this.deceleration * deltaTime;
            if (this.currentVelocity.length() <= decelAmount) {
                this.currentVelocity.set(0, 0, 0);
            } else {
                accelerationVector.copy(this.currentVelocity).normalize().multiplyScalar(-decelAmount);
            }
        }

        // Update current velocity
        this.currentVelocity.add(accelerationVector);

        // Clamp speed to maximum
        if (this.currentVelocity.length() > this.maxSpeed) {
            this.currentVelocity.normalize().multiplyScalar(this.maxSpeed);
        }

        // Apply movement
        this.camera.position.add(this.currentVelocity.clone().multiplyScalar(deltaTime));
    }

    public isInLookMode(): boolean {
        return this.isRightMouseDown;
    }
} 