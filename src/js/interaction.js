import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';

export default class Interact {
	constructor(scene, sceneCtx, planes) {

		this.scene = scene;
		this.sceneCtx = sceneCtx;
		this.planes = planes;
		new Interaction(this.sceneCtx.renderer, this.scene, this.sceneCtx.camera);

		this.bindEvents();

	}

	bindEvents() {
		this.planes.forEach( plane  => {
			//diff duration btw obj & u_scale can be interesting

			plane.obj.on('click', () => {

				this.planeOnClick( plane );

			});
		});
	}

	planeOnClick( plane ) {

		let allPlanesAreClosed = this.planes.every(plane => plane.isOpen == false);

		if (!plane.isOpen && allPlanesAreClosed) {
			this.openPlane( plane );

		} else if (!plane.isOpen && !allPlanesAreClosed) {
			let openedPlane = this.planes.find( plane => plane.isOpen == true)
			this.closePlane( openedPlane );
			this.openPlane( plane);

		} else if (plane.isOpen) {
			this.closePlane( plane );
		}
	}

	openPlane( plane ) {

		let dur = 0.7;
		let i = this.planes.indexOf(plane);
		plane.isOpen = true;

		gsap.to(plane.obj.scale, dur, {
			x: 2,
			ease: 'power3.out',
		});
		gsap.to(plane.obj.material.uniforms.u_scale.value, dur * 1.5, {
			x: 2,
			ease: 'power3.out',
		})
		this.movePlanes(i, 20);

	}

	closePlane( plane ) {

		let dur = 0.7;
		let i = this.planes.indexOf(plane);
		plane.isOpen = false;

		gsap.to(plane.obj.scale, dur, {
			x: 1,
			ease: 'power3.out',
		});
		gsap.to(plane.obj.material.uniforms.u_scale.value, dur * 1.5, {
			x: 1,
			ease: 'power3.out',
		})
		this.movePlanes(i, 0);
	}

	movePlanes( index, x) {
		this.planes.forEach( ( plane, i ) => {

			if ( i > index ) {
				gsap.to(plane.obj.position, 0.7, {
					x: plane.basePos + x, 
					ease: 'power3.out',
				});
			} else if (i < index ) {
				gsap.to(plane.obj.position, 0.7, {
					x: plane.basePos - x, 
					ease: 'power3.out',
				});
			}
		});
	}

}