import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {

   global.scene().addNode(new Gltf2Node({
      //url: "./media/gltf/60_fifth_ave/60_fifth_ave.gltf"
      url: "./media/gltf/neon_stage/scene.gltf"
   }));

   return {
      enableSceneReloading: true,
      scenes: [
         { name: "demoReadChart", path: "./demoReadChart.js"},
      ]
   };
}
