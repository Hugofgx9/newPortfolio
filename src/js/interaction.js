import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';

export default class Interact {
	constructor(scene, sceneCtx, planes) {

		this.scene = scene;
		this.sceneCtx = sceneCtx;
		this.planes = planes;
		new Interaction(this.sceneCtx.renderer, this.scene, this.sceneCtx.camera);
		this.openScale = 2;

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

		//another plane is open
		} else if (!plane.isOpen && !allPlanesAreClosed) {
			let openedPlane = this.planes.find( plane => plane.isOpen == true)
			//this.closePlane( openedPlane );
			//this.openPlane( plane);
			this.openOtherPlane( plane, openedPlane);

		} else if (plane.isOpen) {
			this.closePlane( plane );
		}
	}

	openPlane( plane ) {

		let duration = 0.7;
		let i = this.planes.indexOf(plane);
		plane.isOpen = true;

		//20 is margin
		let planeX = i * (this.sceneCtx.baseWidth + 20);

		//center
		gsap.to(this.sceneCtx.planeGroup.position, 1, {
			x: -planeX,
			ease: 'power2.inOut',
		});

		// scale
		gsap.to(plane.obj.material.uniforms.u_scale.value, duration * 1.2, {
			x: this.openScale,
			ease: 'power3.out',
		})

		let offset = this.sceneCtx.baseWidth / 2;
		this.moveOtherPlanes(i, offset);

	}

	closePlane( plane ) {

		let duration = 0.7;
		let i = this.planes.indexOf(plane);
		plane.isOpen = false;

		gsap.to(plane.obj.material.uniforms.u_scale.value, duration * 1.2, {
			x: 1,
			ease: 'power3.out',
		})
		this.moveOtherPlanes(i, 0);
	}

	moveOtherPlanes( index, x) {
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

	openOtherPlane ( planeToOpen, planeToClose ) {

		let x = this.sceneCtx.baseWidth / 2;
		let duration = 0.7;

		let i_ToOpen = this.planes.indexOf( planeToOpen );
		let i_ToClose = this.planes.indexOf( planeToClose );
		let newIndexIsGreater = i_ToOpen > i_ToClose;

		//20 is margin
		let planeX = i_ToOpen * (this.sceneCtx.baseWidth + 20);

		//center new
		gsap.to(this.sceneCtx.planeGroup.position, 1, {
			x: - planeX,
			ease: 'power2.inOut',
		});

		//close plane
		gsap.to(planeToClose.obj.material.uniforms.u_scale.value, duration * 1.2, {
			x: 1,
			ease: 'power3.out',
		})

		//open plane
		gsap.to(planeToOpen.obj.material.uniforms.u_scale.value, duration * 1.2, {
			x: this.openScale,
			ease: 'power3.out',
		})

    //move planes
		gsap.to(planeToOpen.obj.position, duration, {
			x: planeToOpen.basePos, 
			ease: 'power3.out',
		});

		this.planes.forEach( ( plane, i ) => {

			if ( newIndexIsGreater ) {
				if ( i_ToClose <= i && i < i_ToOpen) {

					gsap.to(plane.obj.position, duration, {
						x: plane.basePos - x, 
						ease: 'power3.out',
					});
				}
			}
			else if ( !newIndexIsGreater ) {
				if ( i_ToOpen < i && i <= i_ToClose) {
					gsap.to(plane.obj.position, duration, {
						x: plane.basePos + x, 
						ease: 'power3.out',
					});	
				}
			}

		});

		planeToClose.isOpen = false;
		planeToOpen.isOpen = true;
	}
}