import * as THREE from 'three';
import gsap from 'gsap';
import Interactions from './interaction2';
import vertexShader from '../glsl/vShader2.glsl';
import fragmentShader from '../glsl/fShader.glsl';
import hupsylonImg from 'url:../img/hupsylon.png';

export default class Planes {
	constructor(scene, sceneCtx) {
		this.scene = scene;
		this.sceneCtx = sceneCtx;

		this.baseWidth = 160;
		this.margin = 20;
		this.clock = this.sceneCtx.clock;

		this.initMethods();
		this.createPlanes();

		new Interactions(this.scene, this.sceneCtx, this.planes, this);

	}

	initMethods(){
		// make simple
		//  to gsap matrix;
		THREE.Mesh.prototype.gsapMatrix = function (time, opts = {}) {
			let matrixElement = this.matrix.elements[opts.index];
			let targetValue = opts.to;
			let initValue = {value: matrixElement};
			let delay = opts.delay || '';
			let ease = opts.ease || '';
			let onStart = opts.onStart || '';
			let onComplete = opts.onComplete || '';

			gsap.to(initValue, time, {
				value: targetValue,
				delay,
				ease,
				onStart,
				onComplete,
				onUpdate: () => {
					this.matrix.elements[opts.index] = initValue.value;
				},
			});
		}

		THREE.Group.prototype.gsapMatrix = function (time, opts = {}) {
			let matrixElement = this.matrix.elements[opts.index];
			let targetValue = opts.to;
			let initValue = {value: matrixElement};
			let delay = opts.delay || '';
			let ease = opts.ease || '';
			let onStart = opts.onStart || '';
			let onComplete = opts.onComplete || '';

			gsap.to(initValue, time, {
				value: targetValue,
				delay,
				ease,
				onStart,
				onComplete,
				onUpdate: () => {
					this.matrix.elements[opts.index] = initValue.value;
				},
			});
		}

	}

	createPlanes() {
		this.planes = [];
		this.planeGroup = new THREE.Group();

		for (let i in Array(5).fill()) {
			let planeWrapper = new THREE.Group;
			let loader = new THREE.TextureLoader();
			let img = loader.load(hupsylonImg);

			let geometry = new THREE.PlaneGeometry( this.baseWidth, 400, 100, 100);
			let material = new THREE.ShaderMaterial({
				uniforms: {
					u_time: { type: 'f', value: 0 },
					u_offsetPos: { type: 'f', value: 0 },
					u_scale: { type: 'vec2', value: new THREE.Vector2(1,1) },
					u_skew: { type: 'vec2', value: new THREE.Vector2(0,0) },
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

			let posX = i * (this.baseWidth + this.margin);
			
			planeWrapper.add(plane);
			this.planes.push({
				mesh: plane, 
				wrapper: planeWrapper, 
				isOpen: false, 
				basePos: posX,
				offset: 0,
			});
			this.planeGroup.add(planeWrapper);

			plane.matrixAutoUpdate = false;
			planeWrapper.matrixAutoUpdate = false;

			//skewX
			planeWrapper.gsapMatrix(2, {
				index: 4,
				to: Math.tan(0.4)
			});
			//translateX
			planeWrapper.gsapMatrix(0, {
				index: 12,
				to: posX,
			});

		}
		this.scene.add(this.planeGroup);
		//this.centerObject(this.planeGroup);
		this.scrollOffset = 0;
	}

	onWheel(e) {
		gsap.to(this.planeGroup.position, 0.5, {
			x: '+=' + e.deltaY * 0.33,
			ease: 'power2.out',
		});
		this.scrollOffset += (e.deltaY * 0.0006);
		this.planes.forEach( plane => {
			gsap.to(plane.mesh.material.uniforms.u_offsetPos, 0.5, {
				value: this.scrollOffset.toFixed(2),
				ease: 'power2.out',
			})
			gsap.to(plane, 0.5, {
				offset: this.scrollOffset.toFixed(2),
				ease: 'power2.out',
			})
			//plane.material.uniforms.u_offsetPos.value = this.offset.toFixed(2);
		})
	}

	update() {
		this.planes.forEach((plane, i) => {
			//plane.material.uniforms.u_time.value = i * 0.5;
			let time = this.clock.getElapsedTime() * 0.2 +  ( i * (Math.PI / 5) );
			let wavyValue = this.wavy(time, 1.5, 30., plane.offset);
			//translateY
			plane.mesh.matrix.elements[13] = wavyValue;
			//translateX trigo
			//plane.mesh.matrix.elements[12] = wavyValue * Math.tan(0.4);
			plane.mesh.material.uniforms.u_time.value = time;
		});
	}

	wavy(time ,speed, amp, offset) {
		return Math.cos((time + offset) * speed) * amp;
	}

}