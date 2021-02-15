import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';
import Content from './content';

export default class Interact {
	constructor(scene, sceneCtx, planes, planesCtx) {

		this.scene = scene;
		this.sceneCtx = sceneCtx;
		this.planes = planes;
		this.planesCtx = planesCtx
		new Interaction(this.sceneCtx.renderer, this.scene, this.sceneCtx.camera);
		this.openScale = 2.2;
		this.Content = new Content;

		this.bindEvents();

	}

	bindEvents() {
		this.planes.forEach( plane  => {
			//diff duration btw mesh & u_scale can be interesting
			plane.mesh.on('click', () => this.planeOnClick( plane ) );
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
		let planeX = i * (this.planesCtx.baseWidth + 20);
		let offset = this.planesCtx.baseWidth * (this.openScale - 1) / 2;

		//center Group
		gsap.to(this.planesCtx.planeGroup.position, 1, {
			x: - planeX,
			ease: 'power2.inOut',
		});

		// scale plane
		plane.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: this.openScale,
			ease: 'power3.out',
			//delay: 0.2,
			onStart: () => {
				this.moveOtherPlanes(i, offset),
				this.Content.open();
			}
		})

	}

	closePlane( plane ) {

		let duration = 0.7;
		let i = this.planes.indexOf(plane);
		plane.isOpen = false;


		plane.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: 1,
			ease: 'power3.out',
			onStart: () => this.Content.close(),
		})

		this.moveOtherPlanes(i, 0);
	}

	moveOtherPlanes( index, x) {
		this.planes.forEach( ( plane, i ) => {

			if ( i > index ) {
				plane.wrapper.gsapMatrix( 0.7, {
					index: 12,
					to: plane.basePos + x, 
					ease: 'power3.out',
				});
			} else if (i < index ) {
				plane.wrapper.gsapMatrix( 0.7, {
					index: 12,
					to: plane.basePos - x, 
					ease: 'power3.out',
				});
			}
		});
	}

	openOtherPlane ( planeToOpen, planeToClose ) {

		let x = this.planesCtx.baseWidth * (this.openScale - 1) / 2;
		let duration = 0.7;

		let i_ToOpen = this.planes.indexOf( planeToOpen );
		let i_ToClose = this.planes.indexOf( planeToClose );
		let newIndexIsGreater = i_ToOpen > i_ToClose;

		//20 is margin
		let planeX = i_ToOpen * (this.planesCtx.baseWidth + 20);

		//center new
		gsap.to(this.planesCtx.planeGroup.position, 1.5, {
			x: - planeX,
			ease: 'power2.inOut',
			onStart: () => this.Content.closeOpen(),
		});

		//close plane
		planeToClose.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: 1,
			ease: 'power3.out',
			delay: 0.7,
		});

		//open plane
		planeToOpen.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: this.openScale,
			ease: 'power3.out',
			delay: 0.7,
		});

    //move planes
		planeToOpen.wrapper.gsapMatrix(duration, {
			index: 12,
			to: planeToOpen.basePos, 
			ease: 'power3.out',
			delay: 0.7,
		});

		this.planes.forEach( ( plane, i ) => {

			if ( newIndexIsGreater ) {
				if ( i_ToClose <= i && i < i_ToOpen) {

					plane.wrapper.gsapMatrix( duration * 1.2, {
						index: 12,
						to: plane.basePos - x, 
						ease: 'power3.out',
						delay: 0.7,
					});
				}
			}
			else if ( !newIndexIsGreater ) {
				if ( i_ToOpen < i && i <= i_ToClose) {
					plane.wrapper.gsapMatrix( duration * 1.2, {
						index: 12,
						to: plane.basePos + x, 
						ease: 'power3.out',
						delay: 0.7,
					});	
				}
			}

		});

		planeToClose.isOpen = false;
		planeToOpen.isOpen = true;
	}
}