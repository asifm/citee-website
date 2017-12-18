<template lang="pug"> 
v-card(hover).mr-2.mb-2.pa-2
  v-list(two-line dark dense v-for="elem in geoData.slice(beginIndex, endIndex)" :key="elem.code" )
    v-divider
    v-list-tile(:class="elem.value ? 'grey darken-3' : 'grey darken-1'")
      v-tooltip(top)
        v-list-tile-content(slot="activator")
          v-list-tile-sub-title.mb-0 {{ elem.name }} &nbsp;&nbsp;&nbsp;
            span.geoid {{ elem.geoid }}
          v-list-tile-title(:class = "{ 'cbsa': elem.code === '310' }").ma-0 {{ elem.value }}
        span.tooltip {{ elem.value }}
          br
        span.tooltip Identifying Code: {{ elem.geoid }}
</template>
<script>
export default {
  props: {
    geoData: Array,
    beginIndex: null,
    endIndex: null,
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
}
.cbsa {
  font-size: 1.1em;
}
.tooltip {
  font-family: Open Sans;
}
</style>

