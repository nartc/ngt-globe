import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { extend } from "angular-three";
import * as THREE from "three";

extend(THREE);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
