<template lang="pug">
  v-app
    //- top bar
    v-toolbar.elevation-3
      img(src="~/assets/img/darden_rgb-02.png" height="60px")
      v-spacer
      img(src="~/assets/img/citee-logo-02.svg" height="50px")
    //-page content
    nuxt
    //- Footer
    v-container(fluid).secondary.footer-about.pa-5.elevation-3
      v-layout(row wrap).grey--text.text--lighten-1
        //- v-flex(sm5 offset-sm1 md4 offset-md1)
        v-flex(sm5 md4 offset-md2)
          h5.white--text ABOUT DARDEN SCHOOL OF BUSINESS
          p The University of Virginia Darden School of Business delivers the world’s best business education experience to prepare entrepreneurial, global and responsible leaders through its MBA, Ph.D. and Executive Education programs. Darden’s top-ranked faculty is renowned for teaching excellence and advances practical business knowledge through research. Darden was established in 1955 at the University of Virginia, a top public university founded by Thomas Jefferson in 1819 in Charlottesville, Virginia.
          v-btn.btn--outline.ml-0.primary
            a(href="http://www.darden.virginia.edu/") Learn More
          br
          v-icon(dark).pr-1 mdi-twitter
          span 
            a(href="https://twitter.com/@DardenMBA") @DardenMBA
          br
          v-icon(dark).pr-1 mdi-email
          span 
            a(href="mailto:Darden@virginia.edu") Darden@virginia.edu
          br
        
        //- v-flex(sm5 offset-sm1 md4 offset-md1)
        v-flex(sm5 md4 offset-sm1)
          h5.white--text ABOUT BATTEN INSTITUTE 
          p  The Batten Institute for Entrepreneurship and Innovation at the Darden School of Business improves the world by creating knowledge about the transformative power of entrepreneurship and innovation and by cultivating principled, entrepreneurial leaders. The Institute's research initiative advances knowledge that addresses real-world challenges and shapes Darden's curriculum, and its educational offerings are ranked top 10 in the world. The Batten Institute was established by the vision and philanthropy of UVA alumnus Frank Batten Sr.
          v-btn.btn--outline.ml-0.primary
            a(href="http://www.darden.virginia.edu/") Learn More
          br
          v-icon(dark).pr-1 mdi-twitter
          span
            a(href="@BattenInstitute") @BattenInstitute 
          br
          v-icon(dark).pr-1 mdi-email
          span 
            a(href="mailto:Batten@darden.virginia.edu") Batten@darden.virginia.edu
      p.white--text.pt-5.text-sm-center © 2017 BY THE RECTOR AND VISITORS OF THE UNIVERSITY OF VIRGINIA
</template>
