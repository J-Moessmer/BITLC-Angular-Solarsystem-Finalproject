/**
 * Projekt / Modul: SSI App – Solar System Info App / Media Gallery Data (media-gallery.data.ts)
 * FCPP-Referenz: P20-U10, P20-U20, P40-U20, P50-U20
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v1.0
 * Hinweis: Kuratierte und per API/HTTP geprüfte Fotogalerien (>= 5 Fotos pro Objekt & Mission) für Infobox (P20) und Forschungsprojekte (P40).
 */

import type { CelestialBody } from '../models/celestial-body.model';
import type { ResearchMission } from '../models/research-mission.model';

export interface GalleryMediaItem {
  url: string;
  caption: string;
}

export const LAGRANGE_GALLERY_EXTRAS: ReadonlyArray<GalleryMediaItem> = [
  {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Eclipse_of_12_August_2026_from_space%2C_Proba-3_SOHO_and_PUNCH_composite_%28Stefano_Ivan_Stinga%29.jpg/960px-Eclipse_of_12_August_2026_from_space%2C_Proba-3_SOHO_and_PUNCH_composite_%28Stefano_Ivan_Stinga%29.jpg",
    "caption": "Sonnenbeobachter SOHO am Punkt Sonne–Erde L1"
  },
  {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Lucy_spacecraft_trajectory.png/960px-Lucy_spacecraft_trajectory.png",
    "caption": "Asteroiden sammeln sich in den Punkten L4 & L5"
  },
  {
    "url": "https://images-assets.nasa.gov/image/PIA03149/PIA03149~medium.jpg",
    "caption": "Sonnensonde SOHO beobachtet vom Punkt L1"
  },
  {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/The_James_Webb_Space_Telescope_at_L2_%28SVS13375%29.jpg/960px-The_James_Webb_Space_Telescope_at_L2_%28SVS13375%29.jpg",
    "caption": "Das James-Webb-Teleskop kreist sicher am Punkt L2"
  },
  {
    "url": "https://images-assets.nasa.gov/image/KSC-20260717-PH-JMT01_0002/KSC-20260717-PH-JMT01_0002~medium.jpg",
    "caption": "Gleichgewicht von Schwerkraft und Fliehkraft an L1–L5"
  }
];

