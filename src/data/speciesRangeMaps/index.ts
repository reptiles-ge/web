import type { InteractiveRangeMapConfig } from "@/data/speciesRangeMaps/base";

import { rangeMap as accipiterNisus } from "@/data/speciesRangeMaps/accipiter-nisus";
import { rangeMap as aegypiusMonachus } from "@/data/speciesRangeMaps/aegypius-monachus";
import { rangeMap as alectorisChukar } from "@/data/speciesRangeMaps/alectoris-chukar";
import { rangeMap as anasPlatyrhynchos } from "@/data/speciesRangeMaps/anas-platyrhynchos";
import { rangeMap as anguisColchica } from "@/data/speciesRangeMaps/anguis-colchica";
import { rangeMap as aquilaChrysaetos } from "@/data/speciesRangeMaps/aquila-chrysaetos";
import { rangeMap as araneusDiadematus } from "@/data/speciesRangeMaps/araneus-diadematus";
import { rangeMap as argiopeBruennichi } from "@/data/speciesRangeMaps/argiope-bruennichi";
import { rangeMap as blattaOrientalis } from "@/data/speciesRangeMaps/blatta-orientalis";
import { rangeMap as bufoVerrucosissimus } from "@/data/speciesRangeMaps/bufo-verrucosissimus";
import { rangeMap as bufotesViridis } from "@/data/speciesRangeMaps/bufotes-viridis";
import { rangeMap as canisAureus } from "@/data/speciesRangeMaps/canis-aureus";
import { rangeMap as canisLupus } from "@/data/speciesRangeMaps/canis-lupus";
import { rangeMap as capreolusCapreolus } from "@/data/speciesRangeMaps/capreolus-capreolus";
import { rangeMap as cheiracanthiumPunctorium } from "@/data/speciesRangeMaps/cheiracanthium-punctorium";
import { rangeMap as ciconiaCiconia } from "@/data/speciesRangeMaps/ciconia-ciconia";
import { rangeMap as columbaLivia } from "@/data/speciesRangeMaps/columba-livia";
import { rangeMap as columbaPalumbus } from "@/data/speciesRangeMaps/columba-palumbus";
import { rangeMap as coronellaAustriaca } from "@/data/speciesRangeMaps/coronella-austriaca";
import { rangeMap as coturnixCoturnix } from "@/data/speciesRangeMaps/coturnix-coturnix";
import { rangeMap as cuculusCanorus } from "@/data/speciesRangeMaps/cuculus-canorus";
import { rangeMap as darevskiaAdjarica } from "@/data/speciesRangeMaps/darevskia-adjarica";
import { rangeMap as darevskiaArmeniaca } from "@/data/speciesRangeMaps/darevskia-armeniaca";
import { rangeMap as darevskiaCaucasica } from "@/data/speciesRangeMaps/darevskia-caucasica";
import { rangeMap as darevskiaClarkorum } from "@/data/speciesRangeMaps/darevskia-clarkorum";
import { rangeMap as darevskiaDahli } from "@/data/speciesRangeMaps/darevskia-dahli";
import { rangeMap as darevskiaDerjugini } from "@/data/speciesRangeMaps/darevskia-derjugini";
import { rangeMap as darevskiaObscura } from "@/data/speciesRangeMaps/darevskia-obscura";
import { rangeMap as darevskiaPortschinskii } from "@/data/speciesRangeMaps/darevskia-portschinskii";
import { rangeMap as darevskiaValentini } from "@/data/speciesRangeMaps/darevskia-valentini";
import { rangeMap as dendrocoposMajor } from "@/data/speciesRangeMaps/dendrocopos-major";
import { rangeMap as dolichophisSchmidti } from "@/data/speciesRangeMaps/dolichophis-schmidti";
import { rangeMap as eirenisCollaris } from "@/data/speciesRangeMaps/eirenis-collaris";
import { rangeMap as eirenisModestus } from "@/data/speciesRangeMaps/eirenis-modestus";
import { rangeMap as elapheUrartica } from "@/data/speciesRangeMaps/elaphe-urartica";
import { rangeMap as eremiasVelox } from "@/data/speciesRangeMaps/eremias-velox";
import { rangeMap as erithacusRubecula } from "@/data/speciesRangeMaps/erithacus-rubecula";
import { rangeMap as eryxJaculus } from "@/data/speciesRangeMaps/eryx-jaculus";
import { rangeMap as euscorpiusItalicus } from "@/data/speciesRangeMaps/euscorpius-italicus";
import { rangeMap as euscorpiusMingrelicus } from "@/data/speciesRangeMaps/euscorpius-mingrelicus";
import { rangeMap as falcoPeregrinus } from "@/data/speciesRangeMaps/falco-peregrinus";
import { rangeMap as falcoTinnunculus } from "@/data/speciesRangeMaps/falco-tinnunculus";
import { rangeMap as garrulusGlandarius } from "@/data/speciesRangeMaps/garrulus-glandarius";
import { rangeMap as gypaetusBarbatus } from "@/data/speciesRangeMaps/gypaetus-barbatus";
import { rangeMap as gypsFulvus } from "@/data/speciesRangeMaps/gyps-fulvus";
import { rangeMap as halyomorphaHalys } from "@/data/speciesRangeMaps/halyomorpha-halys";
import { rangeMap as hylaOrientalis } from "@/data/speciesRangeMaps/hyla-orientalis";
import { rangeMap as jynxTorquilla } from "@/data/speciesRangeMaps/jynx-torquilla";
import { rangeMap as lacertaAgilis } from "@/data/speciesRangeMaps/lacerta-agilis";
import { rangeMap as lacertaMedia } from "@/data/speciesRangeMaps/lacerta-media";
import { rangeMap as lacertaStrigata } from "@/data/speciesRangeMaps/lacerta-strigata";
import { rangeMap as laniusCollurio } from "@/data/speciesRangeMaps/lanius-collurio";
import { rangeMap as latrodectusTredecimguttatus } from "@/data/speciesRangeMaps/latrodectus-tredecimguttatus";
import { rangeMap as lutraLutra } from "@/data/speciesRangeMaps/lutra-lutra";
import { rangeMap as macroviperaLebetina } from "@/data/speciesRangeMaps/macrovipera-lebetina";
import { rangeMap as mantisReligiosa } from "@/data/speciesRangeMaps/mantis-religiosa";
import { rangeMap as mauremysCaspica } from "@/data/speciesRangeMaps/mauremys-caspica";
import { rangeMap as melesCanescens } from "@/data/speciesRangeMaps/meles-canescens";
import { rangeMap as mertensiellaCaucasica } from "@/data/speciesRangeMaps/mertensiella-caucasica";
import { rangeMap as mesobuthusEupeus } from "@/data/speciesRangeMaps/mesobuthus-eupeus";
import { rangeMap as mustelaNivalis } from "@/data/speciesRangeMaps/mustela-nivalis";
import { rangeMap as natrixNatrix } from "@/data/speciesRangeMaps/natrix-natrix";
import { rangeMap as natrixTessellata } from "@/data/speciesRangeMaps/natrix-tessellata";
import { rangeMap as neophronPercnopterus } from "@/data/speciesRangeMaps/neophron-percnopterus";
import { rangeMap as paralaudakiaCaucasia } from "@/data/speciesRangeMaps/paralaudakia-caucasia";
import { rangeMap as phasianusColchicus } from "@/data/speciesRangeMaps/phasianus-colchicus";
import { rangeMap as picusViridis } from "@/data/speciesRangeMaps/picus-viridis";
import { rangeMap as platycepsNajadum } from "@/data/speciesRangeMaps/platyceps-najadum";
import { rangeMap as procyonLotor } from "@/data/speciesRangeMaps/procyon-lotor";
import { rangeMap as pseudopusApodus } from "@/data/speciesRangeMaps/pseudopus-apodus";
import { rangeMap as steatodaPaykulliana } from "@/data/speciesRangeMaps/steatoda-paykulliana";
import { rangeMap as streptopeliaTurtur } from "@/data/speciesRangeMaps/streptopelia-turtur";
import { rangeMap as telescopusFallax } from "@/data/speciesRangeMaps/telescopus-fallax";
import { rangeMap as turdusMerula } from "@/data/speciesRangeMaps/turdus-merula";
import { rangeMap as tytoAlba } from "@/data/speciesRangeMaps/tyto-alba";
import { rangeMap as ursusArctos } from "@/data/speciesRangeMaps/ursus-arctos";
import { rangeMap as viperaDarevskii } from "@/data/speciesRangeMaps/vipera-darevskii";
import { rangeMap as viperaDinniki } from "@/data/speciesRangeMaps/vipera-dinniki";
import { rangeMap as viperaKaznakovi } from "@/data/speciesRangeMaps/vipera-kaznakovi";
import { rangeMap as viperaRenardi } from "@/data/speciesRangeMaps/vipera-renardi";
import { rangeMap as viperaTranscaucasiana } from "@/data/speciesRangeMaps/vipera-transcaucasiana";
import { rangeMap as vulpesVulpes } from "@/data/speciesRangeMaps/vulpes-vulpes";
import { rangeMap as xerotyphlopsVermicularis } from "@/data/speciesRangeMaps/xerotyphlops-vermicularis";
import { rangeMap as zamenisHohenackeri } from "@/data/speciesRangeMaps/zamenis-hohenackeri";
import { rangeMap as zamenisLongissimus } from "@/data/speciesRangeMaps/zamenis-longissimus";

