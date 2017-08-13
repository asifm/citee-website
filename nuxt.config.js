module.exports = {
  plugins: ['~plugins/vuetify.js'],

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
      src: './static/css/custom.scss',
      lang: 'scss',
    },
  ],
  /*
  ** Headers of the page
  */
  head: {
    title: 'CIT.ee | Darden School',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'CIT.ee: a Darden School Research Project',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://fonts.googleapis.com/css?family=Nixie+One:300,400,500,700|Open+Sans:300,400,500,700|Roboto:300,400,500,700|Material+Icons',
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
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
    vendor: ['vuetify'],
  },
};
