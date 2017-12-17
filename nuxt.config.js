module.exports = {
  plugins: [
    '~plugins/vuetify.js',
    '~plugins/vee-validate.js',
    { src: '~plugins/vue2-leaflet.js', ssr: false },
  ],

  modules: ['@nuxtjs/markdownit'],

  // markdownit options https://github.com/markdown-it/markdown-it
  markdownit: {
    preset: 'default',
    html: true,
    linkify: false,
    breaks: true,
    typographer: true,
    use: [
      'markdown-it-container',
      'markdown-it-attrs',
      'markdown-it-footnote',
      'markdown-it-abbr',
      'markdown-it-deflist',
      'markdown-it-front-matter',
    ],
  },
  css: [
    {
      src: './assets/css/app.styl',
      lang: 'styl',
    },
    {
      src: './assets/css/custom.scss',
      lang: 'scss',
    },
  ],
  /*
  ** Headers of the page
  */
  head: {
    title: 'CIT.ee | Darden',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: `CIT.ee means "Cities Innovating Tomorrow's Entrepreneurial Ecosystems. 
          It's a research project at the Darden School of Business.`,
      },
    ],
    script: [
      { src: 'https://use.typekit.net/pbg0kfs.js' },
      { innerHTML: 'try { Typekit.load({ async: true }); } catch (e) {}' },
    ],
    // Needed if innerhtml for script contains quotations which shouldn't be escaped
    __dangerouslyDisableSanitizers: ['script'],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/vue2-animate.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700|Libre+Franklin:300,500,700|Material+Icons',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/font/mdi/css/materialdesignicons.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css',
      },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    analyze: true,
    // experimental, turn off if doesn't work
    // dll: true,
    /*
    ** NO NEED for eslint it's already is used separately
    ** Run ESLINT on save
    */
    // extend(config, ctx) {
    //   if (ctx.isDev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/,
    //     });
    //   }
    // },
    // add external packages here so that they're loaded only once
    // Is it needed only for vue plugins, or all packages?
    vendor: [
      'axios',
      'vuetify',
      'vue2-leaflet',
      'leaflet',
      'vee-validate',
      'd3',
      'load-google-maps-api',
    ],
  },
};
