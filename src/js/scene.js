import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';
import vertexShader from '../glsl/vShader.glsl';
import fragmentShader from '../glsl/fShader.glsl';
import hupsylonImg from '../img/hupsylon.png';
import Stats from 'stats.js';
import Interactions from './interaction';

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

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
		this.initPlanes();
		this.bindEvents();
		this.update();
		new Interactions(this.scene, this, this.planes);
	}

	initLights() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		this.scene.add(ambientLight);
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(0, 0, this.perspective);
	}

	initPlanes() {
		this.planes = [];
		this.planeGroup = new THREE.Group();
		this.baseWidth = 60;

		for (let i in Array(10).fill()) {
			let loader = new THREE.TextureLoader();
			let img = loader.load(hupsylonImg);

			let geometry = new THREE.PlaneGeometry( this.baseWidth, 400, 100, 100);
			let material = new THREE.ShaderMaterial({
				uniforms: {
					u_time: { type: 'f', value: 0 },
					u_offsetPos: { type: 'f', value: 0 },
					u_scale: { type: 'vec2', value: new THREE.Vector2(1,1) },
					u_skew: { type: 'vec2', value: new THREE.Vector2(0, 0.4)},
					u_texture1: { type: 't', value: img },
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				defines: {
					// tofixed(1) tronque le nombre avec 1 nombre après la virgule
					PR: window.devicePixelRatio.toFixed(1),
				},
				side: THREE.DoubleSide,
			});
			let plane = new THREE.Mesh(geometry, material);

			let margin = 20;
			let posX = i * (this.baseWidth + margin);
			plane.position.x = posX;

			this.planes.push({obj: plane, isOpen: false, basePos: posX});
			this.planeGroup.add(plane);
		}
		this.scene.add(this.planeGroup);
		//this.centerObject(this.planeGroup);
		this.scrollOffset = 0;
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
		gsap.to(this.mouse, 0.5, {
			x: event.clientX,
			y: event.clientY,
			//x: ( event.clientX / window.innerWidth ) * 2 - 1,
			//y: ( event.clientY / window.innerHeight ) * 2 + 1,
		});
	}


	onWheel(e) {
		gsap.set(this.planeGroup.position, {
			x: '+=' + e.deltaY * 0.08,
		});
		this.scrollOffset += (e.deltaY * 0.0006);
		this.planes.forEach( plane => {
			gsap.to(plane.obj.material.uniforms.u_offsetPos, 0.5, {
				value: this.scrollOffset.toFixed(2),
				ease: 'power2.out',
			})
			//plane.material.uniforms.u_offsetPos.value = this.offset.toFixed(2);
		})
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
		this.planes.forEach((plane, i) => {
			//plane.material.uniforms.u_time.value = i * 0.5;
			plane.obj.material.uniforms.u_time.value = this.clock.getElapsedTime() * 0.2 +  ( i * (Math.PI / 5) ) ;
		});

		stats.begin();

		this.renderer.render(this.scene, this.camera);
		stats.end();
	}
}
