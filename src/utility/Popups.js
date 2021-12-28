function Banner(error, type = "error", showtime=7000, showClose=true) {

  let error_id = 'error-' + Math.round(Math.random() * 10000);
  let errorbanner = document.createElement('div');

  if(showClose){
    showClose = "";
  } else {
    showClose = "display: none;"
  }

  errorbanner.innerHTML = '<div class="error-banner flex '+type+'" id="error-' + error_id + '"><div class="v-center">' + error + '</div><div style="'+showClose+'" class="v-center error-banner-close" onclick="document.getElementById(\'error-' + error_id + '\').classList.add(\'slideup\')"><ion-icon name="close-outline"></ion-icon></div></div>'
  document.body.appendChild(errorbanner);


  setTimeout(() => {
    document.getElementById("error-" + error_id).classList.add('slideup');
  }, showtime);

  setTimeout(() => {
    document.getElementById("error-" + error_id).remove();
  }, (showtime + 1000));


}


function ConfirmDialog(title, subtitle, confirm_text = "Confirm", color = "danger", cancel_text = "Cancel") {

  var confirm_id = 'confirm-' + Math.round(Math.random() * 10000);
  let confirm_dialog = document.createElement('div');
  confirm_dialog.innerHTML = '<div id="' + confirm_id + '" class="dialog"><div class="body"><h3>' + title + '</h3><p>' + subtitle + '</p></div><div class="buttons flex"><div data-cancel-btn class="btn btn-grey">' + cancel_text + '</div><div data-confirm-btn class="btn btn-' + color + '">' + confirm_text + '</div></div></div>';
  document.body.appendChild(confirm_dialog);

  return new Promise(function(resolve, reject) {

    setTimeout(function() {

      function hide(){
          document.querySelector("#" + confirm_id).classList.add('shrunk');
          setTimeout(() => {
              document.querySelector("#" + confirm_id).remove();
          },500);
      }

      document.querySelector("#" + confirm_id + " [data-confirm-btn]").onclick = () => {
        hide();
        resolve();
      };
      document.querySelector("#" + confirm_id + " [data-cancel-btn]").onclick = () => {
        hide();
        reject();
      };
    }, 200);

  });

}


export {
  Banner,
  ConfirmDialog
}
