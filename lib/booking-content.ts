export const BOOKING_PROCESS = [
  {
    step: "01",
    title: "Submit your brief",
    body: "Choose a planning call or full quote path. Tell us about your event, guests, and menu vision.",
  },
  {
    step: "02",
    title: "We review & respond",
    body: "Our team reviews your details and responds within 24–48 hours with next steps or a custom proposal.",
  },
  {
    step: "03",
    title: "Menu & logistics",
    body: "We refine cocktails, bar setup, staffing, and timing — tailored to your venue and vibe.",
  },
  {
    step: "04",
    title: "Event day",
    body: "KOT arrives ready to pour. You enjoy the celebration — we handle the bar experience.",
  },
] as const;

export const BOOKING_GOOD_FIT = [
  "Private parties, weddings, and milestone celebrations",
  "Corporate galas, activations, and client entertainment",
  "Cocktail classes — in-person or virtual",
  "Events in Greater Philadelphia, NJ, or DE",
  "Hosts who want a premium, intentional bar experience",
] as const;

export const BOOKING_NOT_FIT = [
  "Cash bars without a minimum beverage budget",
  "Venues that don't allow licensed mobile bartending",
  "Last-minute requests with less than 2 weeks notice",
  "Events outside our service regions",
] as const;

export const BOOKING_FAQ = [
  {
    q: "How far in advance should I book?",
    a: "We recommend 4–8 weeks for private events and 6–12 weeks for corporate dates. Reach out sooner for peak season — we'll do our best to accommodate.",
  },
  {
    q: "What's included in a quote?",
    a: "Staffing, bar setup, custom menu development, mixers and garnishes, and professional service. Spirits can be included or BYOB depending on your event.",
  },
  {
    q: "Do you provide the alcohol?",
    a: "We can coordinate spirit procurement or work with your preferred BYOB setup. We'll discuss options during your inquiry.",
  },
  {
    q: "Can I schedule a call instead of submitting a form?",
    a: "Absolutely. Pick an open 30-minute slot and we'll talk through your event before sending a formal proposal.",
  },
] as const;
