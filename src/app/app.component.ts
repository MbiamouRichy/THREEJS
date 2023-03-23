import { Component } from '@angular/core';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'THREEJS';

  ngOnInit(){
    let container: any;

    let camera: any;
    let scene: any;
    let renderer: any;

    let mouseX = 0, mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    let object: any;
    let mixer: any
    init();
    animate();


    function init() {

      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.z = 140;

      // remove backgroung scene
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor(0x000000, 0);
      scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff);
      scene.add(pointLight);

      // manager

      function loadModel() {

        object.traverse(function (child: any) {

          if (child.isMesh) child.material.map = texture;

        });

        object.position.y = 0;
        object.position.x = 0;

        scene.add(object);

      }

      const manager = new THREE.LoadingManager(loadModel);

      // texture

      const textureLoader = new THREE.TextureLoader(manager);

      const texture = textureLoader.load('../assets/jagernaut-beyond-human/textures/Material.001_albedo.jpg');
      // model

      function onProgress(xhr: any) {

        if (xhr.lengthComputable) {

          const percentComplete = xhr.loaded / xhr.total * 100;
          console.log('model ' + Math.round(percentComplete) + '% downloaded');
        }

      }

      function onError() { }

      const loader = new FBXLoader(manager);
      loader.load('../assets/jagernaut-beyond-human/source/Pose_scene.fbx', function (obj:any) {
        object = obj;

        window.document.addEventListener('scroll', ()=>{
          object.rotation.y +=  5;
          object.position.y = -window.scrollY;
        })
      }, onProgress, onError)

      //renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(renderer.domElement);

      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('resize', onWindowResize);

    }

    function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onDocumentMouseMove(event: any) {

      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);

    }

    function animate() {
      requestAnimationFrame(animate);
      render();

    }
    function render() {
      if(object){
        object.rotationy +=45
      }
      renderer.render( scene, camera );
    }

  }

}
