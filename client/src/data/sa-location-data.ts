// Static SA municipality and township data — official names
// Province → municipalities → townships

export type LocationData = {
  [province: string]: {
    [municipality: string]: string[];
  };
};

export const SA_LOCATION_DATA: LocationData = {
  "Western Cape": {
    "City of Cape Town": [
      "Khayelitsha","Gugulethu","Langa","Nyanga","Philippi","Mitchells Plain",
      "Bishop Lavis","Elsies River","Hanover Park","Manenberg","Bonteheuwel",
      "Atlantis","Delft","Bellville","Parow","Goodwood","Wynberg","Claremont",
      "Rondebosch","Mowbray","Observatory","Woodstock","Bo-Kaap","Sea Point",
      "Green Point","Milnerton","Tableview","Strand","Somerset West","Paarl",
    ],
    "Matzikama": ["Vredendal","Vanrhynsdorp","Lutzville","Klawer"],
    "Cederberg": ["Clanwilliam","Citrusdal","Graafwater"],
    "Bergrivier": ["Piketberg","Porterville","Velddrif","Elandsbaai"],
    "Saldanha Bay": ["Saldanha","Vredenburg","Langebaan","Hopefield","Paternoster"],
    "Swartland": ["Malmesbury","Moorreesburg","Darling","Riebeek-Kasteel"],
    "Witzenberg": ["Ceres","Tulbagh","Prince Alfred Hamlet","Wolseley"],
    "Drakenstein": ["Paarl","Wellington","Franschhoek","Hermon"],
    "Stellenbosch": ["Stellenbosch","Franschhoek","Pniel","Klapmuts"],
    "Breede Valley": ["Worcester","De Doorns","Rawsonville","Touws River"],
    "Langeberg": ["Robertson","Montagu","Ashton","Bonnievale"],
    "Theewaterskloof": ["Grabouw","Villiersdorp","Caledon","Greyton"],
    "Overstrand": ["Hermanus","Kleinmond","Stanford","Gansbaai","Betty's Bay"],
    "Cape Agulhas": ["Bredasdorp","Napier","Arniston","Struisbaai"],
    "Swellendam": ["Swellendam","Barrydale","Bonnievale"],
    "Kannaland": ["Ladismith","Calitzdorp","Zoar"],
    "Hessequa": ["Riversdale","Stilbaai","Witsand","Heidelberg"],
    "Mossel Bay": ["Mossel Bay","Hartenbos","Great Brak River","Friemersheim"],
    "George": ["George","Wilderness","Uniondale","Thembalethu"],
    "Oudtshoorn": ["Oudtshoorn","De Rust","Dysselsdorp"],
    "Bitou": ["Plettenberg Bay","Knysna","Keurboomstrand"],
    "Knysna": ["Knysna","Rheenendal","Sedgefield"],
    "Laingsburg": ["Laingsburg","Matjiesfontein"],
    "Prince Albert": ["Prince Albert","Leeu-Gamka"],
    "Beaufort West": ["Beaufort West","Murraysburg"],
  },

  "Gauteng": {
    "City of Johannesburg": [
      "Soweto","Alexandra","Orange Farm","Diepsloot","Ennerdale","Johannesburg CBD",
      "Sandton","Randburg","Roodepoort","Midrand","Lenasia","Eldorado Park",
      "Jabulani","Meadowlands","Chiawelo","Dobsonville","Dlamini","Zola",
      "Protea Glen","Pimville","Naledi","Klipspruit","Zondi","Dube",
    ],
    "City of Tshwane": [
      "Mamelodi","Soshanguve","Atteridgeville","Hammanskraal","Ga-Rankuwa",
      "Pretoria CBD","Centurion","Mabopane","Winterveldt","Eersterust",
      "Silverton","Pretoria East","Midrand","Akasia","Theresapark",
    ],
    "City of Ekurhuleni": [
      "Tembisa","Kathorus","Katlehong","Thokoza","Daveyton","Boksburg",
      "Benoni","Germiston","Springs","Nigel","Brakpan","Edenvale",
      "Kempton Park","Alberton","Vosloorus","Duduza","Wattville",
    ],
    "Emfuleni": ["Vanderbijlpark","Vereeniging","Evaton","Sebokeng","Tshepiso"],
    "Midvaal": ["Meyerton","Walkerville","Henley on Klip"],
    "Lesedi": ["Heidelberg","Ratanda","Devon","Jameson Park"],
    "Mogale City": ["Krugersdorp","Kagiso","Munsieville","Magaliesburg"],
    "Rand West City": ["Westonaria","Randfontein","Mohlakeng","Bekkersdal"],
  },

  "KwaZulu-Natal": {
    "eThekwini": [
      "Umlazi","KwaMashu","Inanda","Chatsworth","Lamontville","KwaDabeka",
      "Durban CBD","Pinetown","Westville","Phoenix","Tongaat","Isipingo",
      "Amanzimtoti","Ntuzuma","Kwamashu","Hammarsdale","Clermont",
    ],
    "Msunduzi": ["Pietermaritzburg","Sobantu","Edendale","Imbali","Northdale"],
    "uMngeni": ["Howick","Merrivale","Lidgetton","Mpophomeni"],
    "uMhlathuze": ["Richards Bay","Empangeni","Esikhawini","Nseleni"],
    "Ulundi": ["Ulundi","Babanango","Nongoma"],
    "AbaQulusi": ["Vryheid","Louwsburg","Hlobane"],
    "King Sabata Dalindyebo": ["Mthatha","Ngangelizwe"],
    "Newcastle": ["Newcastle","Madadeni","Osizweni","Ballengeich"],
    "eMalahleni": ["eMalahleni","Machibisa"],
    "Ray Nkonyeni": ["Port Shepstone","Margate","Shelly Beach","Hibberdene"],
  },

  "Eastern Cape": {
    "Buffalo City": [
      "Mdantsane","Zwelitsha","Duncan Village","East London CBD","Cambridge",
      "Vincent","Amalinda","Beacon Bay","Gonubie","Scenery Park",
    ],
    "Nelson Mandela Bay": [
      "Kwazakhele","New Brighton","Motherwell","KwaNobuhle","Port Elizabeth CBD",
      "Uitenhage","Despatch","Gelvandale","Helenvale","Zwide","Bethelsdorp",
    ],
    "King Sabata Dalindyebo": ["Mthatha","Ngangelizwe","Ikwezi"],
    "Nyandeni": ["Libode","Ngqeleni","Port St Johns"],
    "Enoch Mgijima": ["Queenstown","Komani","Tarkastad"],
    "Makana": ["Makhanda","Grahamstown","Joza","Fingo Village"],
    "Blue Crane Route": ["Somerset East","Pearston","Cookhouse"],
    "Camdeboo": ["Graaff-Reinet","Aberdeen","Nieu-Bethesda"],
    "Kouga": ["Jeffrey's Bay","Humansdorp","Cape St Francis","Hankey"],
  },

  "Limpopo": {
    "Polokwane": ["Seshego","Mankweng","Ga-Maja","Polokwane CBD","Bendor"],
    "Blouberg": ["Bochum","Alldays","Tolwe"],
    "Thulamela": ["Thohoyandou","Shayandima","Sibasa","Dzanani"],
    "Makhado": ["Louis Trichardt","Elim","Waterval","Bandelierkop"],
    "Musina": ["Musina","Nancefield"],
    "Mokgophi": ["Groblersdal","Marble Hall"],
    "Greater Tzaneen": ["Tzaneen","Nkowankowa","Letsitele","Haenertsburg"],
    "Lepelle-Nkumpi": ["Lebowakgomo","Moletlane","Bakenberg"],
    "Mogalakwena": ["Mokopane","Mahwelereng","Rebone"],
  },

  "Mpumalanga": {
    "Mbombela": ["Kanyamazane","Matsulu","Nelspruit CBD","Kabokweni","Hazyview"],
    "Nkomazi": ["Komatipoort","Malelane","Hectorspruit","Mhluzi"],
    "Emalahleni": ["KwaGuqa","Emalahleni CBD","Ackerville","Klipspruit","Phola"],
    "Steve Tshwete": ["Middelburg","Mhluzi","Hendrina"],
    "Govan Mbeki": ["Secunda","Evander","Embalenhle","Kinross","Bethal"],
    "Lekwa": ["Standerton","Sakhile"],
    "Thaba Chweu": ["Lydenburg","Mashishing","Graskop","Sabie"],
    "Victor Khanye": ["Delmas","Botleng","Eloff"],
  },

  "North West": {
    "Rustenburg": ["Phokeng","Boitekong","Rustenburg CBD","Meriting","Tlhabane"],
    "Madibeng": ["Brits","Letlhabile","Mooinooi","Hartbeespoort","Mothutlung"],
    "Mahikeng": ["Mahikeng CBD","Mmabatho","Montshioa","Garona"],
    "Ditsobotla": ["Lichtenburg","Coligny","Boikhutso"],
    "Moses Kotane": ["Mogwase","Moruleng","Swartwater"],
    "Kgetlengrivier": ["Swartruggens","Derby","Koster"],
    "JB Marks": ["Potchefstroom","Ikageng","Ventersdorp"],
  },

  "Free State": {
    "Mangaung": ["Botshabelo","Thaba Nchu","Bloemfontein CBD","Bochabela","Rocklands","Phelindaba"],
    "Matjhabeng": ["Welkom","Odendaalsrus","Virginia","Allanridge","Thabong"],
    "Maluti-a-Phofung": ["Phuthaditjhaba","Kestell","Harrismith","Qwaqwa"],
    "Dihlabeng": ["Bethlehem","Clarens","Paul Roux","Fouriesburg"],
    "Setsoto": ["Ficksburg","Senekal","Marquard","Clocolan"],
    "Ngwathe": ["Parys","Heilbron","Vredefort","Koppies"],
    "Moqhaka": ["Kroonstad","Maokeng","Viljoenskroon"],
  },

  "Northern Cape": {
    "Sol Plaatje": ["Galeshewe","Kimberley CBD","Roodepan","Homevale"],
    "Dikgatlong": ["Barkly West","Windsorton","Delportshoop"],
    "Ga-Segonyana": ["Kuruman","Mothibistad","Batlharos"],
    "Gamagara": ["Kathu","Olifantshoek","Deben"],
    "John Taolo Gaetsewe": ["Hotazel","John Taolo","Manyeding"],
    "Namakwa": ["Springbok","Pofadder","Aggeneys","Nababeep","Port Nolloth"],
    "Ubuntu": ["Richmond","Loxton","Calvinia","Carnarvon"],
    "Hantam": ["Calvinia","Loeriesfontein","Brandvlei"],
    "Siyathemba": ["Prieska","Marydale","Niekerkshoop"],
    "!Kheis": ["Groblershoop","Wegdraai"],
    "Dawid Kruiper": ["Upington","Keimoes","Kanoneiland"],
    "Emthanjeni": ["De Aar","Hanover","Richmond"],
  },
};

export function getMunicipalities(province: string): string[] {
  if (!province || !SA_LOCATION_DATA[province]) return [];
  return Object.keys(SA_LOCATION_DATA[province]).sort();
}

export function getTownships(province: string, municipality: string): string[] {
  if (!province || !municipality) return [];
  const provData = SA_LOCATION_DATA[province];
  if (!provData) return [];
  return (provData[municipality] || []).sort();
}
