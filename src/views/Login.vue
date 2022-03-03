<template>
<div class="flex">

  <div class="sidebar">

    <div class="logo flex">
      <div class="v-center logo-icon">
        <ion-icon name="code"></ion-icon>
      </div>
      <div class="v-center logo-text">Acodo</div>
    </div>

  </div>


  <div class="body" v-if="$route.path == '/account/login'">

    <div class="register-zone flex">
      <div class="v-center" style="margin-right: 15px;">
        <h4>New to Acodo?</h4>
      </div>
      <div class="v-center">
        <div @click="router_push('/account/register')" class="btn btn-grey">Create an account</div>
      </div>
    </div>


    <div class="v-center h100">
      <div>

        <div class="success-message" style="margin-bottom: 25px" v-if="$route.query.verified">We've successfully verified your email address! You may now login.</div>
        <div class="success-message" style="margin-bottom: 25px" v-if="$route.query.reset">We've successfully reset your password! You may now login.</div>


        <h1>Login <img src="@/assets/emojis/victory-hand.png" alt="" class="emoji"></h1>
        <h3>Welcome back to Acodo</h3>


        <div class="divider"></div>

        <div class="fail-message" v-if="login_error !== null">
          {{login_error}}
        </div>

        <p>Username or email</p>
        <input v-model="login_identifier" type="text" id="identifier" class="field" placeholder="Eg. example@example.com" autofocus>

        <p>Password</p>
        <input @keyup="if($event.keyCode == 13 && !login_loading){ login(); }" v-model="login_password" type="password" id="password" class="field" placeholder="Enter your password">

        <div class="divider"></div>

        <div class="button-container">
          <div @click="if(!login_loading){ login(); }" class="btn btn-primary btn-lg">Login <img v-if="login_loading" class="inline-loader betterIcon" src="@/assets/img/loader-white.png" alt=""></div>
        </div>

        <a class="forgot-password" @click="router_push('/account/forgot-password')">Forgot password</a>

      </div>
    </div>


  </div>

  <div class="body" v-if="$route.path == '/account/register'">

    <div class="v-center h100">
      <div>

        <h1>Register <img src="@/assets/emojis/wave.png" alt="" class="emoji"></h1>
        <h3>Welcome to Acodo, let's create an account</h3>


        <div class="divider"></div>

        <div class="fail-message" v-if="register_error !== null">
          {{register_error}}
        </div>





        <p>Username</p>
        <div style="position: relative; width: 320px;">
          <input @keyup="register_username = register_username.toLowerCase().slice(0,20).replace(/[^a-z0-9]/g,''); if(register_username.length>0){ checkUsernameAvailability(); }" v-model="register_username" type="text" id="identifier" class="field"
            placeholder="johndoe" autofocus>

          <div class="usernameStatus success v-center h100" v-if="usernameAvailable==true && register_username.length>0">
            <ion-icon name="checkmark"></ion-icon>
          </div>
          <div class="usernameStatus v-center h100" v-else-if="usernameAvailable==false && register_username.length>0">
            <ion-icon name="close"></ion-icon>
          </div>
          <div class="usernameStatus v-center h100" v-else-if="register_username.length>0">
            <img class="inline-loader" src="@/assets/img/loader-grey.png" alt="">
          </div>


        </div>

        <p>Email</p>
        <input v-model="register_email" type="email" id="identifier" class="field" placeholder="Eg. example@example.com">


        <p>Password</p>


        <div class="flex">

          <div>
            <input @keyup="if($event.keyCode == 13 && !register_loading){ register(); }" v-model="register_password" type="password" id="password" class="field" placeholder="Enter your password">

            <div class="divider"></div>

            <div class="button-container">
              <div class="btn btn-primary btn-lg" @click="if(!register_loading){ register(); }">Create account <img v-if="register_loading" class="inline-loader betterIcon" src="@/assets/img/loader-white.png" alt=""></div>
            </div>

            <a class="forgot-password" @click="router_push('/account/login')">I already have an account</a>

          </div>

          <div>
            <PasswordChecker :password="register_password"></PasswordChecker>
          </div>

        </div>

      </div>

    </div>

  </div>

  <div class="body" v-if="$route.path == '/account/forgot-password'">

    <div class="v-center h100">
      <div>

        <div class="success-message" style="margin-bottom: 25px" v-if="reset_sent">
          If an account exists with that address, we'll send a reset email.
        </div>

        <h1>Forgot password</h1>
        <h3>Oh no! Your password! It's broken!</h3>


        <div class="divider"></div>

        <p>Email</p>
        <input @keyup="if($event.keyCode == 13 && !loading_password_reset){ requestPasswordReset(); }" v-model="reset_email" type="email" id="identifier" class="field" placeholder="Eg. example@example.com">


        <div class="divider"></div>

        <div class="button-container">
          <div @click="if(!loading_password_reset){requestPasswordReset();}" class="btn btn-primary btn-lg">Send me a password reset <img v-if="loading_password_reset" class="inline-loader betterIcon" src="@/assets/img/loader-white.png" alt=""></div>
        </div>

        <a class="forgot-password" @click="router_push('/account/login')">I've remembered my login</a>

      </div>
    </div>

  </div>

  <div class="body" v-if="$route.path == '/account/verify-email'">

    <div class="v-center h100">
      <div>

        <div class="fail-message" style="margin-bottom: 25px" v-if="resend_status == false">{{resend_error}}</div>
        <div class="success-message" style="margin-bottom: 25px" v-if="resend_status == true">We've sent another email</div>

        <h1>Check your email</h1>
        <h3>We've sent a confirmation email<span v-if="isEmailValid($route.query.email)"> to <b class="blue">{{$route.query.email}}</b></span>.<br />Please click the link we've included so we can get your account up and running.</h3>

        <div class="divider"></div>

        <h3 style="margin-bottom: 10px;">Having trouble?</h3>
        <div @click="resendEmailVerification()" class="btn btn-primary btn-lg">Resend email</div>

      </div>
    </div>

  </div>

  <div class="body" v-if="$route.path == '/account/verify'">

    <div class="v-center h100">
      <div>

        <h1 v-if="verification_loading" style="text-align: center;"><img class="inline-loader" src="@/assets/img/loader-grey.png" alt=""></h1>

        <div v-if="verification_error">
          <div class="color-danger" style="font-size: 40px; margin-bottom: 20px;">
            <ion-icon name="warning"></ion-icon>
          </div>
          <h2>This verification link is invalid or has expired</h2>
        </div>

      </div>
    </div>

  </div>

  <div class="body" v-if="$route.path == '/account/reset-password'">

    <div class="v-center h100">
      <div>

        <div class="fail-message" style="margin-bottom: 25px;" v-if="reset_password_error !== null">{{reset_password_error}}</div>

        <h1>Reset your password</h1>
        <h3>We'll get you back to Acodo in no time!</h3>


        <div class="divider"></div>

        <p>Enter your new password</p>

        <div class="flex">

          <div>

            <input v-model="reset_password" type="password" id="password" class="field" placeholder="Password">

            <p>Re-enter password</p>

            <div style="position: relative; width: 320px;">

              <input @keyup="if($event.keyCode == 13 && !reset_loading){ resetPassword(); }" v-model="reset_password_again" type="password" id="identifier" class="field" placeholder="Password again">

              <div class="usernameStatus success v-center h100" v-if="reset_password_again==reset_password && reset_password_again.length>0">
                <ion-icon name="checkmark"></ion-icon>
              </div>
              <div class="usernameStatus v-center h100" v-else-if="reset_password_again!==reset_password && reset_password_again.length>0">
                <ion-icon name="close"></ion-icon>
              </div>
              <div class="usernameStatus v-center h100" v-else-if="register_username.length>0">
                <img class="inline-loader" src="@/assets/img/loader-grey.png" alt="">
              </div>
            </div>


            <div class="divider"></div>

            <div class="button-container">
              <div class="btn btn-primary btn-lg" @click="if(!reset_loading){ resetPassword(); }">Reset password <img v-if="reset_loading" class="inline-loader betterIcon" src="@/assets/img/loader-white.png" alt=""></div>
            </div>

          </div>

          <div>
            <PasswordChecker :password="reset_password"></PasswordChecker>
          </div>

        </div>

      </div>
    </div>

  </div>

