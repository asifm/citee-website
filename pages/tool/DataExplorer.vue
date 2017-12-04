<template lang="pug">
v-container(fluid)
  v-toolbar.secondary(dark)
    v-toolbar-title 
      h4 Metro Data Explorer

  //- top row for controls; alternatively, controls on the side of the scatter plot in a single column
  v-layout
    v-flex(lg3)
      //- select x and y variables
      v-card.pa-4.grey.lighten-4.card--raised
        v-select(label="Variable for x axis")
        v-select(label="Variable for y axis")
    v-flex(lg3)
      v-card.pa-4.card--raised
        v-select(label="Variable for circle size")
        v-select(label="Variable for circle color")
    v-flex(lg3)
      v-card.pa-4.grey.lighten-4.card--raised
        v-select(label="Variable for map circle size")
        //- use log scale
        v-slider(label="Select metro population range")
    v-flex(lg3)
      v-card.pa-4.card--raised
        v-select(label="Select metro")
        v-select(label="Select state")
  
  //- scatter plot; main visual element of the map; center and big
  v-layout
    v-flex(lg8)
  
  v-layout
    //- map
    v-flex(lg6)
    //- top and bottom metros
    v-flex(lg6)
      v-layout
        //- top 5
        v-flex(lg6)
        //- bottom 5
        v-flex(lg6)
</template>