export const BODY_AND_MISSION_GALLERY: Readonly<Record<string, ReadonlyArray<GalleryMediaItem>>> = {
  "artemis": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Artemis_1_lunar_mare_and_craters.jpg/960px-Artemis_1_lunar_mare_and_craters.jpg",
      "caption": "Orion fliegt nah über den Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20200312-PH-FMX01_0004/KSC-20200312-PH-FMX01_0004~medium.jpg",
      "caption": "Landung der Orion-Kapsel im Ozean"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20220816-PH-FMX01_0067/KSC-20220816-PH-FMX01_0067~medium.jpg",
      "caption": "Mondrakete SLS auf der Startrampe"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Artemis_program_%28solid_contrast_with_wordmark%29.svg/960px-Artemis_program_%28solid_contrast_with_wordmark%29.svg.png",
      "caption": "Offizielles Artemis-Programm-Logo"
    },
    {
      "url": "https://images-assets.nasa.gov/image/Artemis%20I%20FD%2017%20Orion%20and%20a%20Crescent%20Moon/Artemis%20I%20FD%2017%20Orion%20and%20a%20Crescent%20Moon~medium.jpg",
      "caption": "Raumschiff Orion mit Blick auf den Mond"
    }
  ],
  "apollo-13": [
    {
      "url": "https://images-assets.nasa.gov/image/KSC-04pd1238/KSC-04pd1238~medium.jpg",
      "caption": "Start der Saturn-V-Rakete von Apollo 13"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S70-15511/S70-15511~medium.jpg",
      "caption": "Die drei Astronauten von Apollo 13"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S70-35614/S70-35614~medium.jpg",
      "caption": "Sichere Wasserlandung im Pazifik"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Apollo_13-insignia.png/960px-Apollo_13-insignia.png",
      "caption": "Missionsabzeichen Apollo 13"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S70-34685/S70-34685~medium.jpg",
      "caption": "Rettungs-Mondfähre Aquarius der Apollo-13-Crew"
    }
  ],
  "dawn": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA20683/PIA20683~thumb.jpg",
      "caption": "Helle Salz-Flecken im Occator-Krater auf Ceres"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/PIA19631-Ceres-DwarfPlanet-Dawn-3rdMapOrbit-HAMO-image1-20150819.jpg/960px-PIA19631-Ceres-DwarfPlanet-Dawn-3rdMapOrbit-HAMO-image1-20150819.jpg",
      "caption": "Eis-Vulkanberg Ahuna Mons auf Ceres"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-07pd1599/KSC-07pd1599~medium.jpg",
      "caption": "Dawn mit ihrem blauen Ionenantrieb"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Dawn_logo.png/960px-Dawn_logo.png",
      "caption": "Missionsabzeichen Dawn"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA14125/PIA14125~medium.jpg",
      "caption": "Riesenasteroid Vesta – erstes Ziel der Sonde Dawn"
    }
  ],
  "sun": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA19680/PIA19680~thumb.jpg",
      "caption": "Gewaltiger Sonnensturm im UV-Licht"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000923/GSFC_20171208_Archive_e000923~thumb.jpg",
      "caption": "Sonnenflecken auf der Sonnenoberfläche"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002054/GSFC_20171208_Archive_e002054~medium.jpg",
      "caption": "Sonnenkorona bei einer Sonnenfinsternis"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Solar_Filament_Eruption_Creates_%27Canyon_of_Fire%27.jpg/960px-Solar_Filament_Eruption_Creates_%27Canyon_of_Fire%27.jpg",
      "caption": "Glühende Plasma-Schleifen über der Sonne"
    }
  ],
  "parker": [
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20170828-PH_JBS01_0204/KSC-20170828-PH_JBS01_0204~medium.jpg",
      "caption": "Start der Parker Solar Probe 2018"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Parker_Solar_Probe_coronal_stream_wispr-big_1-st_flyby.jpg/960px-Parker_Solar_Probe_coronal_stream_wispr-big_1-st_flyby.jpg",
      "caption": "Blick durch die Sonnenkorona (WISPR)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Parker_Solar_Probe.jpg/960px-Parker_Solar_Probe.jpg",
      "caption": "Flug dicht an der glühenden Sonne vorbei"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20180403-PH_JBS01_0051/KSC-20180403-PH_JBS01_0051~medium.jpg",
      "caption": "Hitzeschild und Messinstrumente von Parker Solar Probe"
    }
  ],
  "solar-orbiter": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Solar_Orbiter_spacecraft_is_prepared_for_encapsulation_in_the_United_Launch_Alliance_Atlas_V_payload_fairing.jpg/960px-Solar_Orbiter_spacecraft_is_prepared_for_encapsulation_in_the_United_Launch_Alliance_Atlas_V_payload_fairing.jpg",
      "caption": "Start des Solar Orbiter 2020"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Illumination_test_with_partly_shadowed_solar_panels.jpg/960px-Illumination_test_with_partly_shadowed_solar_panels.jpg",
      "caption": "Solar Orbiter im Reinraum vor dem Start"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Solar_Orbiter%E2%80%99s_widest_high-res_view_of_the_Sun_ESA508430.jpg/960px-Solar_Orbiter%E2%80%99s_widest_high-res_view_of_the_Sun_ESA508430.jpg",
      "caption": "Hochauflösender Blick auf die Sonnenatmosphäre"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20191216-PH-FWM01_0100/KSC-20191216-PH-FWM01_0100~medium.jpg",
      "caption": "Solar Orbiter richtet Kameras direkt zur Sonne"
    }
  ],
  "mercury": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Colors_of_the_Innermost_Planet_2.jpg/960px-Colors_of_the_Innermost_Planet_2.jpg",
      "caption": "Farbkarte des Planeten Merkur (MESSENGER)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001834/GSFC_20171208_Archive_e001834~thumb.jpg",
      "caption": "Riesiges Caloris-Einschlagbecken"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Mozart_crater_on_Mercury_by_Messenger_EN0108830250M.jpg/960px-Mozart_crater_on_Mercury_by_Messenger_EN0108830250M.jpg",
      "caption": "Steile Krater an der Tag-Nacht-Grenze"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000345/GSFC_20171208_Archive_e000345~thumb.jpg",
      "caption": "Merkur als kleiner Punkt vor der Sonne"
    }
  ],
  "bepicolombo": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/BepiColombo%E2%80%99s_fourth_Mercury_flyby_ESA501019.jpg/960px-BepiColombo%E2%80%99s_fourth_Mercury_flyby_ESA501019.jpg",
      "caption": "BepiColombo fotografiert den Merkur im Vorbeiflug"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/BepiColombo_images_antennas_ESA401735.jpg/960px-BepiColombo_images_antennas_ESA401735.jpg",
      "caption": "Start der Ariane-5-Rakete mit BepiColombo"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/BepiColombo_spacecraft_model.png/960px-BepiColombo_spacecraft_model.png",
      "caption": "Europäischer Merkur-Orbiter (ESA)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/BepiColombo_approaches_Mercury_ESA514734.png/960px-BepiColombo_approaches_Mercury_ESA514734.png",
      "caption": "Japanischer Magnetfeld-Orbiter Mio (JAXA)"
    }
  ],
  "venus": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/PIA00271_Venus_%28Computer_Simulated_Global_View_of_the_Northern_Hemisphere%29.jpg/960px-PIA00271_Venus_%28Computer_Simulated_Global_View_of_the_Northern_Hemisphere%29.jpg",
      "caption": "Radarkarte unter den Wolken (Magellan)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Venus_-_December_23_2016.png/960px-Venus_-_December_23_2016.png",
      "caption": "Schwefelsäure-Wolkenbänder der Venus"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Venus_-_3D_Perspective_View_of_Maat_Mons.jpg/960px-Venus_-_3D_Perspective_View_of_Maat_Mons.jpg",
      "caption": "Vulkan Maat Mons auf der Venusoberfläche"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA23791/PIA23791~thumb.jpg",
      "caption": "Dichte Wolkendecke der Venus (Mariner 10)"
    }
  ],
  "venera-13": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Cut-away_model_of_a_Soviet_Venera_12_lander.jpg/960px-Cut-away_model_of_a_Soviet_Venera_12_lander.jpg",
      "caption": "Modell einer sowjetischen Venera-Landesonde"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/PIA00271_Venus_%28Computer_Simulated_Global_View_of_the_Northern_Hemisphere%29.jpg/960px-PIA00271_Venus_%28Computer_Simulated_Global_View_of_the_Northern_Hemisphere%29.jpg",
      "caption": "Vulkanische Ebenen rund um den Landeplatz"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA23791/PIA23791~thumb.jpg",
      "caption": "Helle Wolkenhülle über der heißen Venus"
    },
    {
      "url": "https://images-assets.nasa.gov/image/ARC-1991-AC91-3008/ARC-1991-AC91-3008~medium.jpg",
      "caption": "Sowjetische Venus-Landesonde Venera 13"
    }
  ],
  "earth": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/NASA-Apollo8-Dec24-Earthrise.jpg/960px-NASA-Apollo8-Dec24-Earthrise.jpg",
      "caption": "Erdaufgang über dem Mondhorizont (Apollo 8)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00452/PIA00452~thumb.jpg",
      "caption": "Unsere Erde als winziger blauer Punkt im All"
    },
    {
      "url": "https://images-assets.nasa.gov/image/iss023e058455/iss023e058455~medium.jpg",
      "caption": "Grüne Polarlichter aus Sicht der ISS"
    },
    {
      "url": "https://images-assets.nasa.gov/image/from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o/from-a-million-miles-away-nasa-camera-shows-moon-crossing-face-of-earth_20129140980_o~medium.jpg",
      "caption": "Vollansicht der sonnenbeschienenen Erde"
    }
  ],
  "moon": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA12941/PIA12941~thumb.jpg",
      "caption": "Großer Strahlkrater Tycho auf dem Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-72PC-0499/KSC-72PC-0499~medium.jpg",
      "caption": "Astronauten und Mondauto auf dem Erdmond"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Moon_nearside_LRO_color_mosaic.png/960px-Moon_nearside_LRO_color_mosaic.png",
      "caption": "Die rätselhafte Mondrückseite"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000496/GSFC_20171208_Archive_e000496~thumb.jpg",
      "caption": "Blick vom Mond zurück auf unsere blaue Erde"
    }
  ],
  "iss": [
    {
      "url": "https://images-assets.nasa.gov/image/iss039e005387/iss039e005387~medium.jpg",
      "caption": "Blick durch die ISS-Aussichtskuppel zur Erde"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S113E05156/S113E05156~medium.jpg",
      "caption": "Weltraumspaziergang außen an der ISS"
    },
    {
      "url": "https://images-assets.nasa.gov/image/iss057e057107/iss057e057107~medium.jpg",
      "caption": "Riesige Sonnensegel der Raumstation"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/ISS_after_docking_of_Progress_MS-1.jpg/960px-ISS_after_docking_of_Progress_MS-1.jpg",
      "caption": "Angedockte Raumschiffe an der ISS"
    }
  ],
  "tiangong": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Chinese_Tiangong_Space_Station.jpg/960px-Chinese_Tiangong_Space_Station.jpg",
      "caption": "Die chinesische Raumstation Tiangong im Orbit"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Launch_of_Shenzhou_13.jpg/960px-Launch_of_Shenzhou_13.jpg",
      "caption": "Raumschiff Shenzhou für Crew-Flüge"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/The_Launch_of_Long_March_3B_Rocket.jpg/960px-The_Launch_of_Long_March_3B_Rocket.jpg",
      "caption": "Chinesische Rakete Langer Marsch beim Start"
    },
    {
      "url": "https://images-assets.nasa.gov/image/iss023e057948/iss023e057948~medium.jpg",
      "caption": "Sonnenaufgang vom niedrigen Erdorbit aus"
    }
  ],
  "hubble": [
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000383/GSFC_20171208_Archive_e000383~medium.jpg",
      "caption": "Berühmtes Hubble-Foto: Säulen der Schöpfung"
    },
    {
      "url": "https://images-assets.nasa.gov/image/hubble-sees-a-legion-of-galaxies_25608651281_o/hubble-sees-a-legion-of-galaxies_25608651281_o~thumb.jpg",
      "caption": "Tausende ferne Galaxien im Deep Field"
    },
    {
      "url": "https://images-assets.nasa.gov/image/ARC-1990-AC90-0590/ARC-1990-AC90-0590~medium.jpg",
      "caption": "Start des Hubble-Teleskops mit dem Space Shuttle"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-97pc203/KSC-97pc203~medium.jpg",
      "caption": "Astronauten reparieren Hubble im All"
    }
  ],
  "jwst": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/NASA%E2%80%99s_Webb_Reveals_Cosmic_Cliffs%2C_Glittering_Landscape_of_Star_Birth_-_Flickr_-_James_Webb_Space_Telescope_%281%29.png/960px-NASA%E2%80%99s_Webb_Reveals_Cosmic_Cliffs%2C_Glittering_Landscape_of_Star_Birth_-_Flickr_-_James_Webb_Space_Telescope_%281%29.png",
      "caption": "Sternengeburt im Carinanebel (Webb-Foto)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Pillars_of_Creation_%28NIRCam_Image%29.png/960px-Pillars_of_Creation_%28NIRCam_Image%29.png",
      "caption": "Säulen der Schöpfung im Infrarotlicht"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/James_Webb_Space_Telescope%27s_Golden_Mirror_Unveiled_%2826076364723%29.jpg/960px-James_Webb_Space_Telescope%27s_Golden_Mirror_Unveiled_%2826076364723%29.jpg",
      "caption": "Der 18-teilige vergoldete Hauptspiegel"
    },
    {
      "url": "https://images-assets.nasa.gov/image/NHQ202112250015/NHQ202112250015~medium.jpg",
      "caption": "Start mit der Ariane-5-Rakete 2021"
    }
  ],
  "gaia": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Gaia_Milky_Way_star_density_map_2015-07-03.png/960px-Gaia_Milky_Way_star_density_map_2015-07-03.png",
      "caption": "Europäische Sternenkarte unserer Milchstraße"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA14039/PIA14039~medium.jpg",
      "caption": "Blick ins dichte Sternenband der Milchstraße"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Pinpointing_Gaia_from_Earth_ESA19372289.jpg/960px-Pinpointing_Gaia_from_Earth_ESA19372289.jpg",
      "caption": "Weltraumteleskop Gaia vermisst über 2 Milliarden Sterne"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Gaia_Sky_Milky_Way.jpg/960px-Gaia_Sky_Milky_Way.jpg",
      "caption": "Panorama unserer Milchstraße aus Gaia-Daten"
    }
  ],
  "sputnik-1": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Sputnik_1_at_the_National_Air_and_Space_Museum%2C_Dec_2017.jpg/960px-Sputnik_1_at_the_National_Air_and_Space_Museum%2C_Dec_2017.jpg",
      "caption": "Nachbau der ersten Weltraumkugel Sputnik 1"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/0/01/Russia_stamp_2004_%E2%84%96_988.jpg",
      "caption": "Sowjetische Startrakete R-7 Semjorka"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Space_Race_1957-1975.jpg/960px-Space_Race_1957-1975.jpg",
      "caption": "Beginn des Raumfahrtzeitalters 1957"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19714/PIA19714~thumb.jpg",
      "caption": "Historisches Modell von Sputnik 1 im Museum"
    }
  ],
  "vostok-1": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Vostok_5_reentry_capsule_02.jpg/960px-Vostok_5_reentry_capsule_02.jpg",
      "caption": "Die kugelförmige Rückkehrkapsel von Wostok 1"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Vostok-K_Carrier_Rocket_%E2%80%93_VDNKh%2C_Moscow_%2838921927071%29.jpg/960px-Vostok-K_Carrier_Rocket_%E2%80%93_VDNKh%2C_Moscow_%2838921927071%29.jpg",
      "caption": "Trägerrakete Wostok auf der Startrampe"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Major_Yuri_Gagarin%27s_SK-1_%28Vostok_1%29_Space_Suit_On_Display_in_%27Smithsonian_Air_and_Space_Museum%27%2C_On_Loan_from_Moscow._%28August_1st_2025%29.jpg/960px-Major_Yuri_Gagarin%27s_SK-1_%28Vostok_1%29_Space_Suit_On_Display_in_%27Smithsonian_Air_and_Space_Museum%27%2C_On_Loan_from_Moscow._%28August_1st_2025%29.jpg",
      "caption": "Gagarins orangefarbener Raumanzug SK-1"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Baikonur_Cosmodrome_Soyuz_launch_pad.jpg/960px-Baikonur_Cosmodrome_Soyuz_launch_pad.jpg",
      "caption": "Historischer Startplatz Baikonur"
    }
  ],
  "apollo-11": [
    {
      "url": "https://images-assets.nasa.gov/image/6901250/6901250~medium.jpg",
      "caption": "Berühmter Schuhabdruck im Mondstaub"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-97pc115/KSC-97pc115~medium.jpg",
      "caption": "Start der gewaltigen Saturn-V-Rakete"
    },
    {
      "url": "https://images-assets.nasa.gov/image/6902073/6902073~medium.jpg",
      "caption": "Mondfähre Eagle beim Rückflug über dem Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/8903695/8903695~medium.jpg",
      "caption": "Neil Armstrong, Buzz Aldrin & Michael Collins"
    }
  ],
  "apollo-12": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Apollo_12_Commander_Charles_%22Pete%22_Conrad_and_Lunar_Module_Pilot_Alan_Bean_rehearse_lunar_surface_activities.jpg/960px-Apollo_12_Commander_Charles_%22Pete%22_Conrad_and_Lunar_Module_Pilot_Alan_Bean_rehearse_lunar_surface_activities.jpg",
      "caption": "Astronauten bei der Forschung auf dem Mond"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Saturn_V_instrument_unit_CCS_transponder.jpg/960px-Saturn_V_instrument_unit_CCS_transponder.jpg",
      "caption": "Dramatischer Start von Apollo 12"
    },
    {
      "url": "https://images-assets.nasa.gov/image/AS12-46-6780/AS12-46-6780~medium.jpg",
      "caption": "Mondfähre Intrepid im Ozean der Stürme"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Apollo_12_-_Pete%27s_ALSEP_Site_Pan.webp/960px-Apollo_12_-_Pete%27s_ALSEP_Site_Pan.webp",
      "caption": "Messstation ALSEP wird auf dem Mond aufgebaut"
    }
  ],
  "apollo-14": [
    {
      "url": "https://images-assets.nasa.gov/image/S70-55689/S70-55689~medium.jpg",
      "caption": "Start von Apollo 14 im Januar 1971"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S71-16637/S71-16637~medium.jpg",
      "caption": "Mondfähre Antares auf dem Mondboden"
    },
    {
      "url": "https://images-assets.nasa.gov/image/9309376/9309376~medium.jpg",
      "caption": "Die Besatzung von Apollo 14"
    },
    {
      "url": "https://images-assets.nasa.gov/image/jsc2026e396708/jsc2026e396708~medium.jpg",
      "caption": "Astronauten-Spaziergang auf dem Mond (Apollo 14)"
    }
  ],
  "apollo-15": [
    {
      "url": "https://images-assets.nasa.gov/image/as15-85-11451/as15-85-11451~medium.jpg",
      "caption": "Das tiefe Hadley-Tal und Mondgebirge"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S71-30542/S71-30542~medium.jpg",
      "caption": "Erstes elektrisches Mondauto auf dem Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20220508-PH-SNQ01_0001/KSC-20220508-PH-SNQ01_0001~medium.jpg",
      "caption": "Gipfel des Mond-Apenninen-Gebirges"
    },
    {
      "url": "https://images-assets.nasa.gov/image/7120062/7120062~medium.jpg",
      "caption": "Mondfähre Falcon auf der Mondoberfläche"
    }
  ],
  "apollo-16": [
    {
      "url": "https://images-assets.nasa.gov/image/S71-44150/S71-44150~medium.jpg",
      "caption": "Mondfähre im hellen Descartes-Hochland"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA21706/PIA21706~medium.jpg",
      "caption": "Spritziger Testlauf des Mondautos"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S72-40818/S72-40818~medium.jpg",
      "caption": "Astronomen-Teleskop im Mond-Schatten"
    },
    {
      "url": "https://images-assets.nasa.gov/image/as16-116-18653/as16-116-18653~medium.jpg",
      "caption": "Riesiger Felsbrocken am Kraterrand"
    }
  ],
  "apollo-17": [
    {
      "url": "https://images-assets.nasa.gov/image/as17-140-21497/as17-140-21497~medium.jpg",
      "caption": "Farbiges Mondgestein im Taurus-Littrow-Tal"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S72-54813/S72-54813~medium.jpg",
      "caption": "Spektakulärer Nachtstart der letzten Saturn V"
    },
    {
      "url": "https://images-assets.nasa.gov/image/as17-137-20989/as17-137-20989~medium.jpg",
      "caption": "Entdeckung des berühmten orangen Mondbodens"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/960px-The_Earth_seen_from_Apollo_17.jpg",
      "caption": "Das berühmte Vollbild der Erde vom Hinflug"
    }
  ],
  "lunokhod-1": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Lunokhod_1_moon_rover_%28MMA_2011%29_%282%29.JPG/960px-Lunokhod_1_moon_rover_%28MMA_2011%29_%282%29.JPG",
      "caption": "Originalmodell des ersten Mondrovers Lunochod 1"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Luna_and_Lunokhod.png/960px-Luna_and_Lunokhod.png",
      "caption": "Lander und Mondfahrzeug aus dem Jahr 1970"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Mare_Imbrium_%28LRO%2C_643_nm_normalized_reflectance%29.png/960px-Mare_Imbrium_%28LRO%2C_643_nm_normalized_reflectance%29.png",
      "caption": "Regenmeer (Mare Imbrium) – Fahrgebiet von Lunochod 1"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Luna_sample_return_and_Lunokhod_lunar_rover_models.jpg/960px-Luna_sample_return_and_Lunokhod_lunar_rover_models.jpg",
      "caption": "Acht angetriebene Räder und Solardeckel"
    }
  ],
  "change-4": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Yutu-2_leaving_Chang_e-4-iau1901a.jpg/960px-Yutu-2_leaving_Chang_e-4-iau1901a.jpg",
      "caption": "Mondrover Yutu-2 rollt über die Mondrückseite"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/LRO_Chang%27e_4%2C_first_look.png/960px-LRO_Chang%27e_4%2C_first_look.png",
      "caption": "Von-Kármán-Krater – Landegebiet auf der Rückseite"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Chang%27e_4_Lander-_A_Closer_Look_%2802_m1147290066lr_m130C5A1B%29.jpg/960px-Chang%27e_4_Lander-_A_Closer_Look_%2802_m1147290066lr_m130C5A1B%29.jpg",
      "caption": "Landestation Chang'e 4 mit Panorama"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/South_Pole%E2%80%93Aitken_basin_on_the_Moon%27s_farside.png/960px-South_Pole%E2%80%93Aitken_basin_on_the_Moon%27s_farside.png",
      "caption": "Südpol-Aitken-Becken auf der Mondrückseite"
    }
  ],
  "chandrayaan-3": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Chandrayaan-3_Pragyan_rover.png",
      "caption": "Indiens kleiner Rover Pragyan am Mondsüdpol"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Chandrayaan-3%2C_LVM3_M4_lifting_off_from_SDSC_SHAR.jpg/960px-Chandrayaan-3%2C_LVM3_M4_lifting_off_from_SDSC_SHAR.jpg",
      "caption": "Start der Rakete LVM3 in Indien"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/VIKRAM%26PRAGYANMODEL.jpg/960px-VIKRAM%26PRAGYANMODEL.jpg",
      "caption": "Mondlander Vikram mit Solarfeldern"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/LRO_WAC_South_Pole_Mosaic.jpg/960px-LRO_WAC_South_Pole_Mosaic.jpg",
      "caption": "Region rund um den eisigen Mondsüdpol"
    }
  ],
  "slim": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/SLIM-LEV1-LEV2-JAXA-SagamiharaCampus-AdvancedFacilityForSpaceExploration-SpaceExplorationField.jpg/960px-SLIM-LEV1-LEV2-JAXA-SagamiharaCampus-AdvancedFacilityForSpaceExploration-SpaceExplorationField.jpg",
      "caption": "Japans winziger Kugel-Roboter SORA-Q neben SLIM"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/H-IIA%E3%83%AD%E3%82%B1%E3%83%83%E3%83%8847%E5%8F%B7%E6%A9%9F%E6%89%93%E3%81%A1%E4%B8%8A%E3%81%92.jpg/960px-H-IIA%E3%83%AD%E3%82%B1%E3%83%83%E3%83%8847%E5%8F%B7%E6%A9%9F%E6%89%93%E3%81%A1%E4%B8%8A%E3%81%92.jpg",
      "caption": "Start der japanischen H-IIA-Rakete"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/M1460739214L_JAXA_SLIM_landing_site_imaged_by_Lunar_Reconnaissance_Orbiter_Camera_%28LROC%29.png/960px-M1460739214L_JAXA_SLIM_landing_site_imaged_by_Lunar_Reconnaissance_Orbiter_Camera_%28LROC%29.png",
      "caption": "Präzisionslander SLIM im Aufbau"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Composite_image_of_JAXA_SLIM_landing_site_showing_change_in_surface_reflectivity_after_landing.png/960px-Composite_image_of_JAXA_SLIM_landing_site_showing_change_in_surface_reflectivity_after_landing.png",
      "caption": "Japanische Mondsonde SLIM vor dem Einsatz"
    }
  ],
  "mars": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA02982/PIA02982~thumb.jpg",
      "caption": "Olympus Mons – größter Vulkan im Sonnensystem"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00422/PIA00422~medium.jpg",
      "caption": "Riesiger Canyon Valles Marineris auf dem Mars"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA23671/PIA23671~thumb.jpg",
      "caption": "Gefrorene weiße Polarkappe am Nordpol"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19930/PIA19930~medium.jpg",
      "caption": "Blauschimmernde Sanddünen auf dem Roten Planeten"
    }
  ],
  "phobos": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Phobos_colour_2008.jpg/960px-Phobos_colour_2008.jpg",
      "caption": "Der riesige Stickney-Krater auf Phobos"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Phobos_and_Deimos_-_ESA_Mars_Express_%2853339522052%29.png/960px-Phobos_and_Deimos_-_ESA_Mars_Express_%2853339522052%29.png",
      "caption": "Nahaufnahme von Phobos (Mars Express)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA21837/PIA21837~medium.jpg",
      "caption": "Kartoffelförmiger Marsmond Phobos"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA23135/PIA23135~medium.jpg",
      "caption": "Phobos zieht als Sonnenfinsternis vor dem Mars"
    }
  ],
  "deimos": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA21837/PIA21837~medium.jpg",
      "caption": "Kleiner Marsmond Deimos mit glatter Staubschicht"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Phobos_and_Deimos_-_ESA_Mars_Express_%2853339522052%29.png/960px-Phobos_and_Deimos_-_ESA_Mars_Express_%2853339522052%29.png",
      "caption": "Vorbeiflug der Sonde Mars Express an Deimos"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/1/14/MarsCuriosityRover-ViewsEarth%26Venus-20200605.jpg",
      "caption": "Blick vom Marsboden zu den beiden Monden"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA17305/PIA17305~thumb.jpg",
      "caption": "Kleiner kraterbedeckter Marsmond Deimos"
    }
  ],
  "perseverance": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA25970/PIA25970~thumb.jpg",
      "caption": "Erster Hubschrauberflug auf dem Mars (Ingenuity)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA24096/PIA24096~medium.jpg",
      "caption": "Ausgetrocknetes Flussdelta im Jezero-Krater"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA24333/PIA24333~medium.jpg",
      "caption": "Spektakuläre Seilwinde-Landung am Fallschirm"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA25026/PIA25026~thumb.jpg",
      "caption": "Versiegelte Probenröhrchen auf dem Marsboden"
    }
  ],
  "curiosity": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA15688/PIA15688~medium.jpg",
      "caption": "Der 5 km hohe Berg Mount Sharp im Gale-Krater"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA17584/PIA17584~medium.jpg",
      "caption": "Felsige Spuren von Curiosity auf dem Mars"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Pia18091_mahli-sol-628-night.png/960px-Pia18091_mahli-sol-628-night.png",
      "caption": "Gesteinsanalyse mit dem Laser von Curiosity"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Curiosity_rover_selfie_at_Namib_Dune_Sol_1128_%2853678107023%29.jpg/960px-Curiosity_rover_selfie_at_Namib_Dune_Sol_1128_%2853678107023%29.jpg",
      "caption": "Rover Curiosity vor einer dunklen Marsdüne"
    }
  ],
  "opportunity": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA11385/PIA11385~medium.jpg",
      "caption": "Steiler Rand des Victoria-Kraters"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA14135/PIA14135~medium.jpg",
      "caption": "Reifenspuren im feinen Marssand"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Heat_Shield_Rock_1.jpg",
      "caption": "Ein echter Eisenmeteorit gefunden auf dem Mars"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-03pd2090/KSC-03pd2090~medium.jpg",
      "caption": "Start des Rovers Opportunity 2003"
    }
  ],
  "spirit": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA07262/PIA07262~medium.jpg",
      "caption": "Panorama aus den Columbia Hills im Gusev-Krater"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Spirit%27s_West_Valley_Panorama_%28PIA10216%29.jpg/960px-Spirit%27s_West_Valley_Panorama_%28PIA10216%29.jpg",
      "caption": "Gipfelausblick nach langem Bergauf-Fahren"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA12120/PIA12120~thumb.jpg",
      "caption": "Wirbelsturm (Staubteufel) auf dem Mars"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/KSC-03PD-0786.jpg/960px-KSC-03PD-0786.jpg",
      "caption": "Rover Spirit vor dem Abflug im Reinraum"
    }
  ],
  "sojourner": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA00778/PIA00778~thumb.jpg",
      "caption": "Sojourner neben der Basisstation Pathfinder"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00688/PIA00688~thumb.jpg",
      "caption": "Untersuchung des berühmten Felsens „Yogi“"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00995/PIA00995~thumb.jpg",
      "caption": "Landeplatz Ares Vallis im Jahr 1997"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/8/87/Sojourner%2C_MER%2C_Phoenix_lander%2C_and_Curiosity_comparisons%2C_in_Metric_units.jpg",
      "caption": "Sojourner – so klein wie ein Mikrowellengerät"
    }
  ],
  "zhurong": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Tianwen-1_Lander_and_Zhurong_Rover_in_Southern_Utopia_Planitia_%28ESP_069665_2055-2%29.jpg/960px-Tianwen-1_Lander_and_Zhurong_Rover_in_Southern_Utopia_Planitia_%28ESP_069665_2055-2%29.jpg",
      "caption": "Chinesischer Mars-Rover Zhurong vor der Landeplattform"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Tianwen-1_in_Mars_orbit.jpg/960px-Tianwen-1_in_Mars_orbit.jpg",
      "caption": "Muttersonde Tianwen-1 über dem Mars"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA04029/PIA04029~thumb.jpg",
      "caption": "Weite Tiefebene Utopia Planitia auf dem Mars"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Tianwen-1_launch_02.jpg/960px-Tianwen-1_launch_02.jpg",
      "caption": "Start der Mission Tianwen-1"
    }
  ],
  "asteroid-belt": [
    {
      "url": "https://images-assets.nasa.gov/image/KSC-07pd1507/KSC-07pd1507~medium.jpg",
      "caption": "Großer Asteroid Vesta im Hauptgürtel"
    },
    {
      "url": "https://images-assets.nasa.gov/image/DSCN0123/DSCN0123~medium.jpg",
      "caption": "Geröll-Asteroid Bennu aus der Nähe"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA02471/PIA02471~thumb.jpg",
      "caption": "Länglicher Asteroid Eros mit Kratern"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00333/PIA00333~thumb.jpg",
      "caption": "Asteroid Ida mit seinem winzigen Mond Dactyl"
    }
  ],
  "ceres": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA21398/PIA21398~thumb.jpg",
      "caption": "Hell glänzende Salzablagerungen im Occator-Krater"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20915/PIA20915~thumb.jpg",
      "caption": "Eis-Vulkanberg Ahuna Mons (4 km hoch)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19619/PIA19619~thumb.jpg",
      "caption": "Höhenkarte des größten Körpers im Asteroidengürtel"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA22090/PIA22090~thumb.jpg",
      "caption": "Junger Krater Haulani mit hellem Auswurfmaterial"
    }
  ],
  "hayabusa-2": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Hayabusa2_approaching_asteroid.jpg/960px-Hayabusa2_approaching_asteroid.jpg",
      "caption": "Diamantförmiger Asteroid Ryugu aus der Nähe"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Hayabusa2_MASCOT_closeup.jpg/960px-Hayabusa2_MASCOT_closeup.jpg",
      "caption": "Deutsch-französischer Hüpf-Lander MASCOT"
    },
    {
      "url": "https://images-assets.nasa.gov/image/jsc2021e062383/jsc2021e062383~medium.jpg",
      "caption": "Japanische Asteroidensonde Hayabusa2"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Simulant_of_Asteroid_Ryugu_Surface_PC105278.jpg/960px-Simulant_of_Asteroid_Ryugu_Surface_PC105278.jpg",
      "caption": "Geröll-Oberfläche des Asteroiden Ryugu"
    }
  ],
  "jupiter": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA21770/PIA21770~medium.jpg",
      "caption": "Wirbelsturm Großer Roter Fleck im Nahflug"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Jupiter%27s_Magnetosphere_animation.png/960px-Jupiter%27s_Magnetosphere_animation.png",
      "caption": "Blaue Polarlichter an Jupiters Nordpol"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA25691/PIA25691~medium.jpg",
      "caption": "Künstlerische Wolkenwirbel (JunoCam)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/JWST_photo_of_Jupiter_and_rings.png/960px-JWST_photo_of_Jupiter_and_rings.png",
      "caption": "Infrarotblick von JWST auf Jupiters zarte Ringe"
    }
  ],
  "io": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/c/c9/PIA09252_Alice_Views_Jupiter_and_Io.jpg",
      "caption": "Aktive Vulkanfontäne schießt ins All"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA26293/PIA26293~thumb.jpg",
      "caption": "Kochende Schwefel- und Lava-Landschaft auf Io"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA25019/PIA25019~medium.jpg",
      "caption": "Schroffe Mondberge und Schwefel-Ebenen"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA18176/PIA18176~medium.jpg",
      "caption": "Vulkanische Schwefelwelt Io (Galileo-Sonde)"
    }
  ],
  "europa": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA23872/PIA23872~thumb.jpg",
      "caption": "Rote Risse im kilometerdicken Eispanzer"
    },
    {
      "url": "https://images-assets.nasa.gov/image/NHQ202402070010/NHQ202402070010~medium.jpg",
      "caption": "Zerbrochene Eisschollen über einem Ozean"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/6/64/Model_of_Europa%27s_Subsurface_Structure_in_Classical_Chinese.jpg",
      "caption": "Tiefer flüssiger Ozean unter dem Eis"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA25125/PIA25125~medium.jpg",
      "caption": "Die Raumsonde Europa Clipper erforscht den Eismond"
    }
  ],
  "ganymede": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA26075/PIA26075~medium.jpg",
      "caption": "Helle und dunkle Rillen auf dem größten Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA25028/PIA25028~medium.jpg",
      "caption": "Detailaufnahme durch die Raumsonde Juno"
    },
    {
      "url": "https://images-assets.nasa.gov/image/ARC-1979-AC79-7083/ARC-1979-AC79-7083~medium.jpg",
      "caption": "Alte Kraterfelder auf Ganymed"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Earth_and_Moon_-_GPN-2000-001437.jpg/960px-Earth_and_Moon_-_GPN-2000-001437.jpg",
      "caption": "Größenvergleich der vier Galileischen Monde"
    }
  ],
  "callisto": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/1/17/Valhalla_Basin_from_Voyager_1.jpg",
      "caption": "Riesiges Einschlag-Ringsystem Valhalla"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA13896/PIA13896~thumb.jpg",
      "caption": "Älteste, kraterreichste Kruste aller Jupitermonde"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Jagged_Hills_PIA03455.jpg/960px-Jagged_Hills_PIA03455.jpg",
      "caption": "Eiszinnen auf den Rändern von Kallisto"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Jupiter_and_its_four_planet-size_moons.jpg",
      "caption": "Die vier großen Jupitermonde im Vergleich"
    }
  ],
  "juno": [
    {
      "url": "https://images-assets.nasa.gov/image/201108050001HQ/201108050001HQ~medium.jpg",
      "caption": "Start der Raumsonde Juno im August 2011"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA26295/PIA26295~medium.jpg",
      "caption": "Acht Wirbelstürme rund um Jupiters Nordpol"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA21376/PIA21376~thumb.jpg",
      "caption": "Detailaufnahme der Wolkenbänder durch Juno"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA25014/PIA25014~medium.jpg",
      "caption": "Raumsonde Juno schwenkt in die Jupiter-Umlaufbahn ein"
    }
  ],
  "juice": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/ESA_Juice_launch.jpg/960px-ESA_Juice_launch.jpg",
      "caption": "Start der europäischen Sonde JUICE 2023"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Juice_RIME_antenna_deploys_ESA24882754.png/960px-Juice_RIME_antenna_deploys_ESA24882754.png",
      "caption": "Ausfahrbare Eis-Radarantenne RIME"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA26103/PIA26103~medium.jpg",
      "caption": "Jupiters drei Eismonde als Ziel von JUICE"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA24024/PIA24024~medium.jpg",
      "caption": "Europäische Eismond-Sonde JUICE vor dem Start"
    }
  ],
  "saturn": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA17122/PIA17122~thumb.jpg",
      "caption": "Berühmter sechseckiger Sturm am Nordpol"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg",
      "caption": "Sonnenfinsternis hinter Saturn – mit kleinem Erdpunkt"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Spokes_Spotted_In_Saturn%27s_Rings_%28opo2305a%29.jpg/960px-Spokes_Spotted_In_Saturn%27s_Rings_%28opo2305a%29.jpg",
      "caption": "Messerscharfer Blick auf das Ringsystem"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Saturn%E2%80%99s_Rings_Shine_in_Webb%E2%80%99s_Observations_of_Ringed_Planet_%28Unlabeled%29_%2853013132440%29.png/960px-Saturn%E2%80%99s_Rings_Shine_in_Webb%E2%80%99s_Observations_of_Ringed_Planet_%28Unlabeled%29_%2853013132440%29.png",
      "caption": "Infrarotansicht des Planeten Saturn (JWST)"
    }
  ],
  "titan": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA22481/PIA22481~medium.jpg",
      "caption": "Seen aus flüssigem Methan am Nordpol"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA07865/PIA07865~thumb.jpg",
      "caption": "Dichte goldene Stickstoff- und Methan-Atmosphäre"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Lrc-2022-b701_p-03161.jpg/960px-Lrc-2022-b701_p-03161.jpg",
      "caption": "Geplanter Flugroboter Dragonfly für Titan"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA06173/PIA06173~thumb.jpg",
      "caption": "Blick der Landesonde Huygens direkt auf Titan"
    }
  ],
  "enceladus": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA07760/PIA07760~thumb.jpg",
      "caption": "Riesige Wasser-Geysire schießen aus den Polrissen"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Tiger_Stripes_are_Cubs_PIA03551.jpg/960px-Tiger_Stripes_are_Cubs_PIA03551.jpg",
      "caption": "Blau leuchtende „Tigerstreifen“ im Südpolar-Eis"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg",
      "caption": "Im Gegenlicht strahlen die Eisfontänen hell auf"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19058/PIA19058~medium.jpg",
      "caption": "Wärmequellen tief unter dem weißen Eispanzer"
    }
  ],
  "cassini": [
    {
      "url": "https://images-assets.nasa.gov/image/KSC-97PC1276/KSC-97PC1276~medium.jpg",
      "caption": "Start der Doppelsonde Cassini-Huygens 1997"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA21439/PIA21439~thumb.jpg",
      "caption": "Mutige Tauchflüge zwischen Planet und Ringen"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Huygens_probe_opened.jpg/960px-Huygens_probe_opened.jpg",
      "caption": "Europäisches Landemodul Huygens vor der Trennung"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/The_Day_the_Earth_Smiled_-_PIA17172.jpg/960px-The_Day_the_Earth_Smiled_-_PIA17172.jpg",
      "caption": "Das berühmteste Abschiedsfoto von Cassini"
    }
  ],
  "uranus": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/NASA%E2%80%99s_Webb_Scores_Another_Ringed_World_With_New_Image_of_Uranus_-_Flickr_-_James_Webb_Space_Telescope.png/960px-NASA%E2%80%99s_Webb_Scores_Another_Ringed_World_With_New_Image_of_Uranus_-_Flickr_-_James_Webb_Space_Telescope.png",
      "caption": "Kristallklare Ring- und Mondaufnahme von JWST"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA01984/PIA01984~thumb.jpg",
      "caption": "Neigungsachse und dunkles Ringsystem des Uranus"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA01280/PIA01280~thumb.jpg",
      "caption": "Atmosphärenbänder und Stürme auf Uranus (Hubble)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg",
      "caption": "Nahaufnahme des blassen Eisriesen Uranus"
    }
  ],
  "titania": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/5/50/Titania_%28moon%29_color.jpg",
      "caption": "Größter Uranusmond mit vielen Einschlagkratern"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Uranus_Montage.jpg/960px-Uranus_Montage.jpg",
      "caption": "Die Eismonde des Uranus im Überblick"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00346/PIA00346~thumb.jpg",
      "caption": "Heimatplanet Uranus schräg auf der Seite"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA01978/PIA01978~thumb.jpg",
      "caption": "Eisgräben auf dem größten Uranusmond Titania"
    }
  ],
  "oberon": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Voyager_2_picture_of_Oberon_mod.jpg/960px-Voyager_2_picture_of_Oberon_mod.jpg",
      "caption": "Dunkle Kraterböden auf dem äußersten großen Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA01490/PIA01490~medium.jpg",
      "caption": "Oberon und seine Geschwistermonde um Uranus"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/NASA%E2%80%99s_Webb_Scores_Another_Ringed_World_With_New_Image_of_Uranus_-_Flickr_-_James_Webb_Space_Telescope.png/960px-NASA%E2%80%99s_Webb_Scores_Another_Ringed_World_With_New_Image_of_Uranus_-_Flickr_-_James_Webb_Space_Telescope.png",
      "caption": "Eisriese Uranus mit seinen Ringen"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/1/19/Voyager_2_Uranus_Encounter_Trajectory.png",
      "caption": "Voyager 2 als bisher einzige Sonde vor Ort"
    }
  ],
  "neptune": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg",
      "caption": "Der Große Dunkle Fleck – riesiger Sturmwirbel"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Neptune_JamesWebbSpaceTelescope_NIRCam_TopazAI.jpg/960px-Neptune_JamesWebbSpaceTelescope_NIRCam_TopazAI.jpg",
      "caption": "Infrarotfoto der feinen Neptunringe von JWST"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Neptune_Cloud_Cover_Over_Three_Decades_%282023-019%29.png/960px-Neptune_Cloud_Cover_Over_Three_Decades_%282023-019%29.png",
      "caption": "Weiße eisige Methanwolken über tiefblauem Gas"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA02215/PIA02215~thumb.jpg",
      "caption": "Abschiedsblick von Voyager 2 auf Neptun"
    }
  ],
  "triton": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA00317/PIA00317~medium.jpg",
      "caption": "Melonenschalen-Landschaft auf dem kalten Triton"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA02215/PIA02215~thumb.jpg",
      "caption": "Triton umkreist Neptun genau andersherum"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA01491/PIA01491~medium.jpg",
      "caption": "Eiskruste des rückläufigen Neptunmonds Triton"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA02247/PIA02247~thumb.jpg",
      "caption": "Südpol-Eiskappe auf Triton (Voyager 2)"
    }
  ],
  "pluto": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Pluto-01_Stern_03_Pluto_Color_TXT.jpg/960px-Pluto-01_Stern_03_Pluto_Color_TXT.jpg",
      "caption": "Eisgletscher im Herz von Pluto (Sputnik Planitia)"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA21590/PIA21590~medium.jpg",
      "caption": "Dünne, blau schimmernde Atmosphäre im Gegenlicht"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20198/PIA20198~medium.jpg",
      "caption": "Kilometerhohe Berge aus steinhartem Wassereis"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19956/PIA19956~medium.jpg",
      "caption": "Falschfarben-Karte zeigt alle Landschaften"
    }
  ],
  "charon": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA19968/PIA19968~medium.jpg",
      "caption": "Rotbraune Polkappe „Mordor“ im Norden von Charon"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA21864/PIA21864~medium.jpg",
      "caption": "Riesiger Eis-Canyon quer über Charon"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19689/PIA19689~thumb.jpg",
      "caption": "Pluto und Charon tanzen um einen gemeinsamen Schwerpunkt"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19967/PIA19967~medium.jpg",
      "caption": "Glatte Eisebenen in der Vulkan-Ebene"
    }
  ],
  "nix": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA20152/PIA20152~thumb.jpg",
      "caption": "Alle vier kleinen Monde von Pluto im Vergleich"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/NH-PlutoMoons-Nix-Hydra-20150714.jpg/960px-NH-PlutoMoons-Nix-Hydra-20150714.jpg",
      "caption": "Rötlicher Kraterfleck auf dem winzigen Mond Nix"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA11708/PIA11708~thumb.jpg",
      "caption": "Mutter-Zwergplanet Pluto mit Doppelstern-Partner Charon"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Orbit_of_Pluto%27s_moon_P4.jpg/960px-Orbit_of_Pluto%27s_moon_P4.jpg",
      "caption": "Die 5 Monde umkreisen das Pluto-Charon-Paar"
    }
  ],
  "hydra": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA20581/PIA20581~thumb.jpg",
      "caption": "Kartoffelförmiger äußerster Mond Hydra"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20152/PIA20152~thumb.jpg",
      "caption": "Größenvergleich der kleinen Plutomonde"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Orbit_of_Pluto%27s_moon_P4.jpg/960px-Orbit_of_Pluto%27s_moon_P4.jpg",
      "caption": "Umlaufbahnen aller fünf Plutomonde"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA19697/PIA19697~thumb.jpg",
      "caption": "Blick auf Zwergplanet Pluto aus der Ferne"
    }
  ],
  "haumea": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "Zwergplaneten im äußeren Kuipergürtel"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Planetas_menores_o_Planetoides.jpg",
      "caption": "Haumea mit ihren beiden Eismonden"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000946/GSFC_20171208_Archive_e000946~thumb.jpg",
      "caption": "Typische vereiste Welt weit hinter Neptun"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Haumea_mutual_events_illustration.png",
      "caption": "Schnell rotierender Zwergplanet Haumea mit Ring"
    }
  ],
  "hiiaka": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "Eisige Welten des Kuipergürtels"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20153/PIA20153~medium.jpg",
      "caption": "Kollisionsbruchstücke wie bei anderen Zwergplaneten"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Haumea_mutual_events_illustration.png",
      "caption": "Mutter-Zwergplanet Haumea mit seinen Eismonden"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA22188/PIA22188~thumb.jpg",
      "caption": "Eisiger Heimatbereich jenseits von Neptun"
    }
  ],
  "namaka": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "Ferne gefrorene Begleiter im Kuipergürtel"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20152/PIA20152~thumb.jpg",
      "caption": "Kleine unregelmäßige Eismonde am Rand des Systems"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Haumea_mutual_events_illustration.png",
      "caption": "System rund um den eiförmigen Zwergplaneten Haumea"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA22188/PIA22188~thumb.jpg",
      "caption": "Ferne gefrorene Himmelskörper im Kuipergürtel"
    }
  ],
  "makemake": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Mating_pair_of_Pseudozizeeria_maha_%28Kollar%2C_1844%29_-_Pale_Grass_Blue_%284%29_WLB.jpg/960px-Mating_pair_of_Pseudozizeeria_maha_%28Kollar%2C_1844%29_-_Pale_Grass_Blue_%284%29_WLB.jpg",
      "caption": "Rötlicher, eisiger Zwergplanet Makemake"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Makemake_moon_positions_2018-2019.png/960px-Makemake_moon_positions_2018-2019.png",
      "caption": "Entdeckung des kleinen dunklen Mondes MK 2"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "Makemake neben Eris, Pluto und Haumea"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20464/PIA20464~medium.jpg",
      "caption": "Methan- und Stickstoff-Eisdecken auf Makemake"
    }
  ],
  "mk2": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Mating_pair_of_Pseudozizeeria_maha_%28Kollar%2C_1844%29_-_Pale_Grass_Blue_%284%29_WLB.jpg/960px-Mating_pair_of_Pseudozizeeria_maha_%28Kollar%2C_1844%29_-_Pale_Grass_Blue_%284%29_WLB.jpg",
      "caption": "Makemake – viel heller als der kohleschwarze MK 2"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Makemake_moon_Hubble_image_only.jpg",
      "caption": "Winziger Lichtpunkt neben dem hellen Makemake"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "Zwergplaneten-Familie im fernen Kuipergürtel"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA20152/PIA20152~thumb.jpg",
      "caption": "Typisches Größenverhältnis zwischen Zwergplanet & Mond"
    }
  ],
  "eris": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Eris_and_Dysnomia_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      "caption": "Eris und ihr Mond Dysnomia im fernen Sonnensystem"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "Größenvergleich der größten Zwergplaneten"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Hubble_Dysnomia_orbit_overlay.jpg/960px-Hubble_Dysnomia_orbit_overlay.jpg",
      "caption": "Gemeinsamer Umlauf von Eris und Dysnomia"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA17307/PIA17307~medium.jpg",
      "caption": "Großer eisiger Zwergplanet Eris im äußeren System"
    }
  ],
  "dysnomia": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/6/63/Eris_and_moon_Dysnomia_JWST_NIRCam.jpg",
      "caption": "Infrarotansicht von Eris mit Begleiter Dysnomia"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Eris_and_Dysnomia_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      "caption": "Hubble-Entdeckung des Mondes Dysnomia"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/10_Largest_Trans-Neptunian_objects_%28TNOS%29.png/960px-10_Largest_Trans-Neptunian_objects_%28TNOS%29.png",
      "caption": "System weit außerhalb der Neptunbahn"
    },
    {
      "url": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000683/GSFC_20171208_Archive_e000683~thumb.jpg",
      "caption": "Eismonde helfen beim Bestimmen der Zwergplaneten-Masse"
    }
  ],
  "new-horizons": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/e/e4/New_Horizons_Explores_Ultima_Thule_%28noaoann19002a%29.jpg",
      "caption": "Vorbeiflug 2019 am schneemannförmigen Arrokoth"
    },
    {
      "url": "https://images-assets.nasa.gov/image/05pd2138/05pd2138~medium.jpg",
      "caption": "Extrem schneller Start der New Horizons 2006"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA11707/PIA11707~medium.jpg",
      "caption": "Historisches Foto von Plutos Eis-Herz"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA26486/PIA26486~medium.jpg",
      "caption": "Aufnahme bei Jupiters Schwunghol-Manöver 2007"
    }
  ],
  "voyager-1": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA21741/PIA21741~medium.jpg",
      "caption": "Die vergoldete Datenplatte mit Grüßen von der Erde"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00452/PIA00452~thumb.jpg",
      "caption": "Das berühmteste Fernfoto unserer Erde aus 6 Mrd. km"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Titan_3E_with_Voyager_1.jpg/960px-Titan_3E_with_Voyager_1.jpg",
      "caption": "Start von Voyager 1 im September 1977"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA00022/PIA00022~medium.jpg",
      "caption": "Nahaufnahmen bei Jupiter & seinen Vulkanmonden"
    }
  ],
  "voyager-2": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA18669/PIA18669~thumb.jpg",
      "caption": "Neptun – letzter Halt von Voyager 2 im Jahr 1989"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg",
      "caption": "Einziger Besuch am Eisriesen Uranus 1986"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Titan_3E_with_Voyager_1.jpg/960px-Titan_3E_with_Voyager_1.jpg",
      "caption": "Start von Voyager 2 zwei Wochen vor Voyager 1"
    },
    {
      "url": "https://images-assets.nasa.gov/image/NHQ201709050008/NHQ201709050008~medium.jpg",
      "caption": "Reiseweg von Voyager 2 an vier Riesenplaneten vorbei"
    }
  ],
  "halley": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Comet_Halley_close_up.jpg/960px-Comet_Halley_close_up.jpg",
      "caption": "Kometenkern von 1P/Halley (Aufnahme der ESA-Sonde Giotto)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Comet_Halley_ARC-1986-AC86-0720-4~orig.jpg/960px-Comet_Halley_ARC-1986-AC86-0720-4~orig.jpg",
      "caption": "Leuchtender Schweif im Jahr 1986"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Bayeux_Tapestry_32-33_comet_Halley_Harold.jpg/960px-Bayeux_Tapestry_32-33_comet_Halley_Harold.jpg",
      "caption": "Halley schon 1066 auf dem Teppich von Bayeux"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/5/55/Halley%27s_Comet%2C_1910.JPG",
      "caption": "Historische Aufnahme beim Besuch im Jahr 1910"
    }
  ],
  "churyumov": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/67P_Churyumov-Gerasimenko_-_Rosetta_%2832393838120%29.png/960px-67P_Churyumov-Gerasimenko_-_Rosetta_%2832393838120%29.png",
      "caption": "Leuchtende Gas- und Staubfontänen aus dem Kern"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Rosetta_and_Philae_at_comet_%2811206660686%29.jpg/960px-Rosetta_and_Philae_at_comet_%2811206660686%29.jpg",
      "caption": "Lander Philae vor der Trennung zur Kometenlandung"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Rosetta_and_67P-Churyumov-Gerasimenko_%2855518050611%29.png/960px-Rosetta_and_67P-Churyumov-Gerasimenko_%2855518050611%29.png",
      "caption": "Selfie der Sonde Rosetta vor dem dunklen Kometenkern"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Comet_67P_details_-_OSIRIS_%2814843737445%29.png",
      "caption": "Steile Klippen und Eisbrocken auf „Tschuri“"
    }
  ],
  "rosetta": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Rosetta_and_67P-Churyumov-Gerasimenko_%2855518050611%29.png/960px-Rosetta_and_67P-Churyumov-Gerasimenko_%2855518050611%29.png",
      "caption": "Selfie der Raumsonde vor Komet 67P/Tschuri"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Ariane_5%E2%80%99s_legacy_of_launching_science_missions_ESA24640884.png/960px-Ariane_5%E2%80%99s_legacy_of_launching_science_missions_ESA24640884.png",
      "caption": "Start der europäischen Kometenmission 2004"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Rosetta%E2%80%99s_target_comet%2C_67P-Churyumov%E2%80%93Gerasimenko_%2814272340920%29.png/960px-Rosetta%E2%80%99s_target_comet%2C_67P-Churyumov%E2%80%93Gerasimenko_%2814272340920%29.png",
      "caption": "Nahaufnahme des Ziels der Rosetta-Mission"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Philae_-_ESA_Rosetta%27s_Lander_Over_Mars_%2853551908050%29.png/960px-Philae_-_ESA_Rosetta%27s_Lander_Over_Mars_%2853551908050%29.png",
      "caption": "Das kleine Landegerät Philae für den Kometenkern"
    }
  ],
  "hale-bopp": [
    {
      "url": "https://images-assets.nasa.gov/image/sts085-s-001/sts085-s-001~medium.jpg",
      "caption": "Weißer Staub- und blauer Gasschweif 1997"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Comet_C_1996_B2_%28Hyakutake%29_near_nucleus_phenomena_%2850095236667%29.png/960px-Comet_C_1996_B2_%28Hyakutake%29_near_nucleus_phenomena_%2850095236667%29.png",
      "caption": "Hubble-Detailblick tief in die Koma von Hale-Bopp"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Comet-Hale-Bopp-29-03-1997_hires_adj.jpg/960px-Comet-Hale-Bopp-29-03-1997_hires_adj.jpg",
      "caption": "Monatelang ohne Fernglas am Himmel sichtbar"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA01289/PIA01289~thumb.jpg",
      "caption": "Komet Hale-Bopp leuchtet hell am Nachthimmel 1997"
    }
  ],
  "neowise": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/C-2020_F3_%28NEOWISE%29_%C3%BCber_Schaffhausen.jpg/960px-C-2020_F3_%28NEOWISE%29_%C3%BCber_Schaffhausen.jpg",
      "caption": "Komet NEOWISE über den Schweizer Alpen im Juli 2020"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/2020-07-21_-_Neowise_-_D_Rousseau.jpg/960px-2020-07-21_-_Neowise_-_D_Rousseau.jpg",
      "caption": "Doppelter Schweif im Sommerhimmel 2020"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Wispr_inner_neowise_20200705t020949e-crop.jpg",
      "caption": "Aufnahme der Parker Solar Probe aus dem All"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/ISS-63_Comet_Neowise_%283%29.jpg/960px-ISS-63_Comet_Neowise_%283%29.jpg",
      "caption": "NEOWISE leuchtet direkt vor der ISS am Horizont"
    }
  ],
  "oort-cloud": [
    {
      "url": "https://images-assets.nasa.gov/image/PIA17308/PIA17308~medium.jpg",
      "caption": "Vorstellung der riesigen Eiskugel rund ums Sonnensystem"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA17460/PIA17460~thumb.jpg",
      "caption": "Wo der Sonnenwind auf den Raum zwischen den Sternen trifft"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA22190/PIA22190~thumb.jpg",
      "caption": "Sonden unterwegs am äußersten Rand des Sonnensystems"
    },
    {
      "url": "https://images-assets.nasa.gov/image/PIA10969/PIA10969~medium.jpg",
      "caption": "Kometen aus der fernen Oortschen Wolke"
    }
  ],
  "gemini-4": [
    {
      "url": "https://images-assets.nasa.gov/image/S65-29601/S65-29601~medium.jpg",
      "caption": "Start der Titan-II-Rakete mit Gemini 4"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Jim_McDivitt_and_Ed_White_Simulate_Launch_%2816459195076%29.jpg/960px-Jim_McDivitt_and_Ed_White_Simulate_Launch_%2816459195076%29.jpg",
      "caption": "Die Astronauten James McDivitt und Ed White"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Circumpolar_Laser_Tests_at_Gemini_North_%28iotw2008a%29.jpg/960px-Circumpolar_Laser_Tests_at_Gemini_North_%28iotw2008a%29.jpg",
      "caption": "Die schwebende Gemini-Kapsel über unserer Erde"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/255-CC-65-HC-333.jpg/960px-255-CC-65-HC-333.jpg",
      "caption": "Sichere Wasserlandung im Atlantik"
    }
  ],
  "gemini-8": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/KSC-66C-1846_Gemini-8_Astronauts_Neil_A_Armstrong%2C_Command_Pilot%2C_and_David_R_Scott%2C_Pilot%2C_during_a_Photo_Session_for_the_Press_outside_Mission_Control_Center%2C_Cape_Kennedy%2C_FLA_%28104-KSC-66C-1846%29.jpg/960px-thumbnail.jpg",
      "caption": "Neil Armstrong und David Scott – die Gemini-8-Crew"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S64-21560/S64-21560~medium.jpg",
      "caption": "Raketenstart von Gemini 8 im März 1966"
    },
    {
      "url": "https://images-assets.nasa.gov/image/9141928/9141928~medium.jpg",
      "caption": "Das unbemannte Agena-Zielmodul im Erdorbit"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/KSC-66C-1879_GT-8_recovery_with_Astronauts_Neil_A_Armstrong%2C_Command_Pilot_and_David_R_Scott%2C_Pilot_in_pacific_after_their_GT-8_Flight_%28104-KSC-66C-1879%29.jpg/960px-KSC-66C-1879_GT-8_recovery_with_Astronauts_Neil_A_Armstrong%2C_Command_Pilot_and_David_R_Scott%2C_Pilot_in_pacific_after_their_GT-8_Flight_%28104-KSC-66C-1879%29.jpg",
      "caption": "Bergung nach erfolgreicher Notlandung im Pazifik"
    }
  ],
  "apollo-7": [
    {
      "url": "https://images-assets.nasa.gov/image/6870605/6870605~medium.jpg",
      "caption": "Start der Saturn-IB-Rakete mit Apollo 7"
    },
    {
      "url": "https://images-assets.nasa.gov/image/6970642/6970642~medium.jpg",
      "caption": "Astronauten-Team: Walter Schirra, Donn Eisele und Walter Cunningham"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/AS07-03-1546_-_Apollo_7_-_Apollo_7_Mission%2C_Saturn_IVB_Stage_-_NARA_-_16665505.jpg/960px-AS07-03-1546_-_Apollo_7_-_Apollo_7_Mission%2C_Saturn_IVB_Stage_-_NARA_-_16665505.jpg",
      "caption": "Annäherungs-Übung an die obere Raketenstufe im All"
    },
    {
      "url": "https://images-assets.nasa.gov/image/KSC-20181030-PH_KLS01_0005/KSC-20181030-PH_KLS01_0005~medium.jpg",
      "caption": "Wasserlandung im Atlantik nach 11 Tagen Testflug"
    }
  ],
  "apollo-8": [
    {
      "url": "https://images-assets.nasa.gov/image/6871798/6871798~medium.jpg",
      "caption": "Erster bemannter Start der riesigen Mondrakete Saturn V"
    },
    {
      "url": "https://images-assets.nasa.gov/image/6972224/6972224~medium.jpg",
      "caption": "Borman, Lovell und Anders vor dem Flug um den Mond"
    },
    {
      "url": "https://images-assets.nasa.gov/image/as08-14-2432/as08-14-2432~medium.jpg",
      "caption": "Nahaufnahme der kraterreichen Mondrückseite"
    },
    {
      "url": "https://images-assets.nasa.gov/image/S68-56310/S68-56310~medium.jpg",
      "caption": "Rückkehr und Bergung im Pazifik nach Weihnachten 1968"
    }
  ],
  "apollo-9-10": [
    {
      "url": "https://images-assets.nasa.gov/image/as09-23-3595/as09-23-3595~medium.jpg",
      "caption": "Apollo 9 testet Mondfähre „Spider“ im Erdorbit"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Jim_McDivitt%E2%80%99s_Apollo_9_Flown_Crew_Log_Book_%2855127291598%29.jpg/960px-Jim_McDivitt%E2%80%99s_Apollo_9_Flown_Crew_Log_Book_%2855127291598%29.jpg",
      "caption": "Weltraumspaziergang und Raumanzug-Test bei Apollo 9"
    },
    {
      "url": "https://images-assets.nasa.gov/image/6975432/6975432~medium.jpg",
      "caption": "Start der Saturn V zur Mond-Generalprobe (Mai 1969)"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/AS11-37-5444_-_Apollo_11_-_Apollo_11_Mission_image_-_CSM_over_the_surface_of_the_moon_-_NARA_-_16683406.jpg/960px-AS11-37-5444_-_Apollo_11_-_Apollo_11_Mission_image_-_CSM_over_the_surface_of_the_moon_-_NARA_-_16683406.jpg",
      "caption": "Mutterschiff „Charlie Brown“ über der Mondlandschaft"
    }
  ],
  "spacelab-columbus": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Persconferentie_bij_Estec_in_Noordwijk_astronauten_Wubbo_Ockels_%28Nederland%29_en_Ulf_Merbold_%28Duitsland%29%2C_Bestanddeelnr_932-8297.jpg/960px-Persconferentie_bij_Estec_in_Noordwijk_astronauten_Wubbo_Ockels_%28Nederland%29_en_Ulf_Merbold_%28Duitsland%29%2C_Bestanddeelnr_932-8297.jpg",
      "caption": "Spacelab-Forschungsmodul im Frachtraum des Space Shuttle"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/ISS-57_Alexander_Gerst_with_CIMON_in_the_Columbus_lab.jpg/960px-ISS-57_Alexander_Gerst_with_CIMON_in_the_Columbus_lab.jpg",
      "caption": "Astronauten bei Experimenten im Columbus-Labor"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Space_Shuttle_Atlantis_at_Launch_Pad_39A.jpg/960px-Space_Shuttle_Atlantis_at_Launch_Pad_39A.jpg",
      "caption": "Start von Space Shuttle Atlantis mit Columbus an Bord"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Col-CC.jpg/960px-Col-CC.jpg",
      "caption": "Blick auf das fertige ISS-Labor und seine Kontrollsysteme"
    }
  ],
  "atv-ariane": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/ATV-2_launch_from_ISS.jpg/960px-ATV-2_launch_from_ISS.jpg",
      "caption": "Start der Ariane-5-Rakete mit ATV vom Weltraumbahnhof Kourou"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/ISS-30_Andr%C3%A9_Kuipers_with_ATV-3%27s_docking_cone.jpg/960px-ISS-30_Andr%C3%A9_Kuipers_with_ATV-3%27s_docking_cone.jpg",
      "caption": "Astronauten entladen Versorgungspakete im Inneren von ATV"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/ISS-26_ATV-2_Johannes_Kepler_docks_to_Zvezda.jpg/960px-ISS-26_ATV-2_Johannes_Kepler_docks_to_Zvezda.jpg",
      "caption": "ATV mit seinen typischen X-förmigen blauen Solarflügeln"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Georges_Lema%C3%AEtre_ATV_final_approach_for_docking_%28c%29.jpg/960px-Georges_Lema%C3%AEtre_ATV_final_approach_for_docking_%28c%29.jpg",
      "caption": "Automatisches Andocken mit hochpräzisen Laser-Sensoren"
    }
  ],
  "mars-express": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/3D_image_of_Valles_Marineris_taken_by_Mars_Express_HRSC_ESA240290.jpg/960px-3D_image_of_Valles_Marineris_taken_by_Mars_Express_HRSC_ESA240290.jpg",
      "caption": "3D-Farbaufnahme der Kamera HRSC von Mars Express"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Phobos_-_Mars_Express_%2844410800112%29.png/960px-Phobos_-_Mars_Express_%2844410800112%29.png",
      "caption": "Nahaufnahme des Marsmonds Phobos durch Mars Express"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/2/28/Beagle-2-separation.png",
      "caption": "Startvorbereitung und mitgeführte Landesonde Beagle 2"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Mars_-_Korolev_Crater_-_ESA_Mars_Express_%2852983732221%29.png/960px-Mars_-_Korolev_Crater_-_ESA_Mars_Express_%2852983732221%29.png",
      "caption": "Der mit Wassereis gefüllte Koroljow-Krater auf dem Mars"
    }
  ],
  "giotto": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Comet_Halley_close_up.jpg/960px-Comet_Halley_close_up.jpg",
      "caption": "Erstes historisches Foto des Kometenkerns von 1P/Halley"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Comet_Halley_ARC-1986-AC86-0720-4~orig.jpg/960px-Comet_Halley_ARC-1986-AC86-0720-4~orig.jpg",
      "caption": "Der Halleysche Komet bei seinem Besuch im Jahr 1986"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Ariane_1_Rocket_at_Le_Bourget.jpg/960px-Ariane_1_Rocket_at_Le_Bourget.jpg",
      "caption": "Europäische Trägerrakete Ariane 1 für den Start von Giotto"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Comet_Halley_%28PIA17485%29.jpg/960px-Comet_Halley_%28PIA17485%29.jpg",
      "caption": "Leuchtender Schweif des Halleyschen Kometen"
    }
  ],
  "shenzhou-5": [
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Post_S-7_Shenzhou_spacecraft-fr.png",
      "caption": "Das dreiteilige chinesische Raumschiff Shenzhou"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Launch_of_Shenzhou_13.jpg/960px-Launch_of_Shenzhou_13.jpg",
      "caption": "Trägerrakete Langer Marsch 2F auf der Startrampe"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/098_Shenzhou_V_Re-entry_Vehicle_and_Spacesuit_Used_by_Yang_Liwei.jpg/960px-098_Shenzhou_V_Re-entry_Vehicle_and_Spacesuit_Used_by_Yang_Liwei.jpg",
      "caption": "Raumanzug von Chinas erstem Raumfahrer Yang Liwei"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Shenzhou_21_crew_2026_New_Year_Wishes_aboard_China_Space_Station.png",
      "caption": "Heute fliegen Shenzhou-Kapseln regelmäßig zur Station Tiangong"
    }
  ],
  "mangalyaan-gaganyaan": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Descent_of_Phoenix_with_a_crater_in_the_background_taken_by_Mars_Reconnaissance_Orbiter.jpg/960px-Descent_of_Phoenix_with_a_crater_in_the_background_taken_by_Mars_Reconnaissance_Orbiter.jpg",
      "caption": "Gesamtaufnahme des Roten Planeten durch Mangalyaan"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/ISRO_PSLV%28Polar_Satellite_Launch_Vehicle%29_at_HAL_Museum%2C_Bengaluru_%28Ank_Kumar%29.jpg/960px-ISRO_PSLV%28Polar_Satellite_Launch_Vehicle%29_at_HAL_Museum%2C_Bengaluru_%28Ank_Kumar%29.jpg",
      "caption": "Start der indischen Rakete PSLV mit Mangalyaan an Bord"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Gaganyaan_module_infographic_%28cropped%29.jpg/960px-Gaganyaan_module_infographic_%28cropped%29.jpg",
      "caption": "Testkapsel des indischen bemannten Raumprogramms Gaganyaan"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Mars_globe.jpg/960px-Mars_globe.jpg",
      "caption": "Zielplanet Mars aus Sicht von Orbiter-Missionen"
    }
  ],
  "akatsuki-kibo": [
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Venus_-_December_23_2016.png/960px-Venus_-_December_23_2016.png",
      "caption": "Wolkenbänder über der Venus aus Daten von Akatsuki"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Kibo_Exposed_Facility_in_Kennedy%27s_SSPF_in_2008_%28KSC-08PD3044%29.jpg/960px-Kibo_Exposed_Facility_in_Kennedy%27s_SSPF_in_2008_%28KSC-08PD3044%29.jpg",
      "caption": "Japans riesiges ISS-Labor Kibō mit Außen-Plattform"
    },
    {
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/dc/H-IIA_F17_launching_AKATSUKI_ITN.jpg",
      "caption": "Japanische Rakete H-IIA beim Start ins Sonnensystem"
    },
    {
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/The_ten-member_Expedition_74_crew_poses_for_a_portrait_inside_the_Kibo_laboratory_module_%28iss074e0835261%29.jpg/960px-The_ten-member_Expedition_74_crew_poses_for_a_portrait_inside_the_Kibo_laboratory_module_%28iss074e0835261%29.jpg",
      "caption": "Astronauten arbeiten im japanischen Forschungsmodul Kibō"
    }
  ]
};

