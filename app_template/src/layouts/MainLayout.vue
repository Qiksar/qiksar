<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>QIKSAR DEMO APP</q-toolbar-title>

        <q-btn-dropdown
          v-if="Qiksar.AuthWrapper?.IsAuthenticated()"
          color="primary"
          icon="account_circle"
          :label="Qiksar.AuthWrapper?.User.username ?? ''"
        >
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Locale: {{ Qiksar.AuthWrapper.User.locale }}</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onUserDropdownClick">
              <q-item-section>
                <q-item-label>Photos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onUserDropdownClick">
              <q-item-section>
                <q-item-label>Videos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onLogoutClick">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn v-else label="Log In" @click="onLogInClick" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue';
import { defineComponent, ref } from 'vue';
import BuildEntityNavLinks from 'src/qiksar/qikflow/router/BuildEntityNavLinks';
import Qiksar from 'src/qiksar/qiksar';

const linksList = [
  {
    title: 'Home',
    caption: 'Home page',
    icon: 'house',
    link: '/',
  },
  {
    title: 'Dashboard',
    caption: 'Data Analytics',
    icon: 'dashboard',
    link: '/dashboard',
  },

  ...BuildEntityNavLinks(),
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      onUserDropdownClick() {
        // console.log('Clicked on an Item')
      },
      onLogInClick() {
        Qiksar.AuthWrapper.Login('/');
      },
      onLogoutClick() {
        Qiksar.AuthWrapper.Logout();
      },
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      Qiksar,
    };
  },
});
</script>
