import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import worldmap from '../assets/worldmap.jpg'
import bandoneon from '../assets/bandoneon.png'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

// camera related
const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    .1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 2, 15)
orbit.update()

// object related
const textureLoader = new THREE.TextureLoader()

const sphereGeometry = new THREE.SphereGeometry(4, 15, 15)
const sphereMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load(worldmap)})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

const animate = () => {
    sphere.rotation.y += .001
    renderer.render(scene, camera)
}

// light related
const dLight = new THREE.DirectionalLight(0xFAFFA3, .8)
dLight.position.set(-30, 0, 30)
scene.add(dLight)

// helpers
// sidenote-> red: x (left- to right+), green: y (bottom- to top+), z: blue (backward- to forward+)
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper) 
// const dLightHelper = new THREE.DirectionalLightHelper(dLight)
// scene.add(dLightHelper)

// Ajoutez un gestionnaire d'événements pour le clic sur la sphère
renderer.domElement.addEventListener('click', onClick, false);

let popup = null;

function onClick(event) {
    // Vérifiez si un popup existe déjà et supprimez-le
    if (popup !== null) {
        document.body.removeChild(popup);
        popup = null;
    }

    // Obtenez la position du clic sur la sphèr
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sphere);

    if (intersects.length > 0) {
        const popupText = `
            <h2>Le bandonéon</h2>
            <img src=${bandoneon}>
            <p>L'accordéon est l'instrument emblématique du tango argentin et possède une histoire fascinante. Conçu en Allemagne au XIXème siècle, il servait à l’origine à jouer de la musique religieuse dans les églises. Cependant, lorsqu’elle a été introduite en Argentine au début du XXe siècle, sa fortune a pris une tournure inattendue. Les immigrants allemands ont apporté cet instrument qui a rapidement conquis le cœur des musiciens argentins. L'accordéon est devenu un élément central du tango, ajoutant une profondeur émotionnelle à cette musique passionnée et sensuelle. Il existe une anecdote célèbre à propos du célèbre accordéoniste argentin Astor Piazzolla qui a commencé à jouer de l'accordéon après en avoir entendu un enregistrement lorsqu'il était enfant. Fasciné par le son de l'instrument, il apprend vite à en jouer et devient l'un des plus grands musiciens de tous les temps. Aujourd'hui, l'accordéon continue de ravir le public du monde entier avec sa sonorité unique et son riche héritage culturel, incarnant l'essence du tango argentin.</p>
        `; // Remplacez par le contenu souhaité

        // Créez et affichez un nouveau popup
        popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = popupText;
        popup.style.position = 'absolute';
        popup.style.top = `${event.clientY - 450}px`;
        popup.style.left = `${event.clientX + 250}px`;
        document.body.appendChild(popup);

        // Supprimez le popup après un certain délai
        setTimeout(() => {
            if (popup !== null) {
                document.body.removeChild(popup);
                popup = null;
            }
        }, 10000); // 3000 ms = 3 secondes (ajustez selon vos besoins)
    }
}


renderer.setAnimationLoop(animate)