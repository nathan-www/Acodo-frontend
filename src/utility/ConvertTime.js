export function ConvertTime(timestamp, type="absolute") {

  let current = Math.round(+(new Date()) / 1000);

  let old = new Date(timestamp * 1000);
  let newd = new Date();

  if ((current - timestamp) < 60) {
    return "just now";
  } else if ((current - timestamp) < 120) {
    return "1 minute ago";
  } else if (Math.floor((current - timestamp) / 60) < 60) {
    return Math.floor((current - timestamp) / 60) + " minutes ago";
  } else if (Math.floor((current - timestamp) / (60 * 60)) == 1) {
    return "1 hour ago";
  } else if (Math.floor((current - timestamp) / (60 * 60)) < 24) {
    return Math.floor((current - timestamp) / (60 * 60)) + " hours ago";
  }

  if (type == "relative") {

    if (Math.floor((current - timestamp) / (60 * 60 * 24)) == 1) {
      return "Yesturday";
    } else if (Math.floor((current - timestamp) / (60 * 60 * 24)) < 7) {
      return Math.floor((current - timestamp) / (60 * 60 * 24)) + " days ago";
    } else if ((Math.floor((current - timestamp) / (60 * 60 * 24 * 7))) == 1) {
      return "1 week ago";
    } else if ((Math.floor((current - timestamp) / (60 * 60 * 24 * 7))) < 5) {
      return (Math.floor((current - timestamp) / (60 * 60 * 24 * 7))) + " weeks ago";
    } else if (Math.floor((current - timestamp) / (60 * 60 * 24 * 30)) == 1) {
      return "1 month ago";
    } else if (Math.floor((current - timestamp) / (60 * 60 * 24 * 30)) < 12) {
      return Math.floor((current - timestamp) / (60 * 60 * 24 * 30)) + " months ago";
    } else if (Math.floor((current - timestamp) / (60 * 60 * 24 * 360)) == 1) {
      return "1 year ago";
    } else {
      return Math.floor((current - timestamp) / (60 * 60 * 24 * 360)) + " years ago";
    }

  } else {

    if (Math.floor((current - timestamp) / (60 * 60 * 24)) == 1) {
      return "Yesterday, " + ("0" + old.getHours()).slice(-2) + ":" + ("0" + old.getMinutes()).slice(-2);
    } else if (old.getFullYear() == newd.getFullYear()) {
      return old.getDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][old.getMonth()];
    } else {
      return old.getDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][old.getMonth()] + ", " + old.getFullYear();
    }

  }



}
