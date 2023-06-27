import * as THREE from 'three'

const scene = new THREE.Scene();
const width = 800;
const heigh = 500;
const camera = new THREE.PerspectiveCamera(75, width / heigh, 0.1, 1000);
camera.position.set(0,0,20);
camera.lookAt(0,0,0);

const material = new THREE.LineBasicMaterial( {color: 0x0000ff} );

const points = [];
points.push( new THREE.Vector3( -10, 0, 0 ));
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector3( -7, -5, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, material );

scene.add( line );

const renderer = new THREE.WebGLRenderer();

renderer.setSize(width, heigh);

renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);