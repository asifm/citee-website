<template lang="pug">
div
    div.container
        div.fullscreen-video-wrap
            //- video(src="~assets/video/usmap-dark-rays.mp4" autoplay loop)
            //- video(src="~assets/video/abstract-network-loop.mp4" autoplay loop)
            //- video(src="~assets/video/city-still-day.mp4" autoplay loop)
            video(src="~assets/video/abstract-network-yellowish.mp4" autoplay loop)
            //- video(src="~assets/video/abstract-network-blueish.mp4" autoplay loop)
        div.header-overlay
        div.header-content.elevation-10
            h3.display-1#text-bg.pa-3.white--text Cities Innovating Tomorrow's Entrepreneurial Ecosystems
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
</style>
