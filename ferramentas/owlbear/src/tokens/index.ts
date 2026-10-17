import Case from "case";
import { DefaultToken } from "../types/Token";

import aberration from "./Aberration.png";
import artificer from "./Artificer.png";
import barbarian from "./Barbarian.png";
import bard from "./Bard.png";
import beast from "./Beast.png";
import bloodHunter from "./Blood Hunter.png";
import celestial from "./Celestial.png";
import cleric from "./Cleric.png";
import construct from "./Construct.png";
import dragon from "./Dragon.png";
import druid from "./Druid.png";
import elemental from "./Elemental.png";
import fey from "./Fey.png";
import fiend from "./Fiend.png";
import fighter from "./Fighter.png";
import giant from "./Giant.png";
import goblinoid from "./Goblinoid.png";
import humanoid from "./Humanoid.png";
import monk from "./Monk.png";
import monstrosity from "./Monstrosity.png";
import ooze from "./Ooze.png";
import paladin from "./Paladin.png";
import plant from "./Plant.png";
import ranger from "./Ranger.png";
import rogue from "./Rogue.png";
import shapechanger from "./Shapechanger.png";
import sorcerer from "./Sorcerer.png";
import titan from "./Titan.png";
import undead from "./Undead.png";
import warlock from "./Warlock.png";
import wizard from "./Wizard.png";
import unknown from "./Unknown.png";

export const tokenSources = {
 damiao: "/assets/images/damiao-portrait.png",
 baltazar: "/assets/images/baltazar-portrait.png",
 turak: "/assets/images/turak-portrait.png",
 octavio: "/assets/images/octavio-portrait.png",
  barbarian,
  bard,
  cleric,
  druid,
  fighter,
  monk,
  paladin,
  ranger,
  rogue,
  sorcerer,
  warlock,
  wizard,
  artificer,
  bloodHunter,
  aberration,
  beast,
  celestial,
  construct,
  dragon,
  elemental,
  fey,
  fiend,
  giant,
  goblinoid,
  humanoid,
  monstrosity,
  ooze,
  plant,
  shapechanger,
  titan,
  undead,
};

function getDefaultTokenSize(key: string) {
  switch (key) {
    case "dragon":
    case "elemental":
    case "giant":
    case "ooze":
    case "titan":
      return 2;
    default:
      return 1;
  }
}

export function getDefaultTokens(userId: string): DefaultToken[] {
  const tokenKeys = Object.keys(tokenSources);
  let tokens: DefaultToken[] = [];
  for (let i = 0; i < tokenKeys.length; i++) {
    const key = tokenKeys[i];
    const names: Record<string,string>={damiao:"Damião",baltazar:"Baltazar",turak:"Turak",octavio:"Octávio"};
    const name = names[key] || Case.capital(key);
    const token: DefaultToken = {
      key,
      name,
      id: `__default-${name}`,
      type: "default",
      defaultSize: getDefaultTokenSize(key),
      defaultLabel: "",
      defaultCategory: "character",
      hideInSidebar: false,
      width: 256,
      height: 256,
      outline: { type: "circle", x: 128, y: 128, radius: 128 },
      owner: userId,
      created: tokenKeys.length - i,
      lastModified: Date.now(),
    };
    if (["damiao","baltazar","turak","octavio"].includes(key)) {token.width=1024;token.height=1536;token.defaultLabel=name;token.outline={type:"rect",x:0,y:0,width:1024,height:1536};}
    tokens.push(token);
  }
  return tokens;
}

export const unknownSource = unknown;
