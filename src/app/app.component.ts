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
    let boxMesh:any = [];
    let time: number = 0;
    let count: number

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

      // const loader = new FBXLoader();
      // loader.load('../assets/Merged_PolySphere_4553.fbx', function (obj: any) {
      //   object = obj;
      //   // window.addEventListener('wheel', ()=>{
      //   // })
      //   object.position.y = 8.9
      //   object.rotation.y = 139
      //   scene.add(object);

      // }, onProgress, onError)


      // // Model Rock
      // // manager

      // function loadModel() {

      //   objectRock.traverse(function (child: any) {

      //     if (child.isMesh) child.material.map = texture;

      //   });

      //   objectRock.position.y = -15;
      //   objectRock.position.x = 0;
      //   objectRock.scale.set(0.07, 0.05, 0.03)


      //   scene.add(objectRock);

      // }

      // const manager = new THREE.LoadingManager(loadModel);
      // // texture Rock

      // const textureLoader = new THREE.TextureLoader(manager);

      // const texture = textureLoader.load('../assets/sandstone-cliff/source/Low_Bake1_pbrs2a_diffuse.jpg');

      // // model Rock
      // const loaderRock = new FBXLoader(manager);
      // loaderRock.load('../assets/sandstone-cliff/source/rock_10.fbx', function (obj: any) {
      //   objectRock = obj;
      // },)

      // Thumbnail
      // Définir la liste des images
      var imageList = [
        '../assets/thumbnail/desktop.png',
        '../assets/thumbnail/moi.jpg',
        '../assets/thumbnail/Rfram.png',
        '../assets/thumbnail/Richy-design-sketch-name.png',
        '../assets/thumbnail/richy.png',
      ];

      // Créer une texture pour chaque image et enregistrer dans un tableau
      var textures = [];
      for (var i = 0; i < imageList.length; i++) {
        var textureBox = new THREE.TextureLoader().load(imageList[i]);
        textures.push(textureBox);
      }

      // Créer une boîte pour chaque texture
      for (var i = 0; i < textures.length; i++) {
        var boxGeometry = new THREE.BoxGeometry(220, 220, 0);
        var boxMaterial = new THREE.MeshBasicMaterial({ map: textures[i] });
        var boxMeshs = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMeshs.scale.set(0.07, 0.05, 0.5)
        boxMeshs.position.set(-14, -15, -20)
        boxMeshs.rotation.y += 0;
        boxMesh.push(boxMeshs)
        scene.add(boxMesh[0]);

      }

      // boxMesh[1].position.set(16, -11, -20)
      // boxMesh[1].rotation.y += 180;

      // boxMesh[2].position.set(0, 0, 10)
      // boxMesh[2].rotation.y += 0;

      // boxMesh[3].position.set(-14, 11, -20)
      // boxMesh[3].rotation.y += 180;

      // boxMesh[4].position.set(16, 15, -20)
      // boxMesh[4].rotation.y += 0;

      // Ajouter les boîtes à la scène



      //renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(renderer.domElement);

      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('resize', onWindowResize);

    }
      function create(){
          count = 1
        if(boxMesh[count - 1].position.x >= 10 && count < boxMesh.length){

          scene.add(boxMesh[count])
          count++
        }
      }

    function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }
    function onDocumentMouseMove(event: any) {
      time -= 0.05;
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY);
      boxMesh.forEach((boxMesh: THREE.mesh) => {
        boxMesh.position.x = -(( Math.sin(time) * 13) / 15) + boxMesh.position.x;
        boxMesh.position.y = ((Math.sin(time) / 15) + 0.2) + boxMesh.position.y;
        boxMesh.rotation.y = -( Math.sin(time) / 150) + boxMesh.rotation.y;

      });
         }

    function animate() {
      requestAnimationFrame(animate);
        create()
        if(object){
          object.rotation.y -= 1
          if(object.rotation.y  < 135){
            object.rotation.y = 135
          }
        }
      render()
    }

    function render() {

      renderer.render(scene, camera);
    }

  }

}
