import * as THREE from 'three';
import gsap from 'gsap';
import Planes from './planes';
import Stats from 'stats.js';

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//document.body.appendChild( stats.dom );

export default class Scene {
	constructor(opts = {}) {
		this.options = opts;

		this.container = document.querySelector('canvas');

		this.scene = new THREE.Scene();
		this.perspective = 100;
		this.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) / Math.PI; //use for camera
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.container,
			antialias: true,
			alpha: true,
		});
		//document.body.appendChild ( this.renderer.domElement );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.mouse = new THREE.Vector2(0, 0);
		this.clock = new THREE.Clock();

		this.initLights();
		this.initCamera();
		this.Planes = new Planes(this.scene, this);
		this.bindEvents();
		this.update();
	}

	initLights() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		this.scene.add(ambientLight);
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.fov, 
			window.innerWidth / window.innerHeight, 
			1, 
			200,
		);
		this.camera.position.set(0, 0, this.perspective);
	}

	centerObject(object) {
		new THREE.Box3().setFromObject(object).getCenter(object.position).multiplyScalar(-1);
	}

	getObjectSize(object) {
		return new THREE.Box3().setFromObject(object).getSize();
	}

	updateCamera() {
		this.camera.fov = this.fov;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}

	onWindowResize() {
		this.updateCamera();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onMouseMove(event) {
		gsap.set(this.mouse, {
			//x: event.clientX,
			//y: event.clientY,
			x: ( event.clientX / window.innerWidth ) * 2 - 1,
			y: -( event.clientY / window.innerHeight ) * 2 + 1,
		});
	}


	onWheel(e) {
		this.Planes.onWheel(e);
	}

	bindEvents() {
		if ('ontouchstart' in window) {
			document.addEventListener('touchmove', ev => this.onMouseMove(ev));
		} else {
			window.addEventListener('resize', () => this.onWindowResize());
			document.addEventListener('mousemove', ev => this.onMouseMove(ev), false);
			document.addEventListener('wheel', e => this.onWheel(e) ) ;
		}
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.Planes.update();
		stats.begin();

		this.renderer.render(this.scene, this.camera);
		stats.end();
	}
}
