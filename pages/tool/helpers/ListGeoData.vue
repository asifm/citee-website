<template lang="pug">

v-card(hover).mr-2.mb-2.pa-2#geodata-card
  v-list(
    two-line dark dense 
    v-for="(elem) in geoData.slice(beginIndex, endIndex)" 
    :key="elem.code"
    ).pa-0
    v-divider
    v-list-tile(:class=" elem.value ? 'blue-grey darken-3' : 'blue-grey lighten-1' " hover)
      v-tooltip(top)
        v-list-tile-content(slot="activator")
          v-list-tile-sub-title.mb-0 {{ elem.name }}
          v-list-tile-title(:class = "{ 'cbsa': elem.code === '310' }").ma-0 {{ elem.value }}
        span.tooltip {{ elem.value }}
</template>
<script>
export default {
  props: {
    geoData: Array,
    beginIndex: null,
    endIndex: null,
  },
  data() {
    return {
      // cbsa: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.list__tile__sub-title {
  font-size: 0.7em;
}
.list__tile__title {
  font-size: 0.8em;
}

#geodata-card {
  font-family: Open Sans;
  // font-size: 8px !important;
}
.cbsa {
  font-size: 1.1em;
  // color: yellowgreen;
}
.tooltip {
  font-family: Open Sans;
  // background-color: whitesmoke;
}
</style>

