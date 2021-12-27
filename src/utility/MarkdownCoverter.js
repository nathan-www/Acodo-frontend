export function MarkdownCoverter(markdown) {

  if (markdown == null) {
    return "";
  }

  function HTMLentities(r) {
    return r.replace(/[\x26\x0A\<>'"]/g, function(r) {
      return "&#" + r.charCodeAt(0) + ";"
    })
  }

  function inlineModifiers(str) {
    str = str.replaceAll(/\*\*(.+?)\*\*/g, (r) => "<strong>" + r.slice(2, -2) + "</strong>");
    str = str.replaceAll(/__(.+?)__/g, (r) => "<strong>" + r.slice(2, -2) + "</strong>");
    str = str.replaceAll(/\*(.+?)\*/g, (r) => "<i>" + r.slice(1, -1) + "</i>");
    str = str.replaceAll(/_(.+?)_/g, (r) => "<i>" + r.slice(1, -1) + "</i>");
    str = str.replaceAll(/`(.+?)`/g, (r) => "<span class='inline-code'>" + r.slice(1, -1) + "</span>");
    str = str.replaceAll(/\[(.*?)\]\((.*?)\)/g,(link) => {
      let text = link.match(/\[(.*?)\]/)[1];
      let url = link.match(/\((.*?)\)/)[1];

      if(url.match(/^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/) == null){
        return "[Invalid URL]";
      }

      return '<a href="' + url + '" target="_blank" rel="nofollow">' + text + '</a>';
    });
    str = str.replaceAll(/\&\#60\;(.+?)\&\#62\;/g,(link) => {

      if(link.slice(5,-5).match(/^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/) == null){
        return link;
      }
      return '<a href="' + link.slice(5,-5) + '" target="_blank" rel="nofollow">' + link.slice(5,-5) + '</a>';
    });
    return str;
  }


  let lines = markdown.split('\n').map((line) => HTMLentities(line));

  let elements = lines.reduce((prev, curr, index, arr) => {

    if(curr.match(/^[\*]{3,}$/) !== null || curr.match(/^[_]{3,}$/) !== null){
        return [].concat(prev,["<div class='horizotal-rule'></div>"]);
    }

    if (curr.startsWith("\t") || curr.startsWith("    ")) {
      if (prev.length > 0 && prev[prev.length - 1].startsWith("<div class='code-block'>")) {

        if (curr.startsWith("\t")) {
          curr = curr.slice(1);
        } else {
          curr = curr.slice(4);
        }

        prev[prev.length - 1] = prev[prev.length - 1].slice(0, -6) + "<br>" + curr.replaceAll(" ", "&nbsp;") + "</div>";
        return prev;
      }
      return [].concat(prev, ["<div class='code-block'>" + curr.slice(1).replaceAll(" ", "&nbsp;") + "</div>"]);

    } else {

      curr = inlineModifiers(curr);

      if (curr.startsWith("#")) {
        return [].concat(prev, ["<h3>" + curr.slice(1) + "</h3>"]);
      } else if (curr == "") {
        return [].concat(prev, ["<p></p>"]);
      } else {
        if (prev.length > 0 && prev[prev.length - 1].startsWith("<p>")) {
          prev[prev.length - 1] = prev[prev.length - 1].slice(0, -4) + " " + curr + "</p>";
          return prev;
        }
        return [].concat(prev, ["<p>" + curr + "</p>"]);
      }

    }

  }, []).map((el) => el.replaceAll("\t", "&nbsp;&nbsp;&nbsp;"));


  return elements.join("");
}
