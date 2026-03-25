import { defineType, defineField } from 'sanity'

export default defineType({
  title: 'Temperature',
  name: 'temperature',
  type: 'object',
  description: 'Will convert from ºC to ºF on the front-end',
  icon: () => 'ºC/F',
  fields: [
    defineField({
      name: 'temperature',
      title: 'Temperature',
      type: 'number',
    }),
    defineField({
      name: 'measurement',
      title: 'Measurement',
      type: 'string',
      options: {
        list: [
          { title: 'ºC', value: 'celsius' },
          { title: 'ºF', value: 'fahrenheit' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
})
