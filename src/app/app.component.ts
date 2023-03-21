import { Component } from '@angular/core';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'THREEJS';

 
}
