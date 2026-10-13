export type PhotoLicense = {
  license: null | string;
  source: "commons" | "inaturalist";
  sourceUrl: string;
};

export const photoLicenses: Readonly<Record<string, PhotoLicense>> = {
  "https://cdn.reptiles.ge/accipiter-nisus-knoch-flight.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/de/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Accipiter_nisus_-in_flight-8.jpg",
  },
  "https://cdn.reptiles.ge/accipiter-nisus-mecnarowski-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Accipiter_nisus_1_(Martin_Mecnarowski).jpg",
  },
  "https://cdn.reptiles.ge/accipiter-nisus-sharp-female.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sparrowhawk_(Accipiter_nisus_nisus)_female.jpg",
  },
  "https://cdn.reptiles.ge/accipiter-nisus-zjeroen-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Accipiter_nisus_Meneer_Zjeroen.jpg",
  },
  "https://cdn.reptiles.ge/aquila-chrysaetos-alexander-1.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/354419166",
  },
  "https://cdn.reptiles.ge/aquila-chrysaetos-fanis-1.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/216599256",
  },
  "https://cdn.reptiles.ge/aquila-chrysaetos-frank-1.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/56882564",
  },
  "https://cdn.reptiles.ge/aquila-chrysaetos-rodenberger-1.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/387454392",
  },
  "https://cdn.reptiles.ge/buteo-buteo-lukasik-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Buteo_buteo_2_(Lukasz_Lukasik).jpg",
  },
  "https://cdn.reptiles.ge/buteo-buteo-serbia-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Buzzard_Buteo_buteo.jpg",
  },
  "https://cdn.reptiles.ge/buteo-buteo-sevan-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Buzzard_on_a_rock_by_Sevan.jpg",
  },
  "https://cdn.reptiles.ge/buteo-buteo-sharp-vulpinus.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Steppe_buzzard_(Buteo_buteo_vulpinus).jpg",
  },
  "https://cdn.reptiles.ge/buteo-buteo-szczepanek-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Buteo_buteo_1_(Marek_Szczepanek).jpg",
  },
  "https://cdn.reptiles.ge/buteo-buteo-yerpo-juv.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Buteo_buteo_juv_Log_(2).jpg",
  },
  "https://cdn.reptiles.ge/canis-aureus-bukvic-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%C5%A0akal_na_oprezu.jpg",
  },
  "https://cdn.reptiles.ge/canis-aureus-danube-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chacal_dor%C3%A9,_delta_du_Danube.jpg",
  },
  "https://cdn.reptiles.ge/canis-aureus-kerkini-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Golden_jackal_(Canis_aureus_moreotica).jpg",
  },
  "https://cdn.reptiles.ge/canis-aureus-stankovic-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MDYA3194_(cropped).jpg",
  },
  "https://cdn.reptiles.ge/canis-aureus-yarkon-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Golden_jackal.jpg",
  },
  "https://cdn.reptiles.ge/canis-lupus-eurasian-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eurasian_wolf_2.jpg",
  },
  "https://cdn.reptiles.ge/canis-lupus-innsbruck-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Canis_lupus_lupus_in_Alpenzoo,_Innsbruck.jpg",
  },
  "https://cdn.reptiles.ge/canis-lupus-pescheray-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Loup_gris_(Canis_lupus_).jpg",
  },
  "https://cdn.reptiles.ge/canis-lupus-portrait-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Portrait_of_a_Wolf.jpg",
  },
  "https://cdn.reptiles.ge/canis-lupus-sainte-croix-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Loup_gris_commun_DSCF1575.jpg",
  },
  "https://cdn.reptiles.ge/canis-lupus-tracks-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Fresh_Wolf_tracks,_Bia%C5%82owie%C5%BCa_Forest,_Poland_(4664117735).jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-antlers-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rehbock.jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-buck-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Srnda%C4%87_na_detelini.jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-fawn-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:One_week_old_roe_deer_fawn_(Capreolus_capreolus)_waiting_for_its_mother_in_tall_grass_Hungary_2019.05.28._10-14.jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-male-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Roe_deer_(Capreolus_capreolus)_male_Dobruja.jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-portrait-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Capreolus_capreolus_03.2025_(1).jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-running-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sarna_w_biegu.jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-summer-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ree_-_roe_deer_-_Capreolus_capreolus.jpg",
  },
  "https://cdn.reptiles.ge/capreolus-capreolus-winter-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Capreolus_capreolus_(51717308436).jpg",
  },
  "https://cdn.reptiles.ge/cuculus-canorus-chick-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cuculus_canorus_chick1.JPG",
  },
  "https://cdn.reptiles.ge/cuculus-canorus-eichler-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2015.08.30.-07-See_Pfingstberg_Mannheim-Rheinau--junger_Kuckuck.jpg",
  },
  "https://cdn.reptiles.ge/cuculus-canorus-janssen-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20180525_002_Belgie_Kempenbroek_koekoek_(42429286452).jpg",
  },
  "https://cdn.reptiles.ge/cuculus-canorus-moeller-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:B%C3%B6senbechhofen_Weiher_Kuckuck_Cuculus_canorus-20240608-RM-170659.jpg",
  },
  "https://cdn.reptiles.ge/cuculus-canorus-morffew-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cuckoo_(51169010335).jpg",
  },
  "https://cdn.reptiles.ge/cuculus-canorus-rinaud-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_cuckoo_(Cuculus_canorus)_2019.jpg",
  },
  "https://cdn.reptiles.ge/dendrocopos-major-rehnberg-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_spotted_woodpecker_(Dendrocopos_major).jpg",
  },
  "https://cdn.reptiles.ge/dendrocopos-major-sharp-female-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_spotted_woodpecker_(Dendrocopos_major)_female_Drenthe_3.jpg",
  },
  "https://cdn.reptiles.ge/dendrocopos-major-sharp-female.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_spotted_woodpecker_(Dendrocopos_major)_female_Drenthe_2.jpg",
  },
  "https://cdn.reptiles.ge/dendrocopos-major-sharp-juvenile.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_spotted_woodpecker_(Dendrocopos_major)_juvenile_Dobruja.jpg",
  },
  "https://cdn.reptiles.ge/dendrocopos-major-sharp-male-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_spotted_woodpecker_(Dendrocopos_major)_male_Drenthe_2.jpg",
  },
  "https://cdn.reptiles.ge/dendrocopos-major-sharp-male.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_spotted_woodpecker_(Dendrocopos_major)_male_Drenthe.jpg",
  },
  "https://cdn.reptiles.ge/eirenis-modestus-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/54925",
  },
  "https://cdn.reptiles.ge/eirenis-modestus-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/345956305",
  },
  "https://cdn.reptiles.ge/eirenis-modestus-mobile.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/183208028",
  },
  "https://cdn.reptiles.ge/eirenis-modestus.jpg": {
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/105717471",
  },
  "https://cdn.reptiles.ge/elaphe-dione-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/140744748",
  },
  "https://cdn.reptiles.ge/elaphe-dione-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/246917579",
  },
  "https://cdn.reptiles.ge/elaphe-dione-5.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%92%D1%96%D0%B7%D0%B5%D1%80%D1%83%D0%BD%D0%BA%D0%BE%D0%B2%D0%B8%D0%B9_%D0%BF%D0%BE%D0%BB%D0%BE%D0%B7_Elaphe_dione_(Pallas,_1773).jpg",
  },
  "https://cdn.reptiles.ge/elaphe-dione-6.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/166546598",
  },
  "https://cdn.reptiles.ge/elaphe-dione-7.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/97425149",
  },
  "https://cdn.reptiles.ge/emberiza-citrinella-gailhampshire-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Yellowhammer,_female_(16409057066).jpg",
  },
  "https://cdn.reptiles.ge/emberiza-citrinella-gorbunova-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Male_bunting.jpg",
  },
  "https://cdn.reptiles.ge/emberiza-citrinella-lours-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Yellowhammer_(Emberiza_citrinella).jpg",
  },
  "https://cdn.reptiles.ge/emberiza-citrinella-sharp-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Yellowhammer_(Emberiza_citrinella)_male.jpg",
  },
  "https://cdn.reptiles.ge/emberiza-citrinella-trepte-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Goldammer_Emberiza_citrinella.jpg",
  },
  "https://cdn.reptiles.ge/emys-orbicularis-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/4474575",
  },
  "https://cdn.reptiles.ge/emys-orbicularis-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/370280848",
  },
  "https://cdn.reptiles.ge/emys-orbicularis.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/18780442",
  },
  "https://cdn.reptiles.ge/eremias-arguta-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/93553764",
  },
  "https://cdn.reptiles.ge/eremias-arguta-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/11997409",
  },
  "https://cdn.reptiles.ge/eremias-arguta-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/318012787",
  },
  "https://cdn.reptiles.ge/eremias-arguta.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/41042387",
  },
  "https://cdn.reptiles.ge/erinaceus-concolor-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hedgehog_1210127.jpg",
  },
  "https://cdn.reptiles.ge/erinaceus-concolor-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erinaceus_concolor_202662874.jpg",
  },
  "https://cdn.reptiles.ge/erinaceus-concolor-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erinaceus_concolor_202738952.jpg",
  },
  "https://cdn.reptiles.ge/erinaceus-concolor-4.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erinaceus_concolor_-_D7-10-3855.JPG",
  },
  "https://cdn.reptiles.ge/erinaceus-concolor-israel-1.jpg": {
    license: "https://creativecommons.org/publicdomain/mark/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:PikiWiki_Israel_17010_Hedgehog.jpg",
  },
  "https://cdn.reptiles.ge/erinaceus-concolor-orkhevi-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Southern_White-breasted_Hedgehog_in_Orkhevi.jpg",
  },
  "https://cdn.reptiles.ge/erithacus-rubecula-cebeci-adana-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_-_European_robin,_Adana_2016-12-24_01-1.jpg",
  },
  "https://cdn.reptiles.ge/erithacus-rubecula-cebeci-adana-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_-_European_robin,_Adana_2016-12-10_07-2.jpg",
  },
  "https://cdn.reptiles.ge/erithacus-rubecula-cebeci-adana-3.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_-_European_robin,_Adana_2016-12-27_02-3.jpg",
  },
  "https://cdn.reptiles.ge/erithacus-rubecula-franklin-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_with_cocked_head.jpg",
  },
  "https://cdn.reptiles.ge/erithacus-rubecula-sharp-juvenile-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:European_robin_(Erithacus_rubecula)_juvenile.jpg",
  },
  "https://cdn.reptiles.ge/erithacus-rubecula-sharp-singing-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:European_robin_(Erithacus_rubecula)_singing_2.jpg",
  },
  "https://cdn.reptiles.ge/eryx-jaculus-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/50042883",
  },
  "https://cdn.reptiles.ge/eryx-jaculus-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/619071",
  },
  "https://cdn.reptiles.ge/eryx-jaculus.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/129650363",
  },
  "https://cdn.reptiles.ge/eumeces-schneiderii-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/9521266",
  },
  "https://cdn.reptiles.ge/eumeces-schneiderii-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/180253623",
  },
  "https://cdn.reptiles.ge/eumeces-schneiderii-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/26596742",
  },
  "https://cdn.reptiles.ge/eumeces-schneiderii.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/146024985",
  },
  "https://cdn.reptiles.ge/falco-peregrinus-giorgi-1.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/363099287",
  },
  "https://cdn.reptiles.ge/falco-peregrinus-giorgi-2.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/317707494",
  },
  "https://cdn.reptiles.ge/falco-peregrinus-leekelai-1.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/245913214",
  },
  "https://cdn.reptiles.ge/falco-peregrinus-pavel-1.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/41353110",
  },
  "https://cdn.reptiles.ge/falco-tinnunculus-alexis-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_kestrel_female_France.jpg",
  },
  "https://cdn.reptiles.ge/falco-tinnunculus-charles-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kestrel_(Falco_tinnunculus)_male_Farmoor.jpg",
  },
  "https://cdn.reptiles.ge/falco-tinnunculus-paul-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_kestrel_hovering_in_flight_near_Bad_Urach_(2026).jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-crowbared-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ficedula_hypoleuca_-Finland_-female-8.jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-lapa-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Papa-moscas-preto,_f%C3%AAmea,_European_Pied_Flycatcher,_female_(50348692871).jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-lepik-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Must-k%C3%A4rbsen%C3%A4pp_(Ficedula_hypoleuca).jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-rinaud-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:European_pied_flycatcher_(Ficedula_hypoleuca)_2023.jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-sharp-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pied_flycatcher_(Ficedula_hypoleuca)_non-breeding_male.jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-strzelecki-1.jpg": {
    license: "https://creativecommons.org/licenses/by/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pied_Flycatcher_Lodz(Poland)(js)01.jpg",
  },
  "https://cdn.reptiles.ge/ficedula-hypoleuca-virtala-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ficedula_hypoleuca_Oulu_Finland_2021-05-13.jpg",
  },
  "https://cdn.reptiles.ge/ficedula-semitorquata-asman-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Semi-collared_flycatcher_Ficedula_semitorquata_(3497826766).jpg",
  },
  "https://cdn.reptiles.ge/ficedula-semitorquata-castro-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:SemicollaredFlycatcher.jpg",
  },
  "https://cdn.reptiles.ge/ficedula-semitorquata-medenica-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ficedula_semitorquata.jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-flickr-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jay_(52848433000).jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-pyatigorsk-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%92_%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_%D0%9F%D1%8F%D1%82%D0%B8%D0%B3%D0%BE%D1%80%D1%81%D0%BA%D0%B0.jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-tbilisi-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2024-05-26_A_jay_in_Tbilisi.jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-trvants-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D4%B1%D5%B6%D5%BF%D5%A1%D5%BC%D5%A1%D5%B5%D5%AB%D5%B6_%D5%AF%D5%A1%D5%B9%D5%A1%D5%B2%D5%A1%D5%AF_02.jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-trvants-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D4%B1%D5%B6%D5%BF%D5%A1%D5%BC%D5%A1%D5%B5%D5%AB%D5%B6_%D5%AF%D5%A1%D5%B9%D5%A1%D5%B2%D5%A1%D5%AF_03.jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-yerevan-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_jay_YerevanBotanic2020.jpg",
  },
  "https://cdn.reptiles.ge/garrulus-glandarius-yerevan-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_jay_YerevanBotanic2020.2.jpg",
  },
  "https://cdn.reptiles.ge/hemorrhois-ravergieri-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/123060778",
  },
  "https://cdn.reptiles.ge/hemorrhois-ravergieri-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/181209834",
  },
  "https://cdn.reptiles.ge/hyla-orientalis-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/184358994",
  },
  "https://cdn.reptiles.ge/hyla-orientalis-3.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/184035964",
  },
  "https://cdn.reptiles.ge/hyla-orientalis-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/183468484",
  },
  "https://cdn.reptiles.ge/hyla-orientalis.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/185404031",
  },
  "https://cdn.reptiles.ge/hyla-savignyi-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/186726539",
  },
  "https://cdn.reptiles.ge/hyla-savignyi-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/214749047",
  },
  "https://cdn.reptiles.ge/hyla-savignyi.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/3641910",
  },
  "https://cdn.reptiles.ge/images/species/accipiter-gentilis-afr-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Habicht_(LSG_Melaten-Friedhof_K%C3%B6ln).jpg",
  },
  "https://cdn.reptiles.ge/images/species/accipiter-gentilis-ellgaard-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:En_duvh%C3%B6k_i_Marieberg,_Stockholm,_Nov_2018.jpg",
  },
  "https://cdn.reptiles.ge/images/species/accipiter-gentilis-kenntner-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Northern_Goshawk_ad_M2.jpg",
  },
  "https://cdn.reptiles.ge/images/species/accipiter-gentilis-slihto-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Accipiter_gentilis,_Kronvalda_Park,_Riga,_Latvia.jpg",
  },
  "https://cdn.reptiles.ge/images/species/accipiter-gentilis-thermos-juv-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/3.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:AccipterGentilisJuvenileFlight3.jpg",
    },
  "https://cdn.reptiles.ge/images/species/aegolius-funereus-moning-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aegolius_funereus_funereus_(Tengmalm%27s_Owl),_Lindberg,_Germany_1.jpg",
  },
  "https://cdn.reptiles.ge/images/species/aegolius-funereus-tencate-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tengmalm%27s_owl_(Aegolius_funereus).jpg",
  },
  "https://cdn.reptiles.ge/images/species/aegolius-funereus-tencate-cavity-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Ruigpootuil_-_Tengmalm%27s_owl_-_Aegolius_funereus_3.jpg",
    },
  "https://cdn.reptiles.ge/images/species/aegolius-funereus-veronesi-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aegolius_funereus_(Tengmalm%27s_Owl),_Oulu,_Finland.jpg",
  },
  "https://cdn.reptiles.ge/images/species/alectoris-chukar-soukup.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Alectoris_chukar.jpg",
  },
  "https://cdn.reptiles.ge/images/species/anas-platyrhynchos-ducklings-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mallard_ducklings.jpg",
  },
  "https://cdn.reptiles.ge/images/species/anas-platyrhynchos-female-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mallard_(Anas_platyrhynchos)_female_Blenheim.jpg",
  },
  "https://cdn.reptiles.ge/images/species/anas-platyrhynchos-flight-male-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Mallard_(Anas_platyrhynchos)_male_in_flight_Marken.jpg",
    },
  "https://cdn.reptiles.ge/images/species/anas-platyrhynchos-male-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mallard_duck_(Anas_platyrhynchos)_male.jpg",
  },
  "https://cdn.reptiles.ge/images/species/aquila-chrysaetos-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:015_Wild_Golden_Eagle_in_flight_at_Pfyn-Finges_(Switzerland)_Photo_by_Giles_Laurent.jpg",
  },
  "https://cdn.reptiles.ge/images/species/aquila-chrysaetos-flight-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:016_Wild_Golden_Eagle_in_flight_at_Pfyn-Finges_(Switzerland)_Photo_by_Giles_Laurent.jpg",
  },
  "https://cdn.reptiles.ge/images/species/aquila-chrysaetos-juvenile-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aquila_chrysaetos_-_Juvenile_Golden_Eagle_-_Isle_of_Arran_Scotland.jpg",
  },
  "https://cdn.reptiles.ge/images/species/aquila-chrysaetos-perch-1.jpg": {
    license: "https://creativecommons.org/licenses/by/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chrysaetos_La_Ca%C3%B1ada_20120114_1.jpg",
  },
  "https://cdn.reptiles.ge/images/species/argiope-lobata-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Argiope_lobata,_female._Villeveyrac_03.jpg",
  },
  "https://cdn.reptiles.ge/images/species/argiope-lobata-pair-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Argiope_lobata_male_(front)_and_female_(back).jpg",
  },
  "https://cdn.reptiles.ge/images/species/argiope-lobata-sete-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Argiope_lobata,_female_-_S%C3%A8te_01.jpg",
  },
  "https://cdn.reptiles.ge/images/species/argiope-lobata-ventral-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Argiope_lobata,_female._Villeveyrac_01.jpg",
  },
  "https://cdn.reptiles.ge/images/species/athene-noctua-cebeci-turkey-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Athene_noctua_-_Little_owl_01.jpg",
  },
  "https://cdn.reptiles.ge/images/species/athene-noctua-tencate-building-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Steenuil_-_little_owl_-_Athene_noctua_2.jpg",
    },
  "https://cdn.reptiles.ge/images/species/athene-noctua-vassen-ambula-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Athene_noctua,_Ambula,_Montenegro_1.jpg",
  },
  "https://cdn.reptiles.ge/images/species/athene-noctua-voikhansky-haifa-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Athene_noctua_-_the_little_owl.jpg",
    },
  "https://cdn.reptiles.ge/images/species/ciconia-ciconia-juvenile-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cigogne_blanche_juv%C3%A9nile_(Ciconia_ciconia).jpg",
  },
  "https://cdn.reptiles.ge/images/species/ciconia-ciconia-standing-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cigogne_blanche_(Ciconia_ciconia)_-_4278.jpg",
  },
  "https://cdn.reptiles.ge/images/species/ciconia-ciconia-standing-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:White_stork_(Ciconia_ciconia)_standing.jpg",
  },
  "https://cdn.reptiles.ge/images/species/columba-palumbus-halun-krakow-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Common_wood_pigeon_on_a_tree_in_Krak%C3%B3w,_20250412_1057_3650.jpg",
    },
  "https://cdn.reptiles.ge/images/species/columba-palumbus-halun-rzuchow-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Common_wood_pigeon,_R%C5%BCuch%C3%B3w,_Poland,_20250421_0906_4133.jpg",
    },
  "https://cdn.reptiles.ge/images/species/columba-palumbus-kurochkin-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wood_pigeon_(Columba_palumbus)_near_Yakhroma_(IMGP5234a1).jpg",
  },
  "https://cdn.reptiles.ge/images/species/columba-palumbus-lours-flight-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Common_Wood_Pigeon_2025_05_23.jpg",
    },
  "https://cdn.reptiles.ge/images/species/columba-palumbus-lours-head-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Wood_Pigeon_facing_left.jpg",
  },
  "https://cdn.reptiles.ge/images/species/corvus-corax-berlin-perch.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Corvus_corax_ad_berlin_090516.jpg",
  },
  "https://cdn.reptiles.ge/images/species/corvus-corax-delso-munich.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cuervo_(Corvus_corax),_Palacio_de_Nymphenburg,_M%C3%BAnich,_Alemania.JPG",
  },
  "https://cdn.reptiles.ge/images/species/corvus-corax-sharp-flight-babadag.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Common_raven_(Corvus_corax)_in_flight_Babadag.jpg",
    },
  "https://cdn.reptiles.ge/images/species/corvus-corax-sharp-flight-uckermark.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Common_raven_(Corvus_corax)_in_flight_Uckermark.jpg",
    },
  "https://cdn.reptiles.ge/images/species/corvus-corax-urbonas-lithuania.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Raven-Mindaugas_Urbonas-1.jpg",
  },
  "https://cdn.reptiles.ge/images/species/coturnix-coturnix-atom-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Coturnix_coturnix,_Beloyarskiy,_Sverdlovsk_Oblast,_Russia_1.jpg",
  },
  "https://cdn.reptiles.ge/images/species/coturnix-coturnix-moning-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Coturnix_coturnix,_Fraunberg,_Bayern,_Deutschland_1.jpg",
  },
  "https://cdn.reptiles.ge/images/species/coturnix-coturnix-moning-male-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Coturnix_coturnix,_Fraunberg,_Bayern,_Deutschland_2.jpg",
    },
  "https://cdn.reptiles.ge/images/species/coturnix-coturnix-moning-wagenitz-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Coturnix_coturnix,_Wagenitz,_Mühlenberge,_Brandenburg,_Deutschland_1.jpg",
    },
  "https://cdn.reptiles.ge/images/species/falco-peregrinus-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Falco_Peregrinus_07-agosto-2015.jpg",
  },
  "https://cdn.reptiles.ge/images/species/falco-peregrinus-flight-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Peregrine_falcon_approaching-20200411-RM-164346.jpg",
  },
  "https://cdn.reptiles.ge/images/species/falco-peregrinus-hunt-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:HuntingPeregine.jpg",
  },
  "https://cdn.reptiles.ge/images/species/falco-peregrinus-juvenile-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Peregrine_on_White_Cliffs,_Dover.jpg",
  },
  "https://cdn.reptiles.ge/images/species/falco-peregrinus-perch-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Peregrine_Falcon_La_Ca%C3%B1ada.jpg",
  },
  "https://cdn.reptiles.ge/images/species/glareola-pratincola-dupont-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Collared_Pratincole_(Glareola_pratincola)_(45894508314).jpg",
  },
  "https://cdn.reptiles.ge/images/species/glareola-pratincola-dupont-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Collared_Pratincole_(Glareola_pratincola)_(32675280948).jpg",
  },
  "https://cdn.reptiles.ge/images/species/glareola-pratincola-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Collared_Pratincole_(Glareola_pratincola)_1_(31608084467).jpg",
  },
  "https://cdn.reptiles.ge/images/species/glareola-pratincola-ground-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Glareola_pratincola_on_ground.jpg",
  },
  "https://cdn.reptiles.ge/images/species/glareola-pratincola-matyga-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%C5%BBwirowiec_%C5%82%C4%85kowy_(Glareola_pratincola).jpg",
  },
  "https://cdn.reptiles.ge/images/species/gyps-fulvus-colony-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20240606_173239_DSCN0826_colonia_de_buitres_leonados_en_la_Hoz_del_Durat%C3%B3n.jpg",
  },
  "https://cdn.reptiles.ge/images/species/gyps-fulvus-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Griffon_Vulture,_Gyps_fulvus,_in_flight.jpg",
  },
  "https://cdn.reptiles.ge/images/species/gyps-fulvus-flight-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_flight_of_a_griffon.jpg",
  },
  "https://cdn.reptiles.ge/images/species/gyps-fulvus-flight-3.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20240606_171157_DSCN0805_Buitre_leonado_vuelo_Hoz_de_Durat%C3%B3n.jpg",
  },
  "https://cdn.reptiles.ge/images/species/gyps-fulvus-head-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Griffon_vulture_(Gyps_fulvus).jpg",
  },
  "https://cdn.reptiles.ge/images/species/larus-fuscus-bardrock-juv-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Larus_fuscus_(juvenile).jpg",
  },
  "https://cdn.reptiles.ge/images/species/larus-fuscus-delso-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Gaviota_sombr%C3%ADa_(Larus_fuscus),_C%C3%A1diz,_Espa%C3%B1a,_2015-12-08,_DD_50.jpg",
  },
  "https://cdn.reptiles.ge/images/species/larus-fuscus-prince-heuglini-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Heuglin%27s_Gull_(33368230088).jpg",
  },
  "https://cdn.reptiles.ge/images/species/larus-fuscus-sharp-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lesser_black-backed_gull_(Larus_fuscus_graellsii).jpg",
  },
  "https://cdn.reptiles.ge/images/species/larus-fuscus-vagen-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Larus_fuscus_Finnboda_2012.jpg",
  },
  "https://cdn.reptiles.ge/images/species/latrodectus-tredecimguttatus-eggs-1.jpg":
    {
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Female_Latrodectus_tredecimguttatus_with_2_egg_sacs.jpg",
    },
  "https://cdn.reptiles.ge/images/species/latrodectus-tredecimguttatus-habitus-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/3.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Latrodectus_tredecimguttatus_habitus.JPG",
    },
  "https://cdn.reptiles.ge/images/species/latrodectus-tredecimguttatus-male-1.jpg":
    {
      license: "https://creativecommons.org/publicdomain/mark/1.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Latrodectus_tredecimguttatus_male.jpg",
    },
  "https://cdn.reptiles.ge/images/species/latrodectus-tredecimguttatus-spots-1.jpg":
    {
      license: "https://creativecommons.org/publicdomain/mark/1.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Latrodectus_tredecimguttatus_female.jpg",
    },
  "https://cdn.reptiles.ge/images/species/motacilla-alba-cebeci-adana-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Motacilla_alba_-_White_Wagtail,_Adana_2016-11-05_02-2.jpg",
  },
  "https://cdn.reptiles.ge/images/species/motacilla-alba-cebeci-tuzla-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Motacilla_alba_-_White_wagtail_in_Tuzla_03.jpg",
  },
  "https://cdn.reptiles.ge/images/species/motacilla-alba-mikolajewski-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Motacilla_alba_alba.JPG",
  },
  "https://cdn.reptiles.ge/images/species/motacilla-alba-sharp-lahemaa-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:White_wagtail_(Motacilla_alba_alba).jpg",
  },
  "https://cdn.reptiles.ge/images/species/motacilla-alba-sharp-marken-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pied_wagtail_(Motacilla_alba_alba)_Marken.jpg",
  },
  "https://cdn.reptiles.ge/images/species/motacilla-alba-sharp-sweden-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:White_wagtail_(Motacilla_alba_alba)_Sweden.jpg",
  },
  "https://cdn.reptiles.ge/images/species/otus-scops-botanical-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Otus_scops_botanical_garden.jpg",
  },
  "https://cdn.reptiles.ge/images/species/otus-scops-jutial-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_Scops-owl_(Otus_scops)_(35671157991).jpg",
  },
  "https://cdn.reptiles.ge/images/species/otus-scops-pakistan-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_Scops-owl_(Otus_scops)_(50276324636).jpg",
  },
  "https://cdn.reptiles.ge/images/species/otus-scops-tashkent-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_Scops_Owl_(Otus_scops)_(8079442507).jpg",
  },
  "https://cdn.reptiles.ge/images/species/pernis-apivorus-dietrich-juv-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Junger_Wespenbussard_Portr%C3%A4it.jpg",
  },
  "https://cdn.reptiles.ge/images/species/pernis-apivorus-laheyne-flight-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bondr%C3%A9e_Apivore_en_vol.jpg",
    },
  "https://cdn.reptiles.ge/images/species/pernis-apivorus-morffew-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Honey_Buzzard.jpg",
  },
  "https://cdn.reptiles.ge/images/species/pernis-apivorus-morffew-portrait-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by/2.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Honey_Buzzard_Portrait.jpg",
    },
  "https://cdn.reptiles.ge/images/species/pernis-apivorus-norelius-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bivr%C3%A5k,_R%C3%B6nninge,_S%C3%B6rmland,_Juli_2017_(38640218602).jpg",
  },
  "https://cdn.reptiles.ge/images/species/pernis-apivorus-sharp-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:European_honey-buzzard_(Pernis_apivorus)_in_flight_Babadag.jpg",
  },
  "https://cdn.reptiles.ge/images/species/phasianus-colchicus-female-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_pheasant_(Phasianus_colchicus)_female.jpg",
  },
  "https://cdn.reptiles.ge/images/species/phasianus-colchicus-male-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_pheasant_(Phasianus_colchicus)_male.jpg",
  },
  "https://cdn.reptiles.ge/images/species/phasianus-colchicus-male-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_pheasant_(Phasianus_colchicus)_male_Heligan.jpg",
  },
  "https://cdn.reptiles.ge/images/species/phasianus-colchicus-male-3.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jagdfasan_(April_2026).jpg",
  },
  "https://cdn.reptiles.ge/images/species/pica-pica-delso-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Urraca_(Pica_pica),_Almuradiel,_Ciudad_Real,_Espa%C3%B1a,_2021-12-19,_DD_04.jpg",
  },
  "https://cdn.reptiles.ge/images/species/pica-pica-delso-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Urraca_(Pica_pica),_Almuradiel,_Ciudad_Real,_Espa%C3%B1a,_2021-12-19,_DD_20.jpg",
  },
  "https://cdn.reptiles.ge/images/species/pica-pica-juvenile-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_magpie_juvenile_-_Kharkiv_2024.jpg",
  },
  "https://cdn.reptiles.ge/images/species/pica-pica-lours-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_magpie_iridescence.jpg",
  },
  "https://cdn.reptiles.ge/images/species/pica-pica-sharp-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_magpie_(Pica_pica).jpg",
  },
  "https://cdn.reptiles.ge/images/species/procyon-lotor-central-park-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Raccoon_in_Central_Park_(35264).jpg",
  },
  "https://cdn.reptiles.ge/images/species/procyon-lotor-female-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Raccoon_female.jpg",
  },
  "https://cdn.reptiles.ge/images/species/procyon-lotor-portrait-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Raccoon_(Procyon_lotor)_2.jpg",
  },
  "https://cdn.reptiles.ge/images/species/procyon-lotor-tracks-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Procyon_lotor_tracks_in_mud.jpg",
  },
  "https://cdn.reptiles.ge/images/species/steatoda-paykulliana-eggs-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Steatoda_paykulliana_with_egg_sacs.jpg",
  },
  "https://cdn.reptiles.ge/images/species/steatoda-paykulliana-female-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Steatoda_paykulliana_female.jpg",
  },
  "https://cdn.reptiles.ge/images/species/steatoda-paykulliana-habitat-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:False_Widow_Spider_(Steatoda_paykulliana)_(14373246443).jpg",
  },
  "https://cdn.reptiles.ge/images/species/steatoda-paykulliana-male-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Steatoda_paykulliana_male.jpg",
  },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-morffew-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Turtle_Dove_Drinking_(19019250278).jpg",
  },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-popescu-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20210519_Streptopelia_turtur.jpg",
  },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-sharp-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Turtle_dove_(Streptopelia_turtur_turtur)_Hungary.jpg",
  },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-sharp-flight-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Turtle_dove_(Streptopelia_turtur)_in_flight_Otmoor.jpg",
    },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-veljkovic-1.jpg":
    {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Grlica,_mu%C5%BEjak_(Streptopelia_turtur)_European_Turtle-dove,_male.jpg",
    },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-yuvalr-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:European_Turtle_Dove_(Streptopelia_turtur).jpg",
  },
  "https://cdn.reptiles.ge/images/species/streptopelia-turtur-zerocool-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Streptopelia_turtur_-_Turtle_dove.jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-amsel-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/de/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amsel.jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-karatavuk-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Blackbird_-_Turdus_merula_-_Karatavuk_01.jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-krakow-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Samiec_kosa_zwyczajnego_w_Krakowie,_20210409_1458_6217.jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-merel-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Merel_(m).jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-sharp-female.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Blackbird_(Turdus_merula_mauritanicus)_female.jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-trepte-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Turdus_merula_female.jpg",
  },
  "https://cdn.reptiles.ge/images/species/turdus-merula-wills-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.5/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Blackbird_(male).jpg",
  },
  "https://cdn.reptiles.ge/images/species/tyto-alba-bjoertvedt-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tyto_alba_ssp_guttata_in_Predjama_Slovenia_IMG_9403.jpg",
  },
  "https://cdn.reptiles.ge/images/species/tyto-alba-legg-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Barn_Owl_-_Tyto_alba_(53521785522).jpg",
  },
  "https://cdn.reptiles.ge/images/species/tyto-alba-legg-face-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Barn_Owl_-_Tyto_alba_(50357299072).jpg",
  },
  "https://cdn.reptiles.ge/images/species/tyto-alba-vezenkovic-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Western_Barn_Owl_-_Tyto_alba.jpg",
  },
  "https://cdn.reptiles.ge/images/species/tyto-alba-vezenkovic-guttata-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Western_Barn_Owl_Tyto_alba_guttata.jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-cebeci-golyaka-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Upupa_epops_-_Common_hoopoe_2021-03-27_04.jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-cebeci-osmaniye-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_Hoopoe_-_Upupa_epops_03.jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-garcia-madrid-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/es/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Upupa_epops_(Madrid,_Spain)_015.jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-laurent-flight-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:027_Wild_Eurasian_hoopoe_in_flight_at_Pfyn-Finges_Photo_by_Giles_Laurent.jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-shah-jutial-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Hoopoe_(Upupa_epops)_(23534998511).jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-sharp-juvenile-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_hoopoe_(Upupa_epops)_juvenile_in_nest_box_2.jpg",
  },
  "https://cdn.reptiles.ge/images/species/upupa-epops-straub-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Wiedehopf.jpg",
  },
  "https://cdn.reptiles.ge/jynx-torquilla-chorokhi-1.jpg": {
    license: "https://creativecommons.org/licenses/by/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jynx_torquilla_(Picidae)_(Eurasian_Wryneck)_-_(adult),_Chorokhi_Delta,_Georgia.jpg",
  },
  "https://cdn.reptiles.ge/jynx-torquilla-dalous-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jynx_torquilla_-_Jyntor.jpg",
  },
  "https://cdn.reptiles.ge/jynx-torquilla-hobern-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jynx_torquilla_(34536504885).jpg",
  },
  "https://cdn.reptiles.ge/jynx-torquilla-reigada-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wryneck_by_Pepe_Reigada.jpg",
  },
  "https://cdn.reptiles.ge/jynx-torquilla-ronning-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jynx_torquilla_(Ramsoy).JPG",
  },
  "https://cdn.reptiles.ge/jynx-torquilla-shrestha-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eurasian_wryneck.jpg",
  },
  "https://cdn.reptiles.ge/lacerta-agilis-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/32430817",
  },
  "https://cdn.reptiles.ge/lacerta-agilis-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/275472082",
  },
  "https://cdn.reptiles.ge/lacerta-agilis.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/204166502",
  },
  "https://cdn.reptiles.ge/lacerta-media-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/68053814",
  },
  "https://cdn.reptiles.ge/lacerta-media-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/240512685",
  },
  "https://cdn.reptiles.ge/lacerta-media.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/212425978",
  },
  "https://cdn.reptiles.ge/lissotriton-lantzi-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/107759763",
  },
  "https://cdn.reptiles.ge/lissotriton-lantzi-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/120609170",
  },
  "https://cdn.reptiles.ge/lissotriton-lantzi-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/346762987",
  },
  "https://cdn.reptiles.ge/lissotriton-lantzi.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/339319517",
  },
  "https://cdn.reptiles.ge/luscinia-megarhynchos-dupont-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_Nightingale_(Luscinia_megarhynchos)_(25936816473).jpg",
  },
  "https://cdn.reptiles.ge/luscinia-megarhynchos-eichler-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2018.05.26.-05-Erlichsee_Oberhausen-Rheinhausen--Nachtigall.jpg",
  },
  "https://cdn.reptiles.ge/luscinia-megarhynchos-rinaud-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Common_nightingale_(Luscinia_megarhynchos)_2019.jpg",
  },
  "https://cdn.reptiles.ge/luscinia-megarhynchos-tcager-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Luscinia_megarhynchos_africana,_Buynakskiy,_Dagestan_1.jpg",
  },
  "https://cdn.reptiles.ge/luscinia-megarhynchos-tcager-2.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Luscinia_megarhynchos_africana,_Kayakentskiy,_Dagestan_1.jpg",
  },
  "https://cdn.reptiles.ge/luscinia-megarhynchos-warrieboy-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Luscinia_megarhynchos_-_Common_nightingale_-_Nachtegaal.jpg",
  },
  "https://cdn.reptiles.ge/lutra-lutra-baranowski-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Is_it_spring_already%3F_(26741486398).jpg",
  },
  "https://cdn.reptiles.ge/lutra-lutra-christensen-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eurasian_otter.3.JPG",
  },
  "https://cdn.reptiles.ge/lutra-lutra-hokkanen-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2023_04_04_Puurij%C3%A4rvi_02.jpg",
  },
  "https://cdn.reptiles.ge/lutra-lutra-ibanez-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nutria_-_Alto_Tajo.jpg",
  },
  "https://cdn.reptiles.ge/lutra-lutra-spraint-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Heces_de_nutria_europea.jpg",
  },
  "https://cdn.reptiles.ge/malpolon-insignitus-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/282195814",
  },
  "https://cdn.reptiles.ge/malpolon-insignitus-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/206241534",
  },
  "https://cdn.reptiles.ge/malpolon-insignitus.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/38427068",
  },
  "https://cdn.reptiles.ge/mauremys-caspica-2.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/107253848",
  },
  "https://cdn.reptiles.ge/mauremys-caspica-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/13171016",
  },
  "https://cdn.reptiles.ge/mauremys-caspica.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/165887582",
  },
  "https://cdn.reptiles.ge/meles-canescens-armenia-tracks-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/392279425",
  },
  "https://cdn.reptiles.ge/meles-canescens-bafra-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/346611381",
  },
  "https://cdn.reptiles.ge/meles-canescens-vashlovani-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vashlovani_17789_(14642185845).jpg",
  },
  "https://cdn.reptiles.ge/meles-canescens-yalova-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/307030985",
  },
  "https://cdn.reptiles.ge/mertensiella-caucasica-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/379840528",
  },
  "https://cdn.reptiles.ge/mertensiella-caucasica.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/383087185",
  },
  "https://cdn.reptiles.ge/milvus-migrans-kraft-germany.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Milvus_migrans_front(ThKraft).jpg",
  },
  "https://cdn.reptiles.ge/milvus-migrans-sharp-huelva-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Black_kite_(Milvus_migrans_migrans)_in_flight_Huelva_2.jpg",
  },
  "https://cdn.reptiles.ge/milvus-migrans-sharp-huelva.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Black_kite_(Milvus_migrans_migrans)_in_flight_Huelva.jpg",
  },
  "https://cdn.reptiles.ge/milvus-migrans-sharp-liechtenstein.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Black_Kite_(Milvus_migrans_migrans)_in_flight_Ruggeller_Riet.jpg",
  },
  "https://cdn.reptiles.ge/milvus-migrans-sharp-morocco.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Black_kite_(Milvus_migrans_migrans)_in_flight.jpg",
  },
  "https://cdn.reptiles.ge/mustela-nivalis-andrieux-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Belette_pygm%C3%A9e_%C2%A9PNRV-Jean_Andrieux.jpg",
  },
  "https://cdn.reptiles.ge/mustela-nivalis-strzelecki-1.jpg": {
    license: "https://creativecommons.org/licenses/by/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Least_Weasel(js)02.jpg",
  },
  "https://cdn.reptiles.ge/natrix-natrix-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2017.07.17.-17-Tiefer_See_oder_Grubensee-Storkow_(Mark)--Ringelnatter.jpg",
  },
  "https://cdn.reptiles.ge/natrix-natrix-4.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Snok_%C3%A4ter_padda.jpg",
  },
  "https://cdn.reptiles.ge/natrix-natrix-7.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Natrix_natrix-1479.jpg",
  },
  "https://cdn.reptiles.ge/natrix-natrix.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Grass_snake_(Natrix_natrix)_Pieniny.jpg",
  },
  "https://cdn.reptiles.ge/ommatotriton-ophryticus-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/139881596",
  },
  "https://cdn.reptiles.ge/ommatotriton-ophryticus-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/199109327",
  },
  "https://cdn.reptiles.ge/ommatotriton-ophryticus-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/233706355",
  },
  "https://cdn.reptiles.ge/ommatotriton-ophryticus.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/29435958",
  },
  "https://cdn.reptiles.ge/ophisops-elegans.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/61378800",
  },
  "https://cdn.reptiles.ge/panthera-pardus-assaf-1.jpg": {
    license: "https://creativecommons.org/publicdomain/mark/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Persian_Leopard_sitting.jpg",
  },
  "https://cdn.reptiles.ge/panthera-pardus-burkhard-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/de/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Persischerleopardcele4.jpg",
  },
  "https://cdn.reptiles.ge/panthera-pardus-burkhard-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/de/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Persischer_leopard2cele4.jpg",
  },
  "https://cdn.reptiles.ge/panthera-pardus-museum-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Caucasus_Leopard_in_Georgian_National_Museum_02.JPG",
  },
  "https://cdn.reptiles.ge/panthera-pardus-thunderjag-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Persian_Leopard_(Panthera_pardus_saxicolor).jpg",
  },
  "https://cdn.reptiles.ge/paralaudakia-caucasia-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/241671168",
  },
  "https://cdn.reptiles.ge/paralaudakia-caucasia-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/241671169",
  },
  "https://cdn.reptiles.ge/paralaudakia-caucasia.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/119628986",
  },
  "https://cdn.reptiles.ge/pelobates-syriacus-2.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/152407529",
  },
  "https://cdn.reptiles.ge/pelobates-syriacus-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/268758632",
  },
  "https://cdn.reptiles.ge/pelobates-syriacus.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/182161519",
  },
  "https://cdn.reptiles.ge/pelodytes-caucasicus-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/136609538",
  },
  "https://cdn.reptiles.ge/pelodytes-caucasicus-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/131563046",
  },
  "https://cdn.reptiles.ge/pelodytes-caucasicus.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/95240537",
  },
  "https://cdn.reptiles.ge/pelophylax-ridibundus-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/353611251",
  },
  "https://cdn.reptiles.ge/pelophylax-ridibundus-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/32436838",
  },
  "https://cdn.reptiles.ge/pelophylax-ridibundus.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/83801849",
  },
  "https://cdn.reptiles.ge/phoenicolacerta-laevis-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/17764346",
  },
  "https://cdn.reptiles.ge/phoenicolacerta-laevis.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/148101091",
  },
  "https://cdn.reptiles.ge/picus-viridis-lours-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Green_woodpecker_Franconville_2022_01_21_1.jpg",
  },
  "https://cdn.reptiles.ge/picus-viridis-sharp-female.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:European_green_woodpecker_(Picus_viridis)_female.jpg",
  },
  "https://cdn.reptiles.ge/picus-viridis-skot-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%C5%BDluna_zelen%C3%A1_(Picus_viridis)_-_samice,_Praha,_vrch_T%C5%99e%C5%A1%C5%88ovka.jpg",
  },
  "https://cdn.reptiles.ge/rana-macrocnemis-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/357114699",
  },
  "https://cdn.reptiles.ge/rana-macrocnemis-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/53501993",
  },
  "https://cdn.reptiles.ge/rana-macrocnemis.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/343953167",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-alacam-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Red_squirrel_Alacam_Samsun_Turkey.jpg",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-cate-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kaukasuseekhoorn_-_Caucasian_Squirrel_-_Sciurus_anomalus.jpg",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-cebeci-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Squirrel_-_Sincap_01.jpg",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-cebeci-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Squirrel_-_Sincap_02.jpg",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-nest-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sciurus_anomalus_nest.jpg",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-ustun-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Squirrel_(16356817154).jpg",
  },
  "https://cdn.reptiles.ge/sciurus-anomalus-vake-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2025-02-09_Squirrel_in_Vake_Park.jpg",
  },
  "https://cdn.reptiles.ge/species/capra-aegagrus-gndasar-1.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bezoar_ibex_are_a_subspecies_of_the_wild_goat,_and_native_to_Armenia_-_50613102552.jpg",
  },
  "https://cdn.reptiles.ge/species/capra-aegagrus-horns-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Em_-_Capra_aegagrus_aegagrus_horns_-_4.jpg",
  },
  "https://cdn.reptiles.ge/species/capra-aegagrus-malkhasyan-3.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:3_Bezoar_Goat.jpg",
  },
  "https://cdn.reptiles.ge/species/capra-aegagrus-malkhasyan-4.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:4_Bezoar_Goat.jpg",
  },
  "https://cdn.reptiles.ge/species/capra-aegagrus-malkhasyan-6.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:6_Bezoar_Goat.jpg",
  },
  "https://cdn.reptiles.ge/species/capra-aegagrus-malkhasyan-9.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:9_Bezoar_Goat.jpg",
  },
  "https://cdn.reptiles.ge/species/lynx-lynx-bohringer-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lynx_lynx,_Luchs_03.JPG",
  },
  "https://cdn.reptiles.ge/species/lynx-lynx-delgado-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lynx_lynx_-_05.jpg",
  },
  "https://cdn.reptiles.ge/species/lynx-lynx-ebr-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lynx_lynx_dinniki_115107752.jpg",
  },
  "https://cdn.reptiles.ge/species/lynx-lynx-portrait-1.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Portrait_of_a_Carpathian_Lynx.jpg",
  },
  "https://cdn.reptiles.ge/species/lynx-lynx-tracks-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ilvese_j%C3%A4ljed_K%C3%B5rvemaal._2020._aasta_jaanuar..jpg",
  },
  "https://cdn.reptiles.ge/strix-aluco-gaebler-1.jpg": {
    license: "https://creativecommons.org/licenses/by/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Strix_aluco_(Linnaeus,_1758).jpg",
  },
  "https://cdn.reptiles.ge/strix-aluco-gavrilovic-chicks-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%C5%A0umska_sova_(Strix_aluco),_mladunci;_Tawny_Owl_chicks.jpg",
  },
  "https://cdn.reptiles.ge/strix-aluco-nottsexminer-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tawny_Owl_(4746698631).jpg",
  },
  "https://cdn.reptiles.ge/strix-aluco-trepte-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Waldkauz-Strix_aluco.jpg",
  },
  "https://cdn.reptiles.ge/sus-scrofa-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wild_boar_(Sus_scrofa).jpg",
  },
  "https://cdn.reptiles.ge/sus-scrofa-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Suidae_Sus_scrofa_scrofa_4.jpg",
  },
  "https://cdn.reptiles.ge/sus-scrofa-forest-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B0%D0%B1%D0%B0%D0%BD_%D1%83_%D0%BB%D1%96%D1%81%D1%96.jpg",
  },
  "https://cdn.reptiles.ge/sus-scrofa-frontal-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.5/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Wild_Boar_frontal.jpg",
  },
  "https://cdn.reptiles.ge/sus-scrofa-piglet-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sus_scrofa_piglet.jpg",
  },
  "https://cdn.reptiles.ge/sus-scrofa-sow-1.jpg": {
    license: "https://creativecommons.org/publicdomain/mark/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Frischlinge_mit_Bachen.jpg",
  },
  "https://cdn.reptiles.ge/telescopus-fallax.jpg": {
    license: "https://creativecommons.org/licenses/by/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Benny_Trapp_Telescopus_fallax.jpg",
  },
  "https://cdn.reptiles.ge/tenuidactylus-caspius-2.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/183207302",
  },
  "https://cdn.reptiles.ge/tenuidactylus-caspius-3.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/182328292",
  },
  "https://cdn.reptiles.ge/testudo-graeca-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/169566740",
  },
  "https://cdn.reptiles.ge/testudo-graeca-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/96663399",
  },
  "https://cdn.reptiles.ge/testudo-graeca.jpg": {
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/18922293",
  },
  "https://cdn.reptiles.ge/trachemys-scripta-2.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/4571829",
  },
  "https://cdn.reptiles.ge/trachemys-scripta-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/54804571",
  },
  "https://cdn.reptiles.ge/trachemys-scripta-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/150135337",
  },
  "https://cdn.reptiles.ge/trachemys-scripta.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/18808638",
  },
  "https://cdn.reptiles.ge/triturus-karelinii-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/260349445",
  },
  "https://cdn.reptiles.ge/triturus-karelinii-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/129655447",
  },
  "https://cdn.reptiles.ge/triturus-karelinii.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/4757157",
  },
  "https://cdn.reptiles.ge/ursus-arctos-cub-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_brown_bear_(Ursus_arctos_arctos)_mother_and_cub.jpg",
  },
  "https://cdn.reptiles.ge/ursus-arctos-female-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_brown_bear_(Ursus_arctos_arctos)_female_1.jpg",
  },
  "https://cdn.reptiles.ge/ursus-arctos-female-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Eurasian_brown_bear_(Ursus_arctos_arctos)_female_3.jpg",
  },
  "https://cdn.reptiles.ge/ursus-arctos-paw-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Grizzly_rear_paw_print.jpg",
  },
  "https://cdn.reptiles.ge/ursus-arctos-tracks-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Urme_de_urs_in_sare.jpg",
  },
  "https://cdn.reptiles.ge/vipera-darevskii-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Darevsky%27s_Viper.jpg",
  },
  "https://cdn.reptiles.ge/vipera-darevskii-3.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:P_darevskii_male.jpg",
  },
  "https://cdn.reptiles.ge/vipera-darevskii.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pelias_darevskii,_male_and_female_(Mt._Gumbati,_South_Georgia).png",
  },
  "https://cdn.reptiles.ge/vipera-renardi-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vipera_renardi_Volgograd.jpg",
  },
  "https://cdn.reptiles.ge/vipera-renardi-3.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vipera_renardi._Khortitsa.jpg",
  },
  "https://cdn.reptiles.ge/vipera-renardi-4.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Viperidae-_Vipera_renardi_renardi_(Steppe_Viper)_2a.jpg",
  },
  "https://cdn.reptiles.ge/vipera-renardi-5.jpg": {
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Juvenile_Vipera_renardi_retreating.jpg",
  },
  "https://cdn.reptiles.ge/vipera-renardi-6.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vipera_renardi._Gulajpole.jpg",
  },
  "https://cdn.reptiles.ge/vipera-renardi-7.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pelias_eriwanensis,_female_(Mt._Kysyrdag,_Turkey).png",
  },
  "https://cdn.reptiles.ge/vipera-renardi.jpg": {
    license: "https://creativecommons.org/licenses/by/2.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Viperidae-_Vipera_renardi_renardi_(Steppe_Viper)_1a.jpg",
  },
  "https://cdn.reptiles.ge/vipera-transcaucasiana-2.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Viperidae_-_Vipera_ammodytes_transcaucasiana.JPG",
  },
  "https://cdn.reptiles.ge/vipera-transcaucasiana-4.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/140705806",
  },
  "https://cdn.reptiles.ge/vipera-transcaucasiana-5.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/199114077",
  },
  "https://cdn.reptiles.ge/vipera-transcaucasiana-6.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/67388911",
  },
  "https://cdn.reptiles.ge/vipera-transcaucasiana-mobile.webp": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/238226101",
  },
  "https://cdn.reptiles.ge/vipera-transcaucasiana.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/238226101",
  },
  "https://cdn.reptiles.ge/vulpes-vulpes-billington-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Red_Fox_(Vulpes_vulpes)_(4).jpg",
  },
  "https://cdn.reptiles.ge/vulpes-vulpes-cubs-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mlade_lisice_u_rupi.jpg",
  },
  "https://cdn.reptiles.ge/vulpes-vulpes-lours-1.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Red_Fox_drinking_from_a_lake_in_Gennevilliers,_France.jpg",
  },
  "https://cdn.reptiles.ge/vulpes-vulpes-mallnitz-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vulpes_vulpes_Mallnitz_01.jpg",
  },
  "https://cdn.reptiles.ge/vulpes-vulpes-portrait-1.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog.jpg",
  },
  "https://cdn.reptiles.ge/xerotyphlops-vermicularis-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/212917577",
  },
  "https://cdn.reptiles.ge/xerotyphlops-vermicularis-3.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/106927503",
  },
  "https://cdn.reptiles.ge/xerotyphlops-vermicularis-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/280192435",
  },
  "https://cdn.reptiles.ge/xerotyphlops-vermicularis.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/134999100",
  },
  "https://cdn.reptiles.ge/zamenis-hohenackeri-2.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/13033404",
  },
  "https://cdn.reptiles.ge/zamenis-hohenackeri-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/199114081",
  },
  "https://cdn.reptiles.ge/zamenis-hohenackeri-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/220051753",
  },
  "https://cdn.reptiles.ge/zamenis-hohenackeri.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/316040531",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-2.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/184736285",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-3.jpg": {
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/25489275",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-4.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Erdei_sikl%C3%B3.jpg",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-5.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Zamenis_longissimus_(Nov%C3%BD_Hr%C3%A1dek_Castle,_Podyj%C3%AD_National_Park).JPG",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-6.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:U%C5%BEovka_stromov%C3%A1_(1).jpg",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-7.jpg": {
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Smuk,_Zamenis_longissimus,_Si%C4%87eva%C4%8Dka_klisura_(1).jpg",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus-mobile.jpg": {
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/28676867",
  },
  "https://cdn.reptiles.ge/zamenis-longissimus.jpg": {
    license: null,
    source: "inaturalist",
    sourceUrl: "https://www.inaturalist.org/observations/19465840",
  },
  "https://upload.wikimedia.org/wikipedia/commons/b/b1/Cimex_lectularius.jpg": {
    license: "https://creativecommons.org/publicdomain/mark/1.0/",
    source: "commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cimex_lectularius.jpg",
  },
  "https://upload.wikimedia.org/wikipedia/commons/c/cf/Agriculture_Research_Service_%28ARS%29_%288411876337%29.jpg":
    {
      license: "https://creativecommons.org/publicdomain/mark/1.0/",
      source: "commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Agriculture_Research_Service_(ARS)_(8411876337).jpg",
    },
};
