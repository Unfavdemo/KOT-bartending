export interface Testimonial {
  id: string;
  quote: string;
  author?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "I 100% recommend Kitty On Top! I had the most amazing engagement party thanks to them! The bartenders we had were Titi and Tia and they made the party. Super professional 10/10 service and were extremely helpful.",
    author: "Engagement Party Client",
  },
  {
    id: "2",
    quote:
      "Kitty and her crew pour love and flavor into every drink they create! I love how she is able to meld personalities and vibes into the perfect cocktail! Try one of her classes or events you won't be disappointed!",
    author: "Cocktail Class Guest",
  },
  {
    id: "3",
    quote:
      "Kitty on Top curated an amazing experience for a surprise birthday party for my husband. The experience went far beyond my expectation; everyone in attendance raved about the amazing Bourbon tasting!",
    author: "Birthday Celebration Host",
  },
];
