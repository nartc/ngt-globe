import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  effect,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgtArgs,
  NgtCanvas,
  NgtStore,
  extend,
  injectNgtRef,
} from "angular-three";
import ThreeGlobe from "three-globe";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ ThreeGlobe, TrackballControls, OrbitControls });

// Gen random data
const N = 300;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
}));

@Component({
  standalone: true,
  template: `
    <ngt-three-globe [ref]="globeRef" />
    <ngt-ambient-light color="#cccccc" />
    <ngt-directional-light color="#ffffff" [intensity]="0.6" />

    <ngt-orbit-controls
      *args="[camera(), domElement()]"
      [minDistance]="101"
      [rotateSpeed]="5"
      [zoomSpeed]="0.8"
    />
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
  readonly store = inject(NgtStore);
  readonly camera = this.store.select("camera");
  readonly domElement = this.store.select("gl", "domElement");

  readonly globeRef = injectNgtRef<ThreeGlobe>();

  constructor() {
    effect((onCleanup) => {
      const globe = this.globeRef.nativeElement;
      if (!globe) return;
      fetch("/assets/countries.geojson")
        .then((res) => res.json())
        .then((countries) => {
          globe
            .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.3)
            .hexPolygonColor(
              () =>
                `#${Math.round(Math.random() * Math.pow(2, 24))
                  .toString(16)
                  .padStart(6, "0")}`
            );
        });

      // const id = setTimeout(() => {
      //   gData.forEach((d) => (d.size = Math.random()));
      //   globe.pointsData(gData);
      // }, 4000);
      //
      // onCleanup(() => clearTimeout(id));
    });
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, NgtCanvas],
  template: `
    <ngt-canvas [sceneGraph]="scene" [camera]="{ position: [0, 0, 500] }" />
  `,
  styles: [],
})
export class AppComponent {
  readonly scene = Scene;
}
