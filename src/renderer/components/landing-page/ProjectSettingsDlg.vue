<template>
  <v-dialog
    v-model="show"
    scrollable
    max-width="300px"
  >
    <v-card>
      <v-card-title>Select Project Type</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 150px;">
        <v-radio-group
          v-model="projectType"
          column
        >
          <v-radio
            label="Vue project"
            value="vue"
          ></v-radio>
          <v-radio
            label="React Native project"
            value="rn"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="blue darken-1"
          flat
          @click="closeDlg"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          flat
          @click="closeDlg"
        >
          Select
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'project-settings-dlg',
    props: ['show'],
    data: () => ({
      projectType: 'vue'
    }),
    methods: {
      closeDlg: function () {
        this.$emit('close-dialog')
      }
    }
  }
</script>

<style>

</style>
