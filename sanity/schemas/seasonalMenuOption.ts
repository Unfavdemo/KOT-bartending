import { defineField, defineType } from "sanity";

export const seasonalMenuOption = defineType({
  name: "seasonalMenuOption",
  title: "Seasonal Menu Option",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "image", title: "Image", type: "image" }),
  ],
});