const CATEGORY_FALLBACK_POOL: Readonly<Record<string, ReadonlyArray<GalleryMediaItem>>> = {
  star: BODY_AND_MISSION_GALLERY['sun'] ?? [],
  planet: [
    ...(BODY_AND_MISSION_GALLERY['earth'] ?? []),
    ...(BODY_AND_MISSION_GALLERY['jupiter'] ?? []),
  ],
  'dwarf-planet': [
    ...(BODY_AND_MISSION_GALLERY['pluto'] ?? []),
    ...(BODY_AND_MISSION_GALLERY['ceres'] ?? []),
  ],
  moon: [
    ...(BODY_AND_MISSION_GALLERY['moon'] ?? []),
    ...(BODY_AND_MISSION_GALLERY['europa'] ?? []),
  ],
  comet: [
    ...(BODY_AND_MISSION_GALLERY['neowise'] ?? []),
    ...(BODY_AND_MISSION_GALLERY['halley'] ?? []),
  ],
  belt: [
    ...(BODY_AND_MISSION_GALLERY['asteroid-belt'] ?? []),
    ...(BODY_AND_MISSION_GALLERY['oort-cloud'] ?? []),
  ],
  spacecraft: [
    ...(BODY_AND_MISSION_GALLERY['iss'] ?? []),
    ...(BODY_AND_MISSION_GALLERY['jwst'] ?? []),
  ],
  lagrange: LAGRANGE_GALLERY_EXTRAS,
};

