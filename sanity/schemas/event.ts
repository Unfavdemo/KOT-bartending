import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "venue", title: "Venue", type: "string" }),
    defineField({ name: "externalLink", title: "External Link", type: "url" }),
    defineField({ name: "image", title: "Image", type: "image" }),
  ],
});
