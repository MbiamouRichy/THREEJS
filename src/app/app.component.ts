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
    let loader = document.querySelector('.loader') as HTMLDivElement;
    loader.classList.add('show');

    // Charger les données
    fetch('../angular.json').then(function (response) {
      // Masquer le loader
      setTimeout(function () {
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
    let objectRock: any;

    init();
    animate();



    function init() {

      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 60;

      // remove backgroung scene
      renderer = new THREE.WebGLRenderer({ alpha: true });
      scene = new THREE.Scene();

      // Light
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.3);
      scene.add(pointLight);


      // model Girl
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

      const loader = new FBXLoader();
      loader.load('../assets/Merged_PolySphere_4553.fbx', function (obj: any) {
        object = obj;
        // window.addEventListener('wheel', ()=>{
        // })
        object.rotation.y = 135
        scene.add(object);

      }, onProgress, onError)


      // Model Rock
      // manager

      function loadModel() {

        objectRock.traverse(function (child: any) {

          if (child.isMesh) child.material.map = texture;

        });

        objectRock.position.y = -15;
        objectRock.position.x = 0;
        objectRock.scale.set(0.07, 0.05, 0.03)


        scene.add(objectRock);

      }

      const manager = new THREE.LoadingManager(loadModel);
      // texture Rock

      const textureLoader = new THREE.TextureLoader(manager);

      const texture = textureLoader.load('../assets/sandstone-cliff/source/Low_Bake1_pbrs2a_diffuse.jpg');

      // model Rock
      const loaderRock = new FBXLoader(manager);
      loaderRock.load('../assets/sandstone-cliff/source/rock_10.fbx', function (obj: any) {
        objectRock = obj;
      },)

      // Thumbnail
      // Créer un élément avec la taille spécifiée
      var boxGeometry = new THREE.BoxGeometry(220, 220, 200);

      // Créer un matériau pour l'élément
      var boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });

      // Créer un mesh avec la géométrie et le matériau
      var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh.scale.set(0.05, 0.03, 0.05)

      // Ajouter le mesh à la scène
      scene.add(boxMesh);


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
        object.position.y = 8.9;
      }
      renderer.render(scene, camera);
    }

  }

}
