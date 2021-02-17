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
		//change scale in planes.js this.baseHeight
		this.openScale = 3.5;
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

		//shader scale
		gsap.to(plane.mesh.material.uniforms.u_scale.value, duration * 2., {
			x: this.openScale,
			ease: 'power3.out',
			delay: 0.2,
		});

		// scale plane
		plane.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: this.openScale,
			ease: 'power3.out',
			delay: 0.2,
			onStart: () => {
				this.moveOtherPlanes(i, offset);
				this.skewAll(0);
				this.Content.open(i);
			}
		})

		// uncolor
		gsap.to(plane.mesh.material.uniforms.u_tintAmount, duration * 2., {
			value: 0,
			ease: 'power3.out',
			delay: 0.2,
			onStart: () => {
				this.colorOtherPlanes(i, plane.color);
			}
		});

	}

	closePlane( plane ) {

		let duration = 0.7;
		let i = this.planes.indexOf(plane);
		plane.isOpen = false;

		gsap.to(plane.mesh.material.uniforms.u_scale.value, duration * 1.2, {
			x: 1,
			ease: 'power3.out',
			delay: 0.2,
		});

		//color
		gsap.to(plane.mesh.material.uniforms.u_tint, duration * 2, {
			value: plane.color,
			ease: 'power3.out',
			delay: 0.2,
		}); 
		gsap.to(plane.mesh.material.uniforms.u_tintAmount, duration * 2, {
			value: 1,
			ease: 'power3.out',
			delay: 0.2,
			onStart: () => {
				this.colorOtherPlanes(i);
			}
		});

		// scale plane
		plane.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: 1,
			ease: 'power3.out',
			delay: 0.2,
			onStart: () => {
				this.Content.close(),
				this.moveOtherPlanes(i, 0);
				this.skewAll(1);
			},
			onComplete: () => {
			}
		})
	}

	colorOtherPlanes( index, color) {
		this.planes.forEach( ( plane, i ) => {
			if (i !== index) {
				gsap.to(plane.mesh.material.uniforms.u_tint, 1.2, {
					value: color || plane.color,
					ease: 'power3.out',
				});
			}
		});
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
			onStart: () => {
				this.Content.closeOpen(i_ToOpen);
			},
			onComplete: () => this.planesCtx.canWheel = true
		});

		//close plane
		planeToClose.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: 1,
			ease: 'power3.out',
			delay: 0.7,
		});

		gsap.to(planeToClose.mesh.material.uniforms.u_scale.value, duration * 1.2, {
			x: 1,
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
		gsap.to(planeToOpen.mesh.material.uniforms.u_scale.value, duration * 2., {
			x: this.openScale,
			ease: 'power3.out',
			delay: 0.7,
		});

		//tint
		gsap.to(planeToClose.mesh.material.uniforms.u_tintAmount , duration * 1.2, {
			value: 1,
			ease: 'power3.out',
			delay: 0.7,
		});
		gsap.to(planeToOpen.mesh.material.uniforms.u_tintAmount , duration * 1.2, {
			value: 0,
			ease: 'power3.out',
			delay: 0.7,
			onStart: () => this.colorOtherPlanes(i_ToOpen, planeToOpen.color),
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

					plane.wrapper.gsapMatrix( duration * 1.1, {
						index: 12,
						to: plane.basePos - x, 
						ease: 'power3.out',
						delay: 0.7,
					});
				}
			}
			else if ( !newIndexIsGreater ) {
				if ( i_ToOpen < i && i <= i_ToClose) {
					plane.wrapper.gsapMatrix( duration * 1.1, {
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

	swipeToOtherPlane ( planeToOpen, planeToClose ) {

		let x = this.planesCtx.baseWidth * (this.openScale - 1) / 2;
		let duration = 0.7;

		let i_ToOpen = this.planes.indexOf( planeToOpen );
		let i_ToClose = this.planes.indexOf( planeToClose );
		let newIndexIsGreater = i_ToOpen > i_ToClose;

		//20 is margin
		let planeX = i_ToOpen * (this.planesCtx.baseWidth + 20);

		//center new
		gsap.to(this.planesCtx.planeGroup.position, 0.4, {
			x: - planeX,
			ease: 'power2.inOut',
			onStart: () => {
				this.Content.closeOpen(i_ToOpen);
			},
		});

		//close plane
		planeToClose.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: 1,
			ease: 'power3.out',
			delay: 0.3,
			onComplete: () => this.planesCtx.canWheel = true,
		});

		gsap.to(planeToClose.mesh.material.uniforms.u_scale.value, duration * 1.2, {
			x: 1,
			ease: 'power3.out',
			delay: 0.3,
		});

		//open plane
		planeToOpen.wrapper.gsapMatrix(duration * 1.2, {
			index: 0,
			to: this.openScale,
			ease: 'power3.out',
			delay: 0.3,
		});

		gsap.to(planeToOpen.mesh.material.uniforms.u_scale.value, duration * 2., {
			x: this.openScale,
			ease: 'power3.out',
			delay: 0.3,
		});

		//tint
		gsap.to(planeToClose.mesh.material.uniforms.u_tintAmount , duration * 1.2, {
			value: 1,
			ease: 'power3.out',
			delay: 0.3,
		});
		gsap.to(planeToOpen.mesh.material.uniforms.u_tintAmount , duration * 1.2, {
			value: 0,
			ease: 'power3.out',
			delay: 0.3,
			onStart: () => this.colorOtherPlanes(i_ToOpen, planeToOpen.color),
		});


    //move planes
		planeToOpen.wrapper.gsapMatrix(duration, {
			index: 12,
			to: planeToOpen.basePos, 
			ease: 'power3.out',
			delay: 0.3,
		});

		this.planes.forEach( ( plane, i ) => {

			if ( newIndexIsGreater ) {
				if ( i_ToClose <= i && i < i_ToOpen) {

					plane.wrapper.gsapMatrix( duration * 1.1, {
						index: 12,
						to: plane.basePos - x, 
						ease: 'power3.out',
						delay: 0.3,
					});
				}
			}
			else if ( !newIndexIsGreater ) {
				if ( i_ToOpen < i && i <= i_ToClose) {
					plane.wrapper.gsapMatrix( duration * 1.1, {
						index: 12,
						to: plane.basePos + x, 
						ease: 'power3.out',
						delay: 0.3,
					});	
				}
			}

		});

		planeToClose.isOpen = false;
		planeToOpen.isOpen = true;
	}

	skewAll( amount, time ) {
		time = time || 0.8;
		this.planes.forEach( plane => {
			plane.wrapper.gsapMatrix(time, {
				index: 4,
				to: Math.tan( amount * 0.4 ),
				ease: 'power2.out',
			});
			gsap.to(plane.mesh.material.uniforms.u_skew, time, {
				value: amount,
				ease: 'power2.out',
			})
		});
	}
}