export const SA_PROVINCES: Record<string, {
  municipalities: Record<string, {
    townships: string[];
    schools: string[];
  }>;
}> = {
  "Eastern Cape": {
    municipalities: {
      "Buffalo City Metro": {
        townships: ["Mdantsane", "Zwelitsha", "Ginsberg", "Dimbaza", "Scenery Park", "Reeston", "Ndevana", "Amalinda", "Vincent", "Cambridge"],
        schools: ["Selborne College", "Clarendon Girls High", "Stirling High School", "Selborne Primary", "Cambridge High School", "East London High School", "Greenfields Primary", "Vincent Pallotti High", "Quigney Primary", "Berea College"],
      },
      "Nelson Mandela Bay Metro": {
        townships: ["Motherwell", "New Brighton", "Kwazakhele", "Zwide", "Gelvandale", "Helenvale", "Bethelsdorp", "KwaDwesi", "Missionvale", "Uitenhage"],
        schools: ["Pearson High School", "Grey High School", "Collegiate Girls High", "Port Elizabeth Boys High", "Clarendon High", "Westville Boys", "Uitenhage High", "HTS Paterson", "Newton Technical", "Alexandra Road Primary"],
      },
      "King Sabata Dalindyebo": {
        townships: ["Mthatha", "Ngangelizwe", "Ikwezi", "Southernwood", "Fortgale", "Northcrest", "Umtata"],
        schools: ["Mthatha High School", "Holy Cross High", "Jongilizwe High", "Mbeki High School", "Sulenkama High", "Qumbu High School", "Dalibhunga High"],
      },
      "Amathole District": {
        townships: ["Alice", "Komani", "Stutterheim", "Cathcart", "Queenstown", "Cofimvaba"],
        schools: ["Lovedale College", "Fort Hare Secondary", "Queenstown Girls High", "Komani High School", "Queenshaven High"],
      },
    },
  },
  "Free State": {
    municipalities: {
      "Mangaung Metro": {
        townships: ["Botshabelo", "Thaba Nchu", "Mangaung", "Bloemside", "Estoire", "Heidedal", "Phahameng", "Rocklands"],
        schools: ["Grey College", "Sentraal High", "Sand du Plessis Technical", "Eunice Girls High", "Bloemfontein High School", "Jim Fouche High", "Vista High School", "Kagisano Primary"],
      },
      "Lejweleputswa District": {
        townships: ["Welkom", "Odendaalsrus", "Thabong", "Virginia", "Allanridge", "Bronville"],
        schools: ["Jim Fouche High Welkom", "Welkom High School", "Thabong High School", "Odendaalsrus High", "FS Technical High Welkom"],
      },
      "Fezile Dabi District": {
        townships: ["Sasolburg", "Zamdela", "Parys", "Vredefort", "Deneysville"],
        schools: ["Sasolburg High School", "Lethabo High School", "Parys High School", "Deneysville High"],
      },
    },
  },
  "Gauteng": {
    municipalities: {
      "City of Johannesburg Metro": {
        townships: ["Soweto", "Alexandra", "Diepsloot", "Ivory Park", "Tembisa", "Orange Farm", "Ennerdale", "Eldorado Park", "Dobsonville", "Meadowlands", "Pimville", "Diepkloof", "Naledi", "Phiri", "Zondi", "Jabulani", "Moletsane", "Dlamini", "Mofolo", "Chiawelo", "Emdeni", "Mapetla"],
        schools: ["Johannesburg High School", "Wits High School", "Hoerskool Noordheuwel", "Parktown High School", "Jeppe High School for Boys", "Roosevelt High School", "Orlando West High", "Pimville Zone 6", "Morris Isaacson High", "Phineas Xulu High", "Diepkloof High School", "Alexander High School", "Riverlea Secondary"],
      },
      "City of Tshwane Metro": {
        townships: ["Mamelodi", "Soshanguve", "Atteridgeville", "Ga-Rankuwa", "Mabopane", "Hammanskraal", "Winterveldt", "Temba", "Centurion"],
        schools: ["Pretoria Boys High", "Hoerskool Menlopark", "Waterkloof High School", "Brooklyn Technical High", "Mamelodi High School", "Soshanguve High School", "Atteridgeville High School", "Ga-Rankuwa High School", "Centurion High School", "Hoerskool Eldoraigne"],
      },
      "Ekurhuleni Metro": {
        townships: ["Katlehong", "Tokoza", "Vosloorus", "Daveyton", "Tembisa", "Wattville", "Benoni", "Boksburg", "Germiston", "Edenvale"],
        schools: ["Benoni High School", "Boksburg High School", "Kempton Park High", "Springs Boys High", "Germiston High School", "Tembisa High School", "Daveyton High School", "Katlehong High School"],
      },
      "West Rand District": {
        townships: ["Kagiso", "Munsieville", "Chamdor", "Krugersdorp", "Randfontein", "Westonaria", "Carletonville"],
        schools: ["Krugersdorp High School", "Rand High School", "Carletonville High", "Randfontein High School", "Westrand High"],
      },
      "Sedibeng District": {
        townships: ["Sebokeng", "Evaton", "Sharpeville", "Vanderbijlpark", "Vereeniging", "Boipatong"],
        schools: ["Vanderbijlpark High", "Vereeniging High", "Sebokeng College", "Three Rivers High", "Letsibogo High"],
      },
    },
  },
  "KwaZulu-Natal": {
    municipalities: {
      "eThekwini Metro": {
        townships: ["KwaMashu", "Umlazi", "Inanda", "Ntuzuma", "Clermont", "Pinetown", "Phoenix", "Chatsworth", "Hammarsdale", "Hillcrest", "Folweni", "Lamontville", "Wentworth"],
        schools: ["Durban High School", "Glenwood High School", "Westville Boys High", "Berea College", "Pinetown Boys High", "KwaMashu High", "Umlazi High School", "Inanda Comprehensive", "Phoenix High School", "Chatsworth Secondary", "Lamontville High School", "Settlers High"],
      },
      "uMgungundlovu District": {
        townships: ["Pietermaritzburg", "Imbali", "Edendale", "Northdale", "Georgetown", "Ashdown", "Sobantu"],
        schools: ["Maritzburg College", "Girls High Pietermaritzburg", "Northdale High School", "Edendale Technical High", "Imbali Secondary", "Voortrekker High Pietermaritzburg", "Northlands Girls High"],
      },
      "King Cetshwayo District": {
        townships: ["Richards Bay", "Empangeni", "Esikhawini", "Ngwelezana", "Esikhaleni"],
        schools: ["Richards Bay High School", "Empangeni High School", "Esikhawini High School", "Ngwelezana High School"],
      },
      "iLembe District": {
        townships: ["Stanger", "Ballito", "KwaDukuza", "Ndwedwe"],
        schools: ["Stanger High School", "Ballito Secondary", "KwaDukuza High"],
      },
      "Ugu District": {
        townships: ["Port Shepstone", "Margate", "Hibberdene", "Scottburgh"],
        schools: ["Port Shepstone High", "Margate High School", "South Coast High"],
      },
    },
  },
  "Limpopo": {
    municipalities: {
      "Polokwane": {
        townships: ["Seshego", "Mankweng", "Westernburg", "Flora Park", "Bendor", "Ivy Park"],
        schools: ["Polokwane High School", "Louis Trichardt High", "Seshego High School", "Peter Mokaba High", "Capricorn High School", "Mankweng High"],
      },
      "Mopani District": {
        townships: ["Tzaneen", "Phalaborwa", "Giyani", "Lephalale"],
        schools: ["Tzaneen High School", "Phalaborwa High School", "Giyani High School", "Lephalale High School"],
      },
      "Vhembe District": {
        townships: ["Thohoyandou", "Louis Trichardt", "Musina", "Elim", "Mutale"],
        schools: ["Thohoyandou High School", "Louis Trichardt High", "Musina High School", "Elim High School", "Vuwani Secondary"],
      },
      "Sekhukhune District": {
        townships: ["Groblersdal", "Marble Hall", "Burgersfort", "Jane Furse"],
        schools: ["Groblersdal High School", "Marble Hall High", "Sekhukhune High School", "Jane Furse High"],
      },
      "Waterberg District": {
        townships: ["Modimolle", "Mookgophong", "Mokopane", "Bela-Bela"],
        schools: ["Modimolle High School", "Mokopane High School", "Bela-Bela High School"],
      },
    },
  },
  "Mpumalanga": {
    municipalities: {
      "Nkangala District": {
        townships: ["Middleburg", "eMalahleni (Witbank)", "Hendrina", "Delmas", "KwaGuqa", "Ogies"],
        schools: ["Middelburg High School", "Witbank High School", "Voortrekker High Middelburg", "Hendrina High School", "Delmas High School"],
      },
      "Ehlanzeni District": {
        townships: ["Mbombela (Nelspruit)", "Hazyview", "Bushbuckridge", "Barberton", "Kanyamazane", "Matsulu"],
        schools: ["Nelspruit High School", "Lowveld High School", "Barberton High School", "Bushbuckridge High", "Hazyview High School"],
      },
      "Gert Sibande District": {
        townships: ["Secunda", "Ermelo", "Piet Retief", "Standerton", "Volksrust"],
        schools: ["Secunda High School", "Ermelo High School", "Piet Retief High School", "Standerton High"],
      },
    },
  },
  "Northern Cape": {
    municipalities: {
      "Sol Plaatje (Kimberley)": {
        townships: ["Galeshewe", "Roodepan", "Greenpoint", "Kimberley CBD"],
        schools: ["Kimberley Boys High", "Diamantveld High School", "Galeshewe High School", "Roodepan High School", "Northern Cape High"],
      },
      "Frances Baard District": {
        townships: ["Hartswater", "Jan Kempdorp", "Warrenton"],
        schools: ["Hartswater High School", "Jan Kempdorp High", "Warrenton High"],
      },
      "John Taolo Gaetsewe District": {
        townships: ["Kuruman", "Kathu", "Mothibistad"],
        schools: ["Kuruman High School", "Kathu High School", "Mothibistad High"],
      },
      "ZF Mgcawu District": {
        townships: ["Upington", "Kakamas", "Keimoes", "Pofadder"],
        schools: ["Upington High School", "Kakamas High", "Gordon High Upington"],
      },
    },
  },
  "North West": {
    municipalities: {
      "Bojanala Platinum District": {
        townships: ["Rustenburg", "Soshanguve North", "Phokeng", "Boitekong", "Tlhabane", "Marikana"],
        schools: ["Rustenburg High School", "Phokeng High School", "Boitekong High", "Tlhabane Secondary", "Rustenburg Technical High"],
      },
      "Dr Kenneth Kaunda District": {
        townships: ["Klerksdorp", "Orkney", "Stilfontein", "Jouberton", "Kanana"],
        schools: ["Klerksdorp High School", "Hoerskool Klerksdorp", "Jouberton High School", "Orkney High"],
      },
      "Ngaka Modiri Molema District": {
        townships: ["Mahikeng", "Mmabatho", "Lichtenburg", "Zeerust"],
        schools: ["Mahikeng High School", "Mmabatho High", "Lichtenburg High", "Zeerust High School"],
      },
      "Dr Ruth Segomotsi Mompati District": {
        townships: ["Vryburg", "Taung", "Christiana"],
        schools: ["Vryburg High School", "Taung High School", "Christiana High"],
      },
    },
  },
  "Western Cape": {
    municipalities: {
      "City of Cape Town Metro": {
        townships: ["Mitchells Plain", "Khayelitsha", "Gugulethu", "Langa", "Nyanga", "Delft", "Bellville", "Strand", "Parow", "Brackenfell", "Kraaifontein", "Mfuleni", "Blue Downs", "Eerste River", "Macassar", "Hout Bay", "Imizamo Yethu", "Atlantis", "Grassy Park", "Hanover Park", "Manenberg", "Bonteheuwel", "Bishop Lavis", "Athlone"],
        schools: ["SACS", "Wynberg Boys High", "Rustenburg Girls High", "Bishops (Diocesan College)", "Groote Schuur High", "Rondebosch Boys High", "Pinelands High", "Langa High School", "Gugulethu Comprehensive", "Khayelitsha Comprehensive", "Mitchells Plain High", "Bellville High School", "Parow High School", "Delft High School", "Belhar High School", "Somerset College", "Strand High School", "Blouberg International Academy", "Herschel Girls School", "Springfield Convent", "Westerford High School", "Harold Cressy High School", "Manenberg High School", "Hanover Park High School", "Athlone High School"],
      },
      "Cape Winelands District": {
        townships: ["Stellenbosch", "Paarl", "Worcester", "Franschhoek", "Robertson", "Montagu", "Villiersdorp"],
        schools: ["Stellenbosch High School", "Paarl Boys High", "Paarl Girls High", "Worcester High School", "Huguenot High Paarl", "Laborie High School", "Robertson High School"],
      },
      "Eden District": {
        townships: ["George", "Mossel Bay", "Knysna", "Oudtshoorn", "Beaufort West"],
        schools: ["George High School", "Mossel Bay High", "Knysna High School", "Oudtshoorn High School", "York High George"],
      },
      "Overberg District": {
        townships: ["Hermanus", "Swellendam", "Bredasdorp", "Caledon"],
        schools: ["Hermanus High School", "Swellendam High School", "Bredasdorp High", "Caledon High School"],
      },
    },
  },
};

