import { Component } from '@angular/core';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
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

    setTimeout(function () {
      loader.classList.remove('show');
    }, 2500)

    // Lancer l'experience
    let btnExplore = document.querySelector('.btn-explore') as HTMLDivElement;
    let Explore = document.querySelector('.explore') as HTMLDivElement;
    let bigText = document.querySelector('.big-text') as HTMLHeadingElement;
    let logo = document.querySelector('.logo') as HTMLDivElement;
    let dragOrScroll = document.querySelector('.dragORscroll') as HTMLDivElement;

    btnExplore.addEventListener('click', () => {
      dragOrScroll.style.display = "flex";
      setTimeout(() => {
        dragOrScroll.style.display = "none";
      }, 2000)
      logo.style.display = bigText.style.display = Explore.style.display = "none";
      // Mettre mes thumbnail(mes boxes) en gris
      Gris()
    })

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
    let boxMesh: any = [];
    let time: number = 0;
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let intersected: any;
    let TextBox = [
      'Et enfin j\'ai fais le plus \n dur pour moi "la thumbnail".',
      'Apres j\'ai realise le loader \n et toutes les animations \n du projet',
      'Puis j\'ai ajouter les elements \ndu designe c-a-d le logo et \nles textes',
      'En suite j\'ai commence par \n l\'integration de l\'objet "Girl"\n et son support "l\'objet Rock"',
      'J\'ai commence par apprendre \nTHREE.js et j\'ai realise une \nintegration',
    ];
    init();
    animate();
    // creation du texte de la thumbnail
    function createTextSprite(text: string, fontSize = 20, textColor = 'black', backgroundColor = 'transparent') {
      const canvas = document.createElement('canvas');
      const context: any = canvas.getContext('2d');
      const font = `${fontSize}px Space Grotesk`;
      context.font = font;

      // Diviser le texte en lignes
      const lines = text.split('\n');

      // Calculer la largeur maximale des lignes de texte
      const textWidth = Math.max(...lines.map(line => context.measureText(line).width));

      // Dessiner le fond
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, textWidth + fontSize, fontSize / lines.length);

      // Dessiner chaque ligne de texte
      context.textBaseline = 'middle';
      context.fillStyle = textColor;
      lines.forEach((line, index) => {
        context.fillText(line, fontSize / 2, fontSize * 0.75 + (fontSize * 1.5 * index));
      });

      // Créer la texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;

      // Créer le sprite
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);

      // Ajuster la taille du sprite
      sprite.scale.set(textWidth / fontSize * 10, 150, -25);

      return sprite;
    }
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
        object.position.y = 8.5
        object.rotation.y = 154.5
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
        objectRock.rotation.y = 154.5

      },)

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
        boxMeshs.scale.set(0.05, 0.03, 0.1)
        boxMesh.push(boxMeshs)
        scene.add(boxMesh[i]);
      }
      boxMesh[0].position.set(-16, -15, -20)

      boxMesh[1].position.set(18, -11, -20)

      boxMesh[2].position.set(0, 0, 2)

      boxMesh[3].position.set(16, -30, -20)

      boxMesh[4].position.set(-16, -45, -20)
      //renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(renderer.domElement);

      container.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('resize', onWindowResize);

    }


    // Rentre mes objet responsives
    function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }
    // Convertier mes textures pour leurs rendre gris au hover
    function convertTextureToGrayscale(texture: any) {
      // Vérifiez que la texture est définie
      if (!texture || !texture.image || !texture.image.width || !texture.image.height) {
        return texture;
      }

      const canvas = document.createElement('canvas');
      canvas.width = texture.image.width;
      canvas.height = texture.image.height;

      const ctx: any = canvas.getContext('2d');
      ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }

      ctx.putImageData(imageData, 0, 0);

      const grayscaleTexture = new THREE.Texture(canvas);
      grayscaleTexture.needsUpdate = true;

      return grayscaleTexture;
    }
    // Function qui met les thumbnails(Mes Boxes) en gris
    function Gris() {
      for (let i = 0; i < boxMesh.length; i++) {
        if (boxMesh[i].material.map) {
          // Créer une copie de la texture d'origine
          var originalTexture = boxMesh[i].material.map.clone();
          var grayTexture = convertTextureToGrayscale(originalTexture);
          if (grayTexture) {
            boxMesh[i].material.map.clone = grayTexture;
          }
        }
      }
    }
    // Function pour retirer le niveau de gris
    function RetirerGris(obj: any) {
      if (obj.material.map && obj.material.map.isGrayTexture) {
        obj.material.map = obj.userData.originalTexture;
      }
    }

    function moveAfficheBox() {
      for (let i = 0; i < TextBox.length; i++) {
        const textSprite = createTextSprite(TextBox[i]);
          textSprite.position.set(-50, -100, 20);
        if (boxMesh[i].position.y < 5 && boxMesh[i].position.y > -2) {
          boxMesh[i].add(textSprite);
        }
      }
      time -= 0.05;



      boxMesh[0].position.x = -((Math.sin(time) * 13) / 15) + boxMesh[0].position.x;
      boxMesh[0].position.y = ((Math.sin(time) / 15) + 0.2) + boxMesh[0].position.y;
      boxMesh[0].position.z = (Math.sin(time) * 10) / 2

      boxMesh[1].position.x = ((Math.sin(time) * 11) / 15) + boxMesh[1].position.x;
      boxMesh[1].position.y = ((Math.sin(time) / 15) + 0.37) + boxMesh[1].position.y;
      boxMesh[1].position.z = (-(Math.sin(time) * 7) / 2) + boxMesh[1].position.z / 10

      boxMesh[2].position.x = ((Math.sin(time) * 2) / 10) + boxMesh[2].position.x;
      boxMesh[2].position.y = ((Math.sin(time) / 5) + 0.4) + boxMesh[2].position.y;

      boxMesh[3].position.x = ((Math.sin(time) * 25) / 40) + boxMesh[3].position.x;
      boxMesh[3].position.y = ((Math.sin(time) / 15) + 0.2) + boxMesh[3].position.y;
      boxMesh[3].position.z = -(Math.sin(time) * 25) / 10

      boxMesh[4].position.x = -((Math.sin(time) * 13) / 15) + boxMesh[4].position.x;
      boxMesh[4].position.y = ((Math.sin(time) / 15) + 0.23) + boxMesh[4].position.y;
      boxMesh[4].position.z = (Math.sin(time) * 10) / 2
      object.rotation.y = objectRock.rotation.y = object.rotation.y - 0.01
      if (boxMesh[4].position.y > 5) {
        time -= 0.05;
      }
    }
    // Fonction de l'venement qui ecoute le deplacement de la souris
    function onDocumentMouseMove(event: any) {
      // Affiche le texte sur les thumbnails
      moveAfficheBox()

      // Calculez les coordonnées de la souris dans le système de coordonnées normalisé (-1 à 1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // Mettez à jour le raycaster en utilisant les coordonnées de la souris
      raycaster.setFromCamera(mouse, camera);
      // Obtenez les objets 3D qui sont intersectés par le raycaster
      let intersects = raycaster.intersectObjects(scene.children);

      // Appliquer la texture en niveaux de gris à l'objet survolé
      if (intersects.length > 0) {
        intersected = intersects[0].object;
        RetirerGris(intersected)
      }
    }
    function animate() {
      requestAnimationFrame(animate);
      render()
    }
    function render() {
      renderer.render(scene, camera);

    }


  }

}
