<template lang="pug">
  v-container
    v-layout
      v-card
        p Ea ea qui laborum quis non laboris. Adipisicing excepteur magna duis laborum ut dolor id labore. Do officia magna ea reprehenderit velit anim. Qui esse culpa aute anim fugiat proident ut commodo dolore culpa aute id. Dolore exercitation pariatur qui magna ex esse pariatur nisi dolore esse enim veniam.
</template>

<script>
import { loadGoogleMapsAPI } from 'load-google-maps-api';
// import { main } from '../../assets/js/mapHelpers/drawMap';

// console.log(avar);
export default {
  mounted() {
    loadGoogleMapsAPI()
      .then(googleMaps => console.log(googleMaps))
      .catch((err) => {
        console.error('err', err);
      });
  },
};
</script>

