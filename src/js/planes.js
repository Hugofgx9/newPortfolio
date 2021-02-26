import * as THREE from 'three';
import gsap from 'gsap';
import Interactions from './interaction';
import Content from './content';
import vertexShader from '../glsl/vShader2.glsl';
import fragmentShader from '../glsl/fShader.glsl';
import data from '../store/data';

export default class Planes {
  constructor(scene, sceneCtx) {
    this.scene = scene;
    this.sceneCtx = sceneCtx;

    this.baseWidth = window.innerWidth / 7;
    this.baseHeight = ((this.baseWidth * 10) / 16) * 3.5;
    this.margin = 20;
    this.clock = this.sceneCtx.clock;
    this.canWheel = true;
    this.openScale = 3.5;
    this.wavyAmount = { value: 0 };
    this.scrollOffset = 0;

    this.initMethods();
    this.createPlanes();

    this.interactions = new Interactions(
      this.scene,
      this.sceneCtx,
      this.planes,
      this
    );
    this.Content = new Content();
  }

  initMethods() {
    // make simple
    //  to gsap matrix;
    THREE.Mesh.prototype.gsapMatrix = function (time, opts = {}) {
      let matrixElement = this.matrix.elements[opts.index];
      let targetValue = opts.to;
      let initValue = { value: matrixElement };
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
    };

    THREE.Group.prototype.gsapMatrix = function (time, opts = {}) {
      let matrixElement = this.matrix.elements[opts.index];
      let targetValue = opts.to;
      let initValue = { value: matrixElement };
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
    };
  }

  createPlanes() {
    this.planes = [];
    this.planeGroup = new THREE.Group();
    this.planeGroup.name = 'mesh-group';

    let loadManager = new THREE.LoadingManager();

    loadManager.onLoad = () => {
      this.sceneCtx.Loader.emit('loaded');
      this.scene.add(this.planeGroup);
    }

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
      this.sceneCtx.Loader.emit('progress', itemsLoaded / itemsTotal);
    }

