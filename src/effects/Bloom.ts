import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// Custom shader for color correction
const ColorCorrectionShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'brightness': { value: -10.0 },
        'contrast': { value: 1.0 },
        'saturation': { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float brightness;
        uniform float contrast;
        uniform float saturation;
        varying vec2 vUv;

        vec3 rgb2hsv(vec3 c) {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            // Convert to HSV for better color manipulation
            vec3 hsv = rgb2hsv(color.rgb);
            
            // Apply saturation in HSV space
            hsv.y *= saturation;
            
            // Convert back to RGB
            vec3 rgb = hsv2rgb(hsv);
            
            // Apply brightness and contrast in RGB space
            vec3 brightColor = rgb + vec3(brightness);
            vec3 finalColor = (brightColor - 0.5) * contrast + 0.5;
            
            gl_FragColor = vec4(finalColor, color.a);
        }
    `
};

export class BloomEffect {
    private composer: EffectComposer;
    private bloomPass: UnrealBloomPass;
    private colorCorrectionPass: ShaderPass;

    constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        this.composer = new EffectComposer(renderer);
        
        // Add the main render pass
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        // Add color correction pass first
        this.colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
        this.setColorCorrection(0.0, 1.0, 1.0); // Default values: no correction
        this.composer.addPass(this.colorCorrectionPass);

        // Add the bloom pass last
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            5.0,    // bloom strength
            0.7,    // radius
            0.1     // threshold
        );
        this.composer.addPass(this.bloomPass);
    }

    resize() {
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.composer.render();
    }

    setColorCorrection(brightness: number, contrast: number, saturation: number) {
        this.colorCorrectionPass.uniforms.brightness.value = brightness;
        this.colorCorrectionPass.uniforms.contrast.value = contrast;
        this.colorCorrectionPass.uniforms.saturation.value = saturation;
    }

    // Convenience methods for individual adjustments
    setBrightness(value: number) {
        this.colorCorrectionPass.uniforms.brightness.value = value;
    }

    setContrast(value: number) {
        this.colorCorrectionPass.uniforms.contrast.value = value;
    }

    setSaturation(value: number) {
        this.colorCorrectionPass.uniforms.saturation.value = value;
    }
} 