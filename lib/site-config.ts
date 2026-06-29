export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/community", label: "Community" },
] as const;

/** Book intake lives on /services#book */
export const bookHref = "/services#book";
export const bookQuoteHref = "/services?path=quote#book";
export const bookCallHref = "/services?path=call#book";

export const siteConfig = {
  name: "Kitty on Top Bartending",
  shortName: "KOT",
  tagline: "If your bar isn't memorable, your event isn't either.",
  email: "hello@kittyontopbartending.com",
  location: "Glenside, PA",
  hours: "Mon–Sat, 10am–8pm",
  regions: "Greater Philadelphia, PA · NJ · DE",
  social: {
    instagram: "https://instagram.com/kittyontopbartending",
    facebook: "https://facebook.com/kittyontopbartending",
  },
};