    for (let i in data.projects) {
      let planeWrapper = new THREE.Group();

      // const loaderIMG = new THREE.ImageLoader();
      // let img = loaderIMG.load();

      let loader = new THREE.TextureLoader(loadManager);
      let text = loader.load(data.projects[i].img);

      let geometry = new THREE.PlaneGeometry(
        this.baseWidth,
        this.baseHeight,
        100,
        100
      );

      let material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { type: 'f', value: 0 },
          u_offsetPos: { type: 'f', value: 0 },
          u_scale: { type: 'vec2', value: new THREE.Vector2(1, 1) },
          u_skew: { type: 'f', value: 1 },
          u_planeRatio: { type: 'f', value: this.baseWidth / this.baseHeight },
          u_tint: { type: 'f', value: data.projects[i].color },
          u_tint2: { type: 'f', value: data.projects[i].color },
          u_tintTransfert: { type: 'f', value: 0 },
          u_tintAmount: { type: 'f', value: 0 },
          u_greyAmount: { type: 'f', value: 1 },
          u_texture1: { type: 't', value: text },
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
      planeWrapper.add(plane);
      this.planeGroup.add(planeWrapper);

      //enable matrix transfo
      plane.matrixAutoUpdate = false;
      planeWrapper.matrixAutoUpdate = false;

      plane.name = `mesh-${i}`;
      planeWrapper.name = `mesh-wrapper-${i}`;

      let posX = i * (this.baseWidth + this.margin);

      this.planes.push({
        mesh: plane,
        wrapper: planeWrapper,
        isOpen: false,
        basePos: posX,
        offset: 0,
        color: data.projects[i].color,
        link: data.projects[i].link,
      });

      //scaleX
      planeWrapper.gsapMatrix(0, {
        index: 0,
        to: 0.01,
      });
    }
    //this.centerObject(this.planeGroup);
  }

  onWheel(e) {
    if (this.canWheel == true) {
      let allPlanesAreClosed = this.planes.every(
        plane => plane.isOpen == false
      );

      //get the bigger absolute value bitween deltaY and deltaX;
      let delta = Math.abs( e.deltaY ) > Math.abs( e.deltaX ) ? e.deltaY : e.deltaX;

      if (allPlanesAreClosed) {
        //change getgroup width to calcul it with plane width and margins
        let planeGroupBox = new THREE.Box3().setFromObject(this.planeGroup);
        let planeGroupWidth = planeGroupBox.max.x - planeGroupBox.min.x;

        //limit
        let min = 0;
        let max = planeGroupWidth - this.baseHeight * Math.tan(0.4);


        //if (this.planeGroup.position.x)
        let xTarget = Math.min(
          min,
          Math.max(this.planeGroup.position.x + delta * 0.33, -max)
        );

        gsap.to(this.planeGroup.position, 0.5, {
          x: xTarget,
          ease: 'power2.out',
        });

        //this.scrollOffset = xTarget * 0.008;
        this.scrollOffset += delta * 0.0006;
        this.planes.forEach(plane => {
          gsap.to(plane.mesh.material.uniforms.u_offsetPos, 0.5, {
            value: this.scrollOffset.toFixed(2),
            ease: 'power2.out',
          });
          gsap.to(plane, 0.5, {
            offset: this.scrollOffset.toFixed(2),
            ease: 'power2.out',
          });
          //plane.material.uniforms.u_offsetPos.value = this.offset.toFixed(2);
        });
      } else {
        let openIndex = this.planes.findIndex(plane => plane.isOpen == true);

        if (delta > 0 && openIndex > 0) {
          this.canWheel = false;
          this.swipeToOtherPlane(
            this.planes[openIndex - 1],
            this.planes[openIndex],
            0.7
          );
        } else if (delta < 0 && openIndex < this.planes.length - 1) {
          this.canWheel = false;
          this.swipeToOtherPlane(
            this.planes[openIndex + 1],
            this.planes[openIndex],
            0.7
          );
        }
      }
    }
  }

  update() {
    this.planes.forEach((plane, i) => {
      //plane.material.uniforms.u_time.value = i * 0.5;
      let time = this.clock.getElapsedTime() * 0.2 + i * (Math.PI / 5);
      let wavyValue = this.wavy(
        time,
        1.5,
        30 * this.wavyAmount.value,
        plane.offset
      );
      //translateY
      plane.mesh.matrix.elements[13] = wavyValue;
      //translateX trigo
      //plane.mesh.matrix.elements[12] = wavyValue * Math.tan(0.4);
      plane.mesh.material.uniforms.u_time.value = time;
    });
  }

  wavy(time, speed, amp, offset) {
    return Math.cos((time + offset) * speed) * amp;
  }

  /**
   *
   *  ACTIONS
   *
   */

  introAnim() {
    let tl = gsap.timeline();

    this.planes.forEach(plane => {

      // first scale
      tl.add(() => {
        plane.wrapper.gsapMatrix(1, {
          index: 0,
          to: 0.1,
          ease: 'power3.inOut',
        });
      }, 1);

			tl.to(plane.mesh.material.uniforms.u_scale.value , {
				x: 0.1,
				ease: 'power3.inOut',
				duration: 0.8
			},'<');
			
			
      //skewX
      tl.add(() => {
				plane.wrapper.gsapMatrix(0.5, {
					index: 4,
          to: Math.tan(0.4),
          ease: 'power2.inOut',
        });
      }, '<.4');
			
      //translateX
      tl.add(() => {
				plane.wrapper.gsapMatrix(2, {
					index: 12,
          to: plane.basePos,
          ease: 'power3.inOut',
        });
      }, '<.5');
			
      //scale up
      tl.add(() => {
				plane.wrapper.gsapMatrix(1, {
					index: 0,
          to: 1,
          ease: 'power3.inOut',
        });
      }, '<');
			tl.to(plane.mesh.material.uniforms.u_scale.value , {
				x: 1,
				ease: 'power3.inOut',
				duration: 1
			},'<');
			
      tl.to(
				plane.mesh.material.uniforms.u_greyAmount,
        {
					duration: 1.5,
          value: 0,
          ease: 'power2.inOut',
        },
        '<0.5'
				);
				
      tl.to(
        plane.mesh.material.uniforms.u_tintAmount,
        {
          duration: 1.5,
          value: 1,
          ease: 'power2.inOut',
        },
        '<'
      );

      tl.to(
        plane.mesh.material.uniforms.u_tintAmount,
        {
          duration: 1.5,
          value: 1,
          ease: 'power2.inOut',
        },
        '<'
      );
    });
    tl.to(
      this.wavyAmount,
      {
        value: 1,
        duration: 7,
        ease: 'power2.inOut',
      },
      '>-1'
    );
  }

  openPlane(plane) {
    let duration = 0.7;
    let i = this.planes.indexOf(plane);
    plane.isOpen = true;

    //20 is margin
    let planeX = i * (this.baseWidth + 20);
    let offset = (this.baseWidth * (this.openScale - 1)) / 2;

    let tl = gsap.timeline();

    //center Group
    tl.to(this.planeGroup.position, 1, {
      x: -planeX,
      ease: 'power2.inOut',
    });

    //shader scale
    tl.to( plane.mesh.material.uniforms.u_scale.value, duration * 2, {
      x: this.openScale,
      ease: 'power3.out',
    }, 0.2);

    // scale plane
    tl.add(
      () =>
        plane.wrapper.gsapMatrix(duration * 1.2, {
          index: 0,
          to: this.openScale,
          ease: 'power3.out',

          onStart: () => {
            this.moveOtherPlanes(i, offset);
            this.skewAll(0);
            this.Content.open(i);
          },
        }),
      0.2
    );

    // uncolor
    tl.to(
      plane.mesh.material.uniforms.u_tintAmount,
      duration * 2,
      {
        value: 0,
        ease: 'power3.out',
        onStart: () => {
          this.colorOtherPlanes(i, plane.color, duration * 3);
        },
      },
      0.2
    );
  }

  closePlane(plane) {
    let duration = 0.7;
    let i = this.planes.indexOf(plane);
    plane.isOpen = false;

    let tl = gsap.timeline();

    tl.to(
      plane.mesh.material.uniforms.u_scale.value,
      duration * 1.2,
      {
        x: 1,
        ease: 'power3.out',
      },
      0.2
    );

    //color
    tl.to(
      plane.mesh.material.uniforms.u_tintAmount,
      duration * 2,
      {
        value: 1,
        ease: 'power3.out',
        onStart: () => {
          this.colorOtherPlanes(i);
          this.changePlaneColor(plane, plane.color, duration * 2);
        },
      },
      '<'
    );

    // scale plane
    tl.add(
      () =>
        plane.wrapper.gsapMatrix(duration * 1.2, {
          index: 0,
          to: 1,
          ease: 'power3.out',
          onStart: () => {
            this.Content.close(), this.moveOtherPlanes(i, 0);
            this.skewAll(1);
          },
          onComplete: () => {},
        }),
      '<'
    );
  }

  colorOtherPlanes(index, color, duration) {
    this.planes.forEach((plane, i) => {
      if (i !== index) {
        this.changePlaneColor(
          plane,
          color || plane.color,
          undefined || duration
        );
      }
    });
  }

  moveOtherPlanes(index, x) {
    this.planes.forEach((plane, i) => {
      if (i > index) {
        plane.wrapper.gsapMatrix(0.7, {
          index: 12,
          to: plane.basePos + x,
          ease: 'power3.out',
        });
      } else if (i < index) {
        plane.wrapper.gsapMatrix(0.7, {
          index: 12,
          to: plane.basePos - x,
          ease: 'power3.out',
        });
      }
    });
  }

  openOtherPlanes(planeToOpen, planeToClose) {
    let x = (this.baseWidth * (this.openScale - 1)) / 2;
    let duration = 0.7;

    let i_ToOpen = this.planes.indexOf(planeToOpen);
    let i_ToClose = this.planes.indexOf(planeToClose);
    let newIndexIsGreater = i_ToOpen > i_ToClose;

    let tl = gsap.timeline();

    //20 is margin
    let planeX = i_ToOpen * (this.baseWidth + 20);

    //center new
    tl.to(this.planeGroup.position, 1.5, {
      x: -planeX,
      ease: 'power2.inOut',
      onStart: () => {
        this.Content.closeOpen(i_ToOpen);
      },
      onComplete: () => (this.canWheel = true),
    });

    //close plane
    tl.add(
      () =>
        planeToClose.wrapper.gsapMatrix(duration * 1.2, {
          index: 0,
          to: 1,
          ease: 'power3.out',
        }),
      0.7
    );

    tl.to(
      planeToClose.mesh.material.uniforms.u_scale.value,
      duration * 1.2,
      {
        x: 1,
        ease: 'power3.out',
      },
      '<'
    );

    //open plane
    tl.add(
      () =>
        planeToOpen.wrapper.gsapMatrix(duration * 1.2, {
          index: 0,
          to: this.openScale,
          ease: 'power3.out',
        }),
      '<'
    );

    tl.to(
      planeToOpen.mesh.material.uniforms.u_scale.value,
      duration * 2,
      {
        x: this.openScale,
        ease: 'power3.out',
      },
      '<'
    );

    //tint
    tl.to(
      planeToClose.mesh.material.uniforms.u_tintAmount,
      duration * 1.2,
      {
        value: 1,
        ease: 'power3.out',
      },
      '<'
    );
    tl.to(
      planeToOpen.mesh.material.uniforms.u_tintAmount,
      duration * 1.2,
      {
        value: 0,
        ease: 'power3.out',
        onStart: () => this.colorOtherPlanes(i_ToOpen, planeToOpen.color),
      },
      '<'
    );

    //move planes
    tl.add(
      () =>
        planeToOpen.wrapper.gsapMatrix(duration, {
          index: 12,
          to: planeToOpen.basePos,
          ease: 'power3.out',
        }),
      '<'
    );

    this.planes.forEach((plane, i) => {
      if (newIndexIsGreater) {
        if (i_ToClose <= i && i < i_ToOpen) {
          tl.add(
            () =>
              plane.wrapper.gsapMatrix(duration * 1.1, {
                index: 12,
                to: plane.basePos - x,
                ease: 'power3.out',
              }),
            '<'
          );
        }
      } else if (!newIndexIsGreater) {
        if (i_ToOpen < i && i <= i_ToClose) {
          tl.add(
            () =>
              plane.wrapper.gsapMatrix(duration * 1.1, {
                index: 12,
                to: plane.basePos + x,
                ease: 'power3.out',
              }),
            '<'
          );
        }
      }
    });

    planeToClose.isOpen = false;
    planeToOpen.isOpen = true;
  }

  swipeToOtherPlane(planeToOpen, planeToClose) {
    let x = (this.baseWidth * (this.openScale - 1)) / 2;
    let duration = 0.7;

    let i_ToOpen = this.planes.indexOf(planeToOpen);
    let i_ToClose = this.planes.indexOf(planeToClose);
    let newIndexIsGreater = i_ToOpen > i_ToClose;

    //20 is margin
    let planeX = i_ToOpen * (this.baseWidth + 20);

    let tl = gsap.timeline();

    //center new
    tl.to(this.planeGroup.position, 0.8, {
      x: -planeX,
      ease: 'power2.inOut',
      onStart: () => {
        this.Content.closeOpen(i_ToOpen);
      },
      //onComplete: () => this.planesCtx.canWheel = true
    });

    tl.add(() => {
      this.canWheel = true;
    }, 1.2);

    //close plane
    tl.add(
      () =>
        planeToClose.wrapper.gsapMatrix(duration * 1.2, {
          index: 0,
          to: 1,
          ease: 'power3.out',
        }),
      0.2
    );

    tl.to(
      planeToClose.mesh.material.uniforms.u_scale.value,
      duration * 1.2,
      {
        x: 1,
        ease: 'power3.out',
      },
      '<'
    );

    //open plane
    tl.add(
      () =>
        planeToOpen.wrapper.gsapMatrix(duration * 1.2, {
          index: 0,
          to: this.openScale,
          ease: 'power3.out',
        }),
      '<'
    );

    tl.to(
      planeToOpen.mesh.material.uniforms.u_scale.value,
      duration * 2,
      {
        x: this.openScale,
        ease: 'power3.out',
      },
      '<'
    );

    //tint
    tl.to(
      planeToClose.mesh.material.uniforms.u_tintAmount,
      duration * 1.2,
      {
        value: 1,
        ease: 'power3.out',
      },
      '<'
    );
    tl.to(
      planeToOpen.mesh.material.uniforms.u_tintAmount,
      duration * 1.2,
      {
        value: 0,
        ease: 'power3.out',
        onStart: () => this.colorOtherPlanes(i_ToOpen, planeToOpen.color),
      },
      '<'
    );

    //move planes
    tl.add(
      () =>
        planeToOpen.wrapper.gsapMatrix(duration, {
          index: 12,
          to: planeToOpen.basePos,
          ease: 'power3.out',
        }),
      '<'
    );

    this.planes.forEach((plane, i) => {
      if (newIndexIsGreater) {
        if (i_ToClose <= i && i < i_ToOpen) {
          tl.add(
            () =>
              plane.wrapper.gsapMatrix(duration * 1.1, {
                index: 12,
                to: plane.basePos - x,
                ease: 'power3.out',
              }),
            '<'
          );
        }
      } else if (!newIndexIsGreater) {
        if (i_ToOpen < i && i <= i_ToClose) {
          tl.add(
            () =>
              plane.wrapper.gsapMatrix(duration * 1.1, {
                index: 12,
                to: plane.basePos + x,
                ease: 'power3.out',
              }),
            '<'
          );
        }
      }
    });

    planeToClose.isOpen = false;
    planeToOpen.isOpen = true;
  }

  skewAll(amount, time) {
    time = time || 0.8;
    this.planes.forEach(plane => {
      plane.wrapper.gsapMatrix(time, {
        index: 4,
        to: Math.tan(amount * 0.4),
        ease: 'power2.out',
      });
      gsap.to(plane.mesh.material.uniforms.u_skew, time, {
        value: amount,
        ease: 'power2.out',
      });
    });
  }

  changePlaneColor(plane, color, duration) {
    let uniforms = plane.mesh.material.uniforms;

    //if previous timeline hasn't ending
    if (plane.colorTimeline && plane.colorTimeline.isActive()) {
      plane.colorTimeline.kill();

      uniforms.u_tint.value = uniforms.u_tint2.value;
      uniforms.u_tintTransfert.value = 0;
    }

    let tl = gsap.timeline();
    plane.colorTimeline = tl;

    tl.set(uniforms.u_tint2, {
      value: color,
    });
    tl.to(uniforms.u_tintTransfert, duration || 1, {
      ease: 'power3.out',
      value: 1,
    });
    tl.set(uniforms.u_tint, {
      value: color,
    });
    tl.set(uniforms.u_tintTransfert, {
      value: 0,
    });
  }
}
