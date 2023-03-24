import { Component } from '@angular/core';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// @ts-ignore
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'THREEJS';

  ngOnInit() {

    /*====================== LOADER ======================*/
    // Afficher le loader
    let loader =  document.querySelector('.loader')as HTMLDivElement;
   loader.classList.add('show');

    // Charger les données
    fetch('../angular.json').then(function (response) {
      // Masquer le loader
      setTimeout(function() {
      loader.classList.remove('show');
      }, 2000)
    });

    /*============================ OBJET 3D ==================*/
    let container: any;

    let camera: any;
    let scene: any;
    let renderer: any;

    let mouseX = 0, mouseY = 0;
    let percent_load: any;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let bottom = document.querySelector('.bottom') as HTMLDivElement;

    let object: any;
    init();
    animate();



    function init() {

      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.z = 140;

      // remove backgroung scene
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor(0xcccccc, 0);
      scene = new THREE.Scene();

      // Light
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff);
      scene.add(pointLight);

      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( - 3, 10, - 10 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 2;
				dirLight.shadow.camera.bottom = - 2;
				dirLight.shadow.camera.left = - 2;
				dirLight.shadow.camera.right = 2;
				dirLight.shadow.camera.near = 0.1;
				dirLight.shadow.camera.far = 40;
				scene.add( dirLight );
      // manager

      function loadModel() {

        object.traverse(function (child: any) {
          if (child.isMesh) child.material.map = texture;
        });

        object.position.y = -25;
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
          const percentComplete: number = xhr.loaded / xhr.total * 100;
          percent_load = Math.round(percentComplete);
          bottom.textContent = percent_load + '%';
          console.log('model ' + percent_load + '% downloaded');
        }
        return percent_load;
      }
      function onError() { }

      const loader = new FBXLoader(manager);
      loader.load('../assets/jagernaut-beyond-human/source/Pose_scene.fbx', function (obj: any) {
        object = obj;
        // window.addEventListener('wheel', ()=>{
        // })

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
      if (object) {
        object.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    }

  }

}
