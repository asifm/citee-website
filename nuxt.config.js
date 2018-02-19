module.exports = {
    plugins: [
        '~plugins/vuetify.js',
        '~plugins/vue-axios.js',
        '~plugins/vee-validate.js',
        { src: '~plugins/vue2-leaflet.js', ssr: false },
        { src: '~plugins/vue2-google-maps.js', ssr: false },
    ],

    modules: [
        '@nuxtjs/markdownit',
        // '@nuxtjs/webpackmonitor',
        // "@nuxtjs/webpackmonitor": "^0.1.0",
    ],

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
        {
            src: './assets/css/vue2-animate.min.css',
            lang: 'css',
        },
        {
            src: './assets/font/mdi/css/materialdesignicons.min.css',
            lang: 'css',
        },
    ],
    /*
  ** Headers of the page
  */
    head: {
        title: 'CITee | Darden',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                name: 'description',
                content: `CITee means "Cities Innovating Tomorrow's Entrepreneurial Ecosystems." 
                It's a Darden School of Business research project.`,
            },
        ],
        script: [
            // { src: 'https://use.typekit.net/pbg0kfs.js' }, { innerHTML: 'try { Typekit.load({ async: true }); } catch (e) {}' },
        ],
        // Needed if innerhtml for script contains quotations which shouldn't be escaped
        // __dangerouslyDisableSanitizers: [ 'script' ],
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
                    'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700|Libre+Franklin:300,500,700|Material+Icons',
            },
            {
                rel: 'stylesheet',
                type: 'text/css',
                href:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css',
            },
        ],
    },
    /*
  ** Customize the progress-bar color
  */
    loading: { color: '#3B8070' },
    /*
  ** Dev configuration
  */
    devtool: 'source-map',
    /*
  ** Build configuration
  */
    build: {
        devtool: 'source-map',
        extractCSS: true,
        // analyze: true,
        // experimental, turn off if doesn't work
        // dll: true,
        vendor: [
            'axios',
            'vuetify',
            'vue2-leaflet',
            // 'vee-validate',
            'leaflet',
            'd3',
            'vue2-google-maps',
            'vue-axios',
        ],
    },
};
