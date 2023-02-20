import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: "#970b0b",
                secondary: "#261f1f",
                accent: "#fff",
            }
        }
    },
    icons: {
        iconfont: 'fa',
    },
});
