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
          v-if="AuthWrapper?.IsAuthenticated()"
          color="primary"
          icon="account_circle"
          :label="AuthWrapper?.User.username ?? ''"
        >
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Locale: {{ AuthWrapper.User.locale }}</q-item-label
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
import { AuthWrapper } from 'src/boot/qiksar';
import getEntityLinks from 'src/domain/GetEntityLinks';

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

  ...getEntityLinks(),
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
        AuthWrapper.Login('/');
      },
      onLogoutClick() {
        AuthWrapper.Logout();
      },
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      AuthWrapper,
    };
  },
});
</script>
