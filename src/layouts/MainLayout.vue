<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css">
    </q-header>
    <q-page-container>
      <router-view/>
      <div style="margin-top: 5%">
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'MainLayout',
}
</script>
