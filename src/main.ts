import './style.css'
import { Scene } from './Scene'
import * as THREE from 'three'

// Create container
const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

// Add controls info
const controlsInfo = document.createElement('div')
controlsInfo.id = 'controls-info'
controlsInfo.innerHTML = `
    <strong>Controls:</strong><br>
    WASD - Move in view direction<br>
    E/Q - Move Up/Down<br>
    Right Mouse - Hold to look around<br>
    Left Click - View node details<br>
    Shift+D - Toggle debug mode
`
document.body.appendChild(controlsInfo)

// Initialize scene
const scene = new Scene(app)

// Add keyboard controls for WASD movement
const keysPressed = new Set<string>()

window.addEventListener('keydown', (event) => {
    keysPressed.add(event.key.toLowerCase())
})

window.addEventListener('keyup', (event) => {
    keysPressed.delete(event.key.toLowerCase())
})

function updatePosition() {
    scene.updateCameraPosition(keysPressed)
    requestAnimationFrame(updatePosition)
}

updatePosition()
