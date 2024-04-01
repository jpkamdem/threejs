import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    .1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

camera.position.set(-10, 30, 30) // x, y, z
orbit.update()

const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0ffffff,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.receiveShadow = true
plane.rotation.x = -.5 * Math.PI

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.castShadow = true

sphere.position.set(-10, 10, 0)

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, .2)
// scene.add(directionalLight)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12
// directionalLight.position.set(-30, 50, 0) // ook

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

const spotLight = new THREE.SpotLight(0xffffff)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.angle = .2

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

scene.fog = new THREE.Fog(0xffffff, 0, 200)

const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

const gui = new dat.GUI()

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: .01,
    angle: .2,
    penumbra: 0,
    intensity: 1 
}

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e)
})

gui.add(options, 'speed', 0, .1)
gui.add(options, 'angle', 0, 2)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e
})

let step = 0

const animate = (time) => {
    box.rotation.x = time / 1000
    box.rotation.y = time / 1000

    spotLight.angle = options.angle
    spotLight.penumbra = options.penumbra
    spotLight.intensity = options.intensity
    sLightHelper.update()

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step))
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
