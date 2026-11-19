/**
 * Behandelingen — alleen behandelingen die door de praktijk zijn bevestigd
 * (KNMT-vacature + WhatsApp-bericht van de praktijk). Geen implantologie,
 * facings, sedatie of andere niet-bevestigde zorg toevoegen.
 * Teksten zijn algemeen en voorzichtig: geen klinische beloftes.
 */

export type IconKey =
  | "check"
  | "clean"
  | "filling"
  | "root"
  | "crown"
  | "kids"
  | "extraction"
  | "pain"
  | "braces"
  | "aligner"
  | "whitening";

export type Treatment = {
  slug: string;
  title: string;
  short: string;
  group: "basis" | "herstel" | "kinderen" | "orthodontie" | "esthetiek";
  icon: IconKey;
  need: string;
  how: string[];
  note?: string;
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  /** Uitgelicht in de homepage-sectie "Onze behandelingen" */
  featured?: boolean;
};

export const groups: Record<Treatment["group"], string> = {
  basis: "Controle & preventie",
  herstel: "Herstellen & behandelen",
  kinderen: "Kinderen",
  orthodontie: "Orthodontie",
  esthetiek: "Esthetiek",
};

export const treatments: Treatment[] = [
  {
    slug: "periodieke-controle",
    title: "Periodieke controle",
    short: "Een regelmatige controle helpt problemen vroeg te ontdekken, vaak nog voordat u er last van heeft.",
    group: "basis",
    icon: "check",
    featured: true,
    need: "Veel gebitsproblemen, zoals gaatjes of tandvleesontsteking, geven in het begin weinig klachten. Een periodieke controle geeft u en de tandarts een goed beeld van uw mondgezondheid.",
    how: [
      "De tandarts bekijkt uw tanden, kiezen, tandvlees en mond en vraagt naar eventuele klachten.",
      "Waar nodig wordt aanvullend onderzoek gedaan om een goede diagnose te stellen.",
      "U hoort wat er is gezien en welke behandeling eventueel wordt geadviseerd, zodat u zelf een weloverwogen keuze kunt maken.",
    ],
    faq: [
      { q: "Hoe vaak moet ik op controle komen?", a: "Dat verschilt per persoon. De tandarts adviseert een passende frequentie op basis van uw mondgezondheid." },
      { q: "Ik heb nergens last van. Is een controle dan nodig?", a: "Ja, juist dan. Veel problemen zijn in een vroeg stadium beter en eenvoudiger te behandelen." },
    ],
    seoTitle: "Periodieke controle bij de tandarts in Kralendijk",
    seoDescription: "Regelmatige tandheelkundige controle en preventie bij Caribbean Dental Care in Kralendijk, Bonaire. Neem contact op voor een afspraak.",
  },
  {
    slug: "mondhygiene",
    title: "Mondhygiëne & gebitsreiniging",
    short: "Professionele reiniging verwijdert tandsteen en aanslag en helpt uw tandvlees gezond te houden.",
    group: "basis",
    icon: "clean",
    featured: true,
    need: "Ook met goed poetsen kan zich tandsteen vormen op plekken die moeilijk bereikbaar zijn. Tandsteen en plaque kunnen bijdragen aan tandvleesproblemen en een onfrisse adem.",
    how: [
      "Tandsteen en aanslag worden zorgvuldig verwijderd, ook tussen de tanden en langs het tandvlees.",
      "Het gebit wordt gereinigd en waar nodig gepolijst.",
      "U krijgt persoonlijke tips voor uw dagelijkse mondverzorging thuis.",
    ],
    faq: [
      { q: "Doet een gebitsreiniging pijn?", a: "De meeste mensen ervaren het als goed te doen. Heeft u gevoelige tanden of tandvlees, meld dit dan vooraf, zodat er rekening mee kan worden gehouden." },
      { q: "Wie voert de reiniging uit?", a: "De praktijk werkt met een mondhygiënist. Bij uw afspraak hoort u wie u behandelt." },
    ],
    seoTitle: "Mondhygiënist en gebitsreiniging op Bonaire",
    seoDescription: "Professionele gebitsreiniging en mondhygiëne bij Caribbean Dental Care in Kralendijk. Voor een gezond gebit en gezond tandvlees.",
  },
  {
    slug: "vullingen",
    title: "Vullingen",
    short: "Een gaatje wordt zorgvuldig hersteld, zodat uw tand weer sterk en goed bruikbaar is.",
    group: "herstel",
    icon: "filling",
    featured: true,
    need: "Een gaatje (cariës) kan ontstaan door bacteriën en suikers. Zonder behandeling kan het groter worden en uiteindelijk pijn of schade aan de tand veroorzaken.",
    how: [
      "De tandarts bekijkt het gaatje en bespreekt de behandeling met u.",
      "Indien nodig wordt de tand verdoofd.",
      "Het aangetaste deel wordt verwijderd en de tand wordt hersteld met een vulling.",
    ],
    faq: [
      { q: "Hoe weet ik of ik een gaatje heb?", a: "Soms merkt u gevoeligheid voor koud, warm of zoet, maar een gaatje kan ook zonder klachten aanwezig zijn. Bij een controle kan de tandarts dit beoordelen." },
      { q: "Mag ik direct na de behandeling eten?", a: "U krijgt na de behandeling advies dat past bij uw situatie, bijvoorbeeld als u nog verdoofd bent." },
    ],
    seoTitle: "Vullingen en gaatjes behandelen in Kralendijk",
    seoDescription: "Gaatjes laten behandelen bij Caribbean Dental Care op Bonaire. Zorgvuldige vullingen en duidelijke uitleg.",
  },
  {
    slug: "wortelkanaalbehandeling",
    title: "Wortelkanaalbehandeling",
    short: "Bij een ontstoken zenuw kan een wortelkanaalbehandeling helpen om de eigen tand te behouden.",
    group: "herstel",
    icon: "root",
    featured: true,
    need: "Wanneer de zenuw in een tand ontstoken of afgestorven is, kan dat pijn of een ontsteking veroorzaken. Een wortelkanaalbehandeling (zenuwbehandeling) heeft als doel de tand te behouden.",
    how: [
      "De tandarts onderzoekt de tand en legt uit of een wortelkanaalbehandeling een passende optie is.",
      "Onder verdoving worden de wortelkanalen gereinigd en vervolgens afgesloten.",
      "Daarna wordt besproken hoe de tand het beste kan worden hersteld, bijvoorbeeld met een vulling of een kroon.",
    ],
    faq: [
      { q: "Is een wortelkanaalbehandeling pijnlijk?", a: "De behandeling gebeurt onder verdoving. Na afloop kan de tand enkele dagen gevoelig zijn; u krijgt advies over wat u kunt verwachten." },
      { q: "Hoeveel afspraken zijn nodig?", a: "Dat hangt af van de situatie van de tand. De tandarts bespreekt dit vooraf met u." },
    ],
    seoTitle: "Wortelkanaalbehandeling (zenuwbehandeling) op Bonaire",
    seoDescription: "Wortelkanaalbehandeling bij Caribbean Dental Care in Kralendijk. Gericht op het behouden van uw eigen tand.",
  },
  {
    slug: "kronen",
    title: "Kronen",
    short: "Een kroon beschermt en herstelt een zwaar beschadigde of verzwakte tand.",
    group: "herstel",
    icon: "crown",
    featured: true,
    need: "Als een tand veel van zijn eigen structuur heeft verloren, bijvoorbeeld door een grote vulling, een breuk of na een wortelkanaalbehandeling, kan een kroon de tand beschermen.",
    how: [
      "De tandarts beoordeelt of een kroon in uw situatie de juiste keuze is.",
      "De tand wordt voorbereid en er wordt een afdruk of scan gemaakt.",
      "De kroon wordt op maat gemaakt en in een volgende afspraak geplaatst.",
    ],
    faq: [
      { q: "Hoe lang gaat een kroon mee?", a: "Dat hangt onder meer af van uw mondverzorging, uw beet en regelmatige controles. De tandarts kan u hierover adviseren." },
      { q: "Ziet een kroon er natuurlijk uit?", a: "De kleur en vorm worden zo goed mogelijk afgestemd op uw eigen tanden. Bespreek uw wensen gerust met de tandarts." },
    ],
    seoTitle: "Tandkronen laten plaatsen in Kralendijk, Bonaire",
    seoDescription: "Een kroon voor een beschadigde of verzwakte tand bij Caribbean Dental Care op Bonaire. Persoonlijk advies over uw mogelijkheden.",
  },
  {
    slug: "kindertandheelkunde",
    title: "Kindertandheelkunde",
    short: "Rustige, vriendelijke zorg voor kinderen, zodat zij met vertrouwen naar de tandarts gaan.",
    group: "kinderen",
    icon: "kids",
    featured: true,
    need: "Een goede start is belangrijk. Door kinderen al jong vertrouwd te maken met de tandarts, worden controles een normaal en ontspannen onderdeel van hun gezondheid.",
    how: [
      "We nemen de tijd om uw kind op zijn of haar gemak te stellen en leggen alles in begrijpelijke taal uit.",
      "Het gebit wordt gecontroleerd en waar nodig behandeld.",
      "Ouders krijgen praktische tips voor het poetsen en voor gezonde voeding.",
    ],
    faq: [
      { q: "Vanaf welke leeftijd kan mijn kind komen?", a: "Neem gerust contact op met de praktijk. Wij adviseren u over het juiste moment voor het eerste bezoek." },
      { q: "Mag ik als ouder mee in de behandelkamer?", a: "Neem contact op met de praktijk; we bespreken graag wat voor uw kind het prettigst is." },
    ],
    seoTitle: "Tandarts voor kinderen op Bonaire",
    seoDescription: "Kindvriendelijke tandheelkundige zorg bij Caribbean Dental Care in Kralendijk. Controle, preventie en behandeling voor kinderen.",
  },
  {
    slug: "kiespijn",
    title: "Kiespijn & pijnklachten",
    short: "Heeft u pijn? Bel de praktijk rechtstreeks, dan bekijken we samen wat er nodig is.",
    group: "herstel",
    icon: "pain",
    need: "Kiespijn kan veel oorzaken hebben, zoals een gaatje, een ontstoken zenuw, een gebroken tand of een tandvleesprobleem. Het is belangrijk om de oorzaak te laten onderzoeken.",
    how: [
      "Bel de praktijk en vertel welke klachten u heeft.",
      "De tandarts onderzoekt de oorzaak van de pijn.",
      "U hoort welke behandeling nodig is en welke opties er zijn.",
    ],
    note: "Bij ernstige zwelling, koorts, moeite met slikken of ademhalen: zoek direct medische hulp of bel 911.",
    faq: [
      { q: "Wat kan ik doen tot mijn afspraak?", a: "Bel de praktijk voor advies dat past bij uw klachten. Gebruik pijnstillers alleen volgens de bijsluiter." },
      { q: "Kan ik met spoed terecht?", a: "Bel de praktijk rechtstreeks. Telefonisch kan het beste worden beoordeeld wat er mogelijk is." },
    ],
    seoTitle: "Kiespijn op Bonaire? Bel Caribbean Dental Care",
    seoDescription: "Last van kiespijn of dringend tandheelkundige hulp nodig in Kralendijk? Bel Caribbean Dental Care rechtstreeks op +599 717 8106.",
  },
  {
    slug: "extracties",
    title: "Extracties",
    short: "Als een tand of kies niet meer te behouden is, wordt deze zorgvuldig verwijderd.",
    group: "herstel",
    icon: "extraction",
    need: "Soms is een tand of kies zo beschadigd of ontstoken dat behouden niet meer mogelijk of verstandig is. Een extractie kan dan de beste keuze zijn.",
    how: [
      "De tandarts onderzoekt de tand en bespreekt met u of een extractie nodig is.",
      "De extractie gebeurt onder plaatselijke verdoving.",
      "U krijgt duidelijke nazorginstructies mee voor thuis.",
    ],
    faq: [
      { q: "Wat moet ik doen na een extractie?", a: "U krijgt na de behandeling persoonlijke nazorginstructies. Neem contact op met de praktijk als u twijfelt of klachten heeft." },
    ],
    seoTitle: "Tand of kies laten trekken in Kralendijk",
    seoDescription: "Extracties onder plaatselijke verdoving bij Caribbean Dental Care op Bonaire, met duidelijke nazorginstructies.",
  },
  {
    slug: "beugels",
    title: "Beugels",
    short: "Orthodontische behandeling om de stand van tanden en kiezen te verbeteren.",
    group: "orthodontie",
    icon: "braces",
    need: "Scheve of verkeerd staande tanden kunnen het poetsen lastiger maken en invloed hebben op uw beet en uw glimlach.",
    how: [
      "Tijdens een beoordeling wordt gekeken naar de stand van uw tanden en uw beet.",
      "Op basis daarvan wordt besproken of een beugel een passende optie is.",
      "Tijdens de behandeling komt u regelmatig terug voor controle.",
    ],
    faq: [
      { q: "Is een beugel ook voor volwassenen?", a: "Orthodontie is niet alleen voor kinderen. Of een beugel geschikt is, hangt af van uw persoonlijke situatie." },
    ],
    seoTitle: "Beugel en orthodontie op Bonaire",
    seoDescription: "Informatie over beugels bij Caribbean Dental Care in Kralendijk. Vraag een persoonlijke beoordeling aan.",
  },
  {
    slug: "aligners",
    title: "Aligners",
    short: "Doorzichtige, uitneembare beugels voor wie een minder opvallende behandeling zoekt.",
    group: "esthetiek",
    icon: "aligner",
    need: "Aligners zijn transparante kunststof beugels die de tanden stap voor stap verplaatsen. Ze zijn nauwelijks zichtbaar en uitneembaar.",
    how: [
      "Tijdens een beoordeling wordt bekeken of aligners geschikt zijn voor uw situatie.",
      "Bij een passende indicatie wordt een persoonlijk behandelplan gemaakt.",
      "U draagt de aligners volgens het behandelplan en komt regelmatig op controle.",
    ],
    faq: [
      { q: "Zijn aligners voor iedereen geschikt?", a: "Nee. Of aligners een goede optie zijn, hangt af van de stand van uw tanden en uw beet. Dat wordt tijdens een beoordeling besproken." },
      { q: "Hoeveel uur per dag moet ik ze dragen?", a: "Het behandelplan geeft aan hoe lang u de aligners dagelijks draagt. Dat is belangrijk voor het resultaat." },
    ],
    seoTitle: "Aligners (onzichtbare beugel) in Kralendijk",
    seoDescription: "Doorzichtige aligners bij Caribbean Dental Care op Bonaire. Vraag een individuele beoordeling aan.",
  },
  {
    slug: "tandenbleken",
    title: "Tandenbleken",
    short: "Een lichtere tandkleur, na een beoordeling of bleken in uw situatie verantwoord is.",
    group: "esthetiek",
    icon: "whitening",
    need: "Tanden kunnen in de loop der jaren verkleuren, bijvoorbeeld door koffie, thee of roken. Tandenbleken kan de tanden lichter maken.",
    how: [
      "Eerst wordt gecontroleerd of uw tanden en tandvlees gezond genoeg zijn om te bleken.",
      "De tandarts bespreekt welke methode geschikt is en wat u realistisch kunt verwachten.",
      "Het bleken gebeurt volgens het afgesproken plan, met aandacht voor eventuele gevoeligheid.",
    ],
    faq: [
      { q: "Worden vullingen en kronen ook lichter?", a: "Nee, bleekmiddel heeft geen effect op vullingen, kronen of andere restauraties. De tandarts houdt hier rekening mee in het advies." },
      { q: "Kunnen mijn tanden gevoelig worden?", a: "Tijdelijke gevoeligheid kan voorkomen. Dit wordt vooraf met u besproken." },
    ],
    seoTitle: "Tandenbleken op Bonaire",
    seoDescription: "Tandenbleken bij Caribbean Dental Care in Kralendijk, na een individuele beoordeling. Vraag een afspraak aan.",
  },
];

export const featuredTreatments = treatments.filter((t) => t.featured);
export const getTreatment = (slug: string) => treatments.find((t) => t.slug === slug);
