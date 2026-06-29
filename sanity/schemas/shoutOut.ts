import { defineField, defineType } from "sanity";

export const shoutOut = defineType({
  name: "shoutOut",
  title: "Shout Out",
  type: "document",
  fields: [
    defineField({ name: "clientName", title: "Client Name", type: "string" }),
    defineField({ name: "eventType", title: "Event Type", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text" }),
    defineField({ name: "image", title: "Photo", type: "image" }),
  ],
});