export type { HalyomorphaRangeCopy } from "@/data/speciesRangeMaps/base";

export const INTERACTIVE_RANGE_MAPS: Partial<
  Record<string, InteractiveRangeMapConfig>
> = {
  "accipiter-nisus": accipiterNisus,
  "aegypius-monachus": aegypiusMonachus,
  "alectoris-chukar": alectorisChukar,
  "anas-platyrhynchos": anasPlatyrhynchos,
  "anguis-colchica": anguisColchica,
  "aquila-chrysaetos": aquilaChrysaetos,
  "araneus-diadematus": araneusDiadematus,
  "argiope-bruennichi": argiopeBruennichi,
  "blatta-orientalis": blattaOrientalis,
  "bufo-verrucosissimus": bufoVerrucosissimus,
  "bufotes-viridis": bufotesViridis,
  "canis-aureus": canisAureus,
  "canis-lupus": canisLupus,
  "capreolus-capreolus": capreolusCapreolus,
  "cheiracanthium-punctorium": cheiracanthiumPunctorium,
  "ciconia-ciconia": ciconiaCiconia,
  "columba-livia": columbaLivia,
  "columba-palumbus": columbaPalumbus,
  "coronella-austriaca": coronellaAustriaca,
  "coturnix-coturnix": coturnixCoturnix,
  "cuculus-canorus": cuculusCanorus,
  "darevskia-adjarica": darevskiaAdjarica,
  "darevskia-armeniaca": darevskiaArmeniaca,
  "darevskia-caucasica": darevskiaCaucasica,
  "darevskia-clarkorum": darevskiaClarkorum,
  "darevskia-dahli": darevskiaDahli,
  "darevskia-derjugini": darevskiaDerjugini,
  "darevskia-obscura": darevskiaObscura,
  "darevskia-portschinskii": darevskiaPortschinskii,
  "darevskia-valentini": darevskiaValentini,
  "dendrocopos-major": dendrocoposMajor,
  "dolichophis-schmidti": dolichophisSchmidti,
  "eirenis-collaris": eirenisCollaris,
  "eirenis-modestus": eirenisModestus,
  "elaphe-urartica": elapheUrartica,
  "eremias-velox": eremiasVelox,
  "erithacus-rubecula": erithacusRubecula,
  "eryx-jaculus": eryxJaculus,
  "euscorpius-italicus": euscorpiusItalicus,
  "euscorpius-mingrelicus": euscorpiusMingrelicus,
  "falco-peregrinus": falcoPeregrinus,
  "falco-tinnunculus": falcoTinnunculus,
  "garrulus-glandarius": garrulusGlandarius,
  "gypaetus-barbatus": gypaetusBarbatus,
  "gyps-fulvus": gypsFulvus,
  "halyomorpha-halys": halyomorphaHalys,
  "hyla-orientalis": hylaOrientalis,
  "jynx-torquilla": jynxTorquilla,
  "lacerta-agilis": lacertaAgilis,
  "lacerta-media": lacertaMedia,
  "lacerta-strigata": lacertaStrigata,
  "lanius-collurio": laniusCollurio,
  "latrodectus-tredecimguttatus": latrodectusTredecimguttatus,
  "lutra-lutra": lutraLutra,
  "macrovipera-lebetina": macroviperaLebetina,
  "mantis-religiosa": mantisReligiosa,
  "mauremys-caspica": mauremysCaspica,
  "meles-canescens": melesCanescens,
  "mertensiella-caucasica": mertensiellaCaucasica,
  "mesobuthus-eupeus": mesobuthusEupeus,
  "mustela-nivalis": mustelaNivalis,
  "natrix-natrix": natrixNatrix,
  "natrix-tessellata": natrixTessellata,
  "neophron-percnopterus": neophronPercnopterus,
  "paralaudakia-caucasia": paralaudakiaCaucasia,
  "phasianus-colchicus": phasianusColchicus,
  "picus-viridis": picusViridis,
  "platyceps-najadum": platycepsNajadum,
  "procyon-lotor": procyonLotor,
  "pseudopus-apodus": pseudopusApodus,
  "steatoda-paykulliana": steatodaPaykulliana,
  "streptopelia-turtur": streptopeliaTurtur,
  "telescopus-fallax": telescopusFallax,
  "turdus-merula": turdusMerula,
  "tyto-alba": tytoAlba,
  "ursus-arctos": ursusArctos,
  "vipera-darevskii": viperaDarevskii,
  "vipera-dinniki": viperaDinniki,
  "vipera-kaznakovi": viperaKaznakovi,
  "vipera-renardi": viperaRenardi,
  "vipera-transcaucasiana": viperaTranscaucasiana,
  "vulpes-vulpes": vulpesVulpes,
  "xerotyphlops-vermicularis": xerotyphlopsVermicularis,
  "zamenis-hohenackeri": zamenisHohenackeri,
  "zamenis-longissimus": zamenisLongissimus,
};
