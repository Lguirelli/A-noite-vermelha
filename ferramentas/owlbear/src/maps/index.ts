import Case from "case";

import { DefaultMap } from "../types/Map";
import { MapState } from "../types/MapState";

import blankImage from "./Blank.jpg";
import grassImage from "./Grass.jpg";
import sandImage from "./Sand.jpg";
import stoneImage from "./Stone.jpg";
import waterImage from "./Water.jpg";
import woodImage from "./Wood.jpg";

import unknownImage from "./Unknown.jpg";

export const mapSources = {
 bar:"/assets/maps/bar.svg", cela:"/assets/maps/cela.svg", fazenda:"/assets/maps/fazenda.svg", moinho:"/assets/maps/moinho.svg", floresta:"/assets/maps/floresta.svg",
  blank: blankImage,
  grass: grassImage,
  sand: sandImage,
  stone: stoneImage,
  water: waterImage,
  wood: woodImage,
};

export function getDefaultMaps(userId: string): {
  maps: DefaultMap[];
  mapStates: MapState[];
} {
  const mapKeys = Object.keys(mapSources);
  let maps: DefaultMap[] = [];
  let mapStates: MapState[] = [];
  for (let i = 0; i < mapKeys.length; i++) {
    const key = mapKeys[i];
    const names: Record<string,string>={bar:"Bar da estrada",cela:"Prisão",fazenda:"Fazenda velha",moinho:"Moinho",floresta:"Mata do fundão"};
    const name=names[key]||Case.capital(key);
    const id = `__default-${name}`;
    const map: DefaultMap = {
      id,
      key,
      name,
      owner: userId,
      grid: {
        size: { x: 22, y: 22 },
        inset: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } },
        type: "square",
        measurement: { type: "chebyshev", scale: "5ft" },
      },
      width: 1024,
      height: 1024,
      type: "default",
      created: mapKeys.length - i,
      lastModified: Date.now(),
      showGrid: key !== "stone",
      snapToGrid: true,
    };
    if (["bar","cela","fazenda","moinho","floresta"].includes(key)){map.width=1600;map.height=1000;map.grid.size={x:20,y:12.5};map.grid.measurement.scale="1,5 m";}
    maps.push(map);
    const state: MapState = {
      mapId: id,
      tokens: {},
      drawings: {},
      fogs: {},
      editFlags: ["drawing", "tokens", "notes"],
      notes: {},
    };
    if (["bar","cela","fazenda","moinho","floresta"].includes(key)) {
      ["damiao","baltazar","turak","octavio"].forEach((hero,i)=>{
        const label=["Damião","Baltazar","Turak","Octávio"][i];
        state.tokens["anv-"+hero]={id:"anv-"+hero,tokenId:"__default-"+label,owner:userId,size:1.5,category:"character",label,statuses:[],x:.38+i*.075,y:.78,lastModifiedBy:userId,lastModified:Date.now(),rotation:0,locked:false,visible:true,outline:{type:"rect",x:0,y:0,width:1024,height:1536},width:1024,height:1536,type:"default",key:hero};
      });
    }
    mapStates.push(state);
  }
  return { maps, mapStates };
}

export const unknownSource = unknownImage;
