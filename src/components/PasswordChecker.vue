<template>

<div class="password-criteria" v-if="password.length > 0">

  <p>Password must contain:</p>
  <p class="criterion success" v-if="password.length >= 8">
    <ion-icon class="betterIcon" name="checkmark"></ion-icon> At least 8 characters
  </p>
  <p class="criterion" v-else>At least 8 characters</p>

  <p class="criterion success" v-if="password.match(/[A-Za-z]/) !== null">
    <ion-icon class="betterIcon" name="checkmark"></ion-icon> At least 1 letter
  </p>
  <p class="criterion" v-else>At least 1 letter</p>

  <p class="criterion success" v-if="password.match(/[0-9]/) !== null">
    <ion-icon class="betterIcon" name="checkmark"></ion-icon> At least 1 number
  </p>
  <p class="criterion" v-else>At least 1 number</p>
</div>

</template>

<script>
export default {
  name: "PasswordChecker",
  props: {
    password: {}
  },
  methods: {
    isValid: function(){
      return (new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(.){8,50}$")).test(this.password);
    }
  }
}
</script>

<style lang="scss" scoped>

.password-criteria {

    background-color: #F8F8FA;
    margin-left: 20px;
    padding: 15px 25px;
    border-radius: 5px;
    --ionicon-stroke-width: 48px;

    p:not(.criterion) {
        margin: 0 0 5px;
    }

    p.criterion {
        color: #EC4747;
        margin: 0 0 3px;

        &.success {
            color: #6FCF97;
        }
    }

}



</style>
