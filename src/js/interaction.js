import * as THREE from 'three';
import Content from './content';

export default class Interact {
  constructor(scene, sceneCtx, planes, planesCtx) {
    this.scene = scene;
    this.sceneCtx = sceneCtx;
    this.planes = planes;
    this.planesCtx = planesCtx;
    
    this.Content = new Content();
    this.raycaster = new THREE.Raycaster();
    this.bindEvents();
  }

  onClick() {
    this.raycaster.setFromCamera(this.sceneCtx.mouse, this.sceneCtx.camera);
    
    const intersects = this.raycaster.intersectObjects(
      this.planes.map( plane => plane.mesh),
    );
    // click on plane
    if (intersects.length > 0) {

      let planeTarget = this.planes.find(plane => plane.mesh == intersects[0].object );
      this.planeOnClick(planeTarget);

    }
    // click outside of planes
    else {

      let allPlanesAreClosed = this.planes.every(
        plane => plane.isOpen == false
      );
      if ( !allPlanesAreClosed ) {

        let openPlane = this.planes.find( plane => plane.isOpen == true);
        this.planesCtx.closePlane( openPlane );
      }
    }
  }

  bindEvents() {
    // this.planes.forEach(plane => {
    //   //diff duration btw mesh & u_scale can be interesting
    //   plane.mesh.on('click', () => this.planeOnClick(plane));
    // });
    document.addEventListener('click', () => this.onClick());
    document.addEventListener('touchend', () => this.onClick() )
  }

  planeOnClick(plane) {
    let allPlanesAreClosed = this.planes.every(plane => plane.isOpen == false);

    if (!plane.isOpen && allPlanesAreClosed) {
      this.planesCtx.openPlane(plane);

    }
    //another plane is open
    else if (!plane.isOpen && !allPlanesAreClosed) {

      let openedPlane = this.planes.find(plane => plane.isOpen == true);
      //this.closePlane( openedPlane );
      //this.openPlane( plane);
      this.planesCtx.openOtherPlanes(plane, openedPlane);

    } 
    else if (plane.isOpen) {
      window.open(plane.link);
    }
  }
}