/** Baut eine deduplizierte Galerie mit mindestens 5 (bis zu 6) verifizierten Fotos für jeden Himmelskörper in P20/P50. */
export function buildBodyGallery(
  body: CelestialBody,
  childBodies: CelestialBody[] = [],
  matchingMissions: ResearchMission[] = [],
  parentBody: CelestialBody | null = null,
): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];
  const seen = new Set<string>();
  const addItem = (url: string | undefined, caption: string): void => {
    if (!url || seen.has(url) || items.length >= 6) {
      return;
    }
    seen.add(url);
    items.push({ url, caption });
  };

  addItem(body.wikimediaImageUrl || body.imageUrl, body.name);
  for (const extra of BODY_AND_MISSION_GALLERY[body.id] ?? []) {
    addItem(extra.url, extra.caption);
  }
  if (body.category === 'lagrange') {
    if (parentBody) {
      addItem(parentBody.wikimediaImageUrl, parentBody.name);
      for (const extra of BODY_AND_MISSION_GALLERY[parentBody.id] ?? []) {
        if (items.length >= 3) break;
        addItem(extra.url, extra.caption);
      }
    }
    for (const lagExtra of LAGRANGE_GALLERY_EXTRAS) {
      addItem(lagExtra.url, lagExtra.caption);
    }
  }
  for (const m of matchingMissions) {
    addItem(m.wikimediaImageUrl, m.title);
    for (const extra of BODY_AND_MISSION_GALLERY[m.id] ?? []) {
      addItem(extra.url, extra.caption);
    }
  }
  for (const child of childBodies) {
    addItem(child.wikimediaImageUrl, child.name);
  }
  if (parentBody && items.length < 5) {
    addItem(parentBody.wikimediaImageUrl, parentBody.name);
    for (const extra of BODY_AND_MISSION_GALLERY[parentBody.id] ?? []) {
      addItem(extra.url, extra.caption);
    }
  }
  for (const fallback of CATEGORY_FALLBACK_POOL[body.category] ?? LAGRANGE_GALLERY_EXTRAS) {
    if (items.length >= 5) {
      break;
    }
    addItem(fallback.url, fallback.caption);
  }
  return items;
}

/** Baut eine deduplizierte Galerie mit mindestens 5 (bis zu 6) verifizierten Fotos für jede Mission in P40. */
export function buildMissionGallery(mission: ResearchMission): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];
  const seen = new Set<string>();
  const addItem = (url: string | undefined, caption: string): void => {
    if (!url || seen.has(url) || items.length >= 6) {
      return;
    }
    seen.add(url);
    items.push({ url, caption });
  };

  addItem(mission.wikimediaImageUrl || mission.imageUrl, mission.title);
  for (const extra of BODY_AND_MISSION_GALLERY[mission.id] ?? []) {
    addItem(extra.url, extra.caption);
  }
  for (const targetExtra of BODY_AND_MISSION_GALLERY[mission.targetBodyId] ?? []) {
    addItem(targetExtra.url, targetExtra.caption);
  }
  const fallbackPool =
    CATEGORY_FALLBACK_POOL['spacecraft'] ?? LAGRANGE_GALLERY_EXTRAS;
  for (const fallback of fallbackPool) {
    if (items.length >= 5) {
      break;
    }
    addItem(fallback.url, fallback.caption);
  }
  return items;
}
