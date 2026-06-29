export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  cta: string;
  image: string;
  anchor: string;
}

export const services: Service[] = [
  {
    id: "private-parties",
    title: "Private Parties",
    shortDescription:
      "Create a memorable experience to celebrate your wedding, birthday, graduation, or any milestone!",
    fullDescription:
      "We specialize in crafting custom bar menus based on your tastes and what we know will please your crowd — all you need to do is enjoy. From intimate gatherings to grand celebrations, every pour is intentional.",
    cta: "Elevate Your Party",
    image: "/images/services/private-parties.svg",
    anchor: "private-parties",
  },
  {
    id: "corporate-events",
    title: "Corporate Events",
    shortDescription:
      "From employee appreciation to building partnerships, our expert bartenders create experiences that impress.",
    fullDescription:
      "From employee appreciation to building partnerships, our expert bartenders go beyond serving simple drinks — they create an experience that impresses on everyone your business needs to entertain. Brand activations, galas, and executive receptions done right.",
    cta: "Make an Impact",
    image: "/images/services/corporate-events.svg",
    anchor: "corporate-events",
  },
  {
    id: "cocktail-classes",
    title: "Cocktail Classes",
    shortDescription:
      "In-person classes, virtual tutorials, and executive cocktail instruction for every skill level.",
    fullDescription:
      "For the amateur host to the at-home cocktail guru, we have in-person classes, virtual tutorials, and executive cocktail instruction that can take your cocktail-making skills to new heights. Learn the craft and impress your guests.",
    cta: "Create Better Cocktails",
    image: "/images/services/cocktail-classes.svg",
    anchor: "cocktail-classes",
  },
];
