<template lang="pug">
div

    v-layout.justify-center.container
        //- v-flex(xs12 sm8 md5 lg4).pa-0
        //-   h1.display-1.pa-3.white--text.elevation-12#text-bg Cities Innovating Tomorrow's Entrepreneurial Ecosystems

        div.fullscreen-video-wrap
            //- video(src="~assets/video/usmap-dark-rays.mp4" autoplay loop)
            video(src="~assets/video/abstract-network-loop.mp4" autoplay loop)
            //- video(src="~assets/video/city-still-day.mp4" autoplay loop)
            //- video(src="~assets/video/abstract-network-yellowish.mp4" autoplay loop)
            //- video(src="~assets/video/abstract-network-blueish.mp4" autoplay loop)
        div.header-overlay
        div.header-content.elevation-10
            img(src="~/assets/img/citee-logo-white.svg").ma-3.dropshadow.opacity-6
            h1.display-1#text-bg.pa-3.white--text Cities Innovating Tomorrow's Entrepreneurial Ecosystems
</template>

<style scoped>
.container {
    max-width: 960px;
    padding-left: 1rem;
    padding-right: 1rem;
    margin: auto;
    text-align: center;
    height: 100vh;
    display: flex;
    align-items: center;
}

.fullscreen-video-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.fullscreen-video-wrap video {
    min-height: 100%;
    min-width: 100%;
}

.header-overlay {
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1;
    background: #232d4b;
    opacity: 0.4;
}

.header-content {
    z-index: 2;
}
#text-bg {
    background-color: rgba(0, 18, 42, 0.6);
}
img {
    width: 300px;
  }
</style>