export const GRADES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
  "University (1st Year)", "University (2nd Year)", "University (3rd Year)", "University (4th Year+)",
];

export const STREAMS = [
  "Mathematics & Science (Pure Sciences)",
  "Mathematics & Science (Applied Sciences)",
  "Commerce (Accounting, Business, Economics)",
  "Arts & Humanities (Languages, History, Geography)",
  "Technical (Engineering Graphics, CAT, IT)",
  "Agricultural Studies",
  "General (Mixed Subjects)",
];

export const SUBJECTS_LIST = [
  "Mathematics",
  "Mathematical Literacy (Maths Lit)",
  "Physical Sciences",
  "Life Sciences (Biology)",
  "Geography",
  "History",
  "English Home Language",
  "English First Additional Language",
  "Afrikaans Home Language",
  "Afrikaans First Additional Language",
  "IsiZulu", "IsiXhosa", "Sepedi", "Setswana", "Sesotho",
  "Accounting",
  "Business Studies",
  "Economics",
  "CAT (Computer Applications Technology)",
  "IT (Information Technology)",
  "Engineering Graphics & Design",
  "Consumer Studies",
  "Tourism",
  "Life Orientation",
  "Agricultural Sciences",
  "Agricultural Technology",
  "Visual Arts",
  "Music",
  "Dramatic Arts",
  "Applied Maths (University Level)",
  "Calculus (University Level)",
  "Statistics (University Level)",
];

export const DEMOGRAPHICS = [
  "African/Black",
  "Coloured",
  "Indian/Asian",
  "White",
  "Prefer not to say",
];

export const GENDERS = ["Male", "Female", "Prefer not to say"];

export function getMunicipalities(province: string): string[] {
  return Object.keys(SA_PROVINCES[province]?.municipalities || {});
}

export function getTownships(province: string, municipality: string): string[] {
  return SA_PROVINCES[province]?.municipalities[municipality]?.townships || [];
}

export function getSchools(province: string, municipality: string): string[] {
  return SA_PROVINCES[province]?.municipalities[municipality]?.schools || [];
}