</div>
</template>

<script>
import PasswordChecker from '@/components/PasswordChecker.vue'

export default {
  name: 'Login',
  components: {
    PasswordChecker
  },
  data() {
    return {
      login_identifier: "",
      login_password: "",
      register_username: "",
      usernameAvailable: null,
      register_email: "",
      register_password: "",
      reset_email: "",

      login_error: null,
      login_loading: false,
      register_loading: false,
      register_error: null,
      resend_status: null,
      resend_error: null,

      verification_loading: true,
      verification_error: false,

      loading_password_reset: false,
      reset_sent: false,
      reset_loading: false,

      reset_password: "",
      reset_password_again: "",
      reset_password_error: null

    }
  },
  methods: {

    isEmailValid(email) {
      const emailRegexp = new RegExp(
        /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
      )

      return emailRegexp.test(email)
    },

    login() {
      this.login_loading = true;
      this.login_error = null;

      this.api_request('POST', '/account/login', {
        'identifier': this.login_identifier,
        'password': this.login_password,
        'recaptcha_token': '' //TODO
      }, 1000).then((resp) => {

        this.login_loading = false;
        if (resp.status == 'fail') {
          this.login_error = resp.error_message;
          if (resp.hasOwnProperty('email_verify') && resp.email_verify) {
            this.router_push('/account/verify-email?email=' + this.login_identifier);
          }
        } else {
          this.login_error = null;
          this.$store.dispatch('getAccount', true);
          this.router_push('/my-courses');
        }
      });
    },

    register() {

      if (this.register_username.length < 1 || this.register_email.length < 1 || this.register_password < 1) {
        this.register_error = "Please complete all the fields";
      } else if (!this.usernameAvailable) {
        this.register_error = "The username you've chosen is not available";
      } else if (!this.isEmailValid(this.register_email)) {
        this.register_error = "The email you provided is not valid";
      } else if (!(new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(.){8,50}$")).test(this.register_password)) {
        this.register_error = "Your chosen password is not strong enough";
      } else {

        this.register_loading = true;
        this.register_error = null;

        this.api_request('POST', '/account/register', {
          'username': this.register_username,
          'email': this.register_email,
          'password': this.register_password,
          'recaptcha_token': ''
        }, 1000).then((resp) => {
          this.register_loading = false;
          if (resp.status == "fail") {
            this.register_error = resp.error_message;
          } else {
            this.register_error = null;
            this.router_push('/account/verify-email?email=' + this.register_email)
          }
        })
      }

    },

    requestPasswordReset() {

      this.loading_password_reset = true;
      this.api_request('POST', '/account/requestPasswordReset', {
        'email': this.reset_email,
        'recaptcha_token': ''
      }, 1000).then((resp) => {
        this.loading_password_reset = false;
        this.reset_sent = true;
      });

    },

    resetPassword() {

      if (this.reset_password.length == 0) {
        this.reset_password_error = "Please enter a new password";
      } else if (this.reset_password !== this.reset_password_again) {
        this.reset_password_error = "The two passwords do not match";
      } else if (!(new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(.){8,50}$")).test(this.reset_password)) {
        this.reset_password_error = "Your chosen password is not strong enough";
      } else {
        this.reset_loading = true;
        this.api_request('POST', '/account/submitPasswordReset', {
          'email': this.$route.query.email,
          'reset_token': this.$route.query.token,
          'new_password': this.reset_password,
          'recaptcha_token': ''
        }, 1000).then((resp) => {
          this.reset_loading = false;
          if (resp.status == "fail") {
            this.reset_password_error = resp.error_message;
          } else {
            this.router_push('/account/login?reset=true');
          }
        });
      }


    },


    resendEmailVerification() {

      this.api_request('POST', '/account/resendVerificationEmail', {
        'identifier': this.$route.query.email
      }).then((resp) => {
        if (resp.status == "fail") {
          this.resend_status = false;
          this.resend_error = resp.error_message;
        } else {
          this.resend_status = true;
        }
      });

    },

    checkUsernameAvailability() {

      this.usernameAvailable = null;
      this.api_request('GET', '/account/usernameAvailable/' + this.register_username, {}, 300).then((resp) => {
        this.usernameAvailable = resp.available;
      });

    }


  },

  mounted() {

    if (this.$route.path == '/account/verify') {
      this.api_request('POST', '/account/verifyEmail', {
        "email": this.$route.query.email,
        "verification_token": this.$route.query.token,
      }, 1500).then((resp) => {
        this.verification_loading = false;
        if (resp.status == "fail") {
          this.verification_error = true;
        } else {
          this.router_push('/account/login?verified=true');
        }
      });
    }

  }
}
</script>

<style lang="scss" scoped>
.sidebar {
    width: 30vw;
    background-color: #3A76F6;
    height: 100vh;
}

.body {
    padding: 0 120px;
    width: 70vw;
    position: relative;
}

.register-zone {
    position: absolute;
    top: 20px;
    right: 30px;
}

h1,
h2,
h3,
p {
    user-select: none;
}

h1 {
    color: #151538;
    margin-bottom: 10px;
}

h3 {
    color: #5F6266;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.8em;
}

h4 {
    font-weight: 500;
    font-size: 14px;
    color: #5F6266;
}

p {
    color: #5F6266;
    font-weight: 400;
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 5px;
}

.divider {
    margin-top: 40px;
}

.field {
    padding: 10px 15px;
    border: 1px solid #C4C4C4;
    border-radius: 5px;
    font-size: 14px;
    color: #5F6266;
    width: 320px;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: #005FFE;
    }

    &:hover {
        border-color: #005FFE;
    }
}

.field::placeholder {
    color: #C4C4C4;
    font-weight: 500;
}

b.blue {
    color: #005FFE;
}

.forgot-password {
    color: #005FFE;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
}

.btn {
    display: inline-block;
}

.button-container {
    margin-bottom: 20px;
}

.logo {
    color: #fff;
    margin-top: 25px;
    justify-content: center;

    .logo-icon {
        margin-right: 5px;
        ion-icon {
            font-size: 22px;
        }
    }
    .logo-text {
        font-weight: 600;
        font-size: 20px;
    }
}

.fail-message,
.success-message {
    background-color: #EC4747;
    color: #fff;
    font-size: 14px;
    padding: 7px 20px;
    border-radius: 6px;
    display: inline-block;
    max-width: 390px;
}

.success-message {
    background-color: #6FCF97;
}

.usernameStatus {
    position: absolute;
    top: 0;
    right: 10px;
    color: #EC4747;
    --ionicon-stroke-width: 48px;

    &.success {
        color: #6FCF97;
    }
}
</style>
