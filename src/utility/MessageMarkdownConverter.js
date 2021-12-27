var MessageMarkdownToEditable = (markdown) => {

    let message = MessageMarkdownToHTML(markdown);
    message = message.replaceAll("<span class='inline-code'>","<code>");
    message = message.replaceAll("</span>","</code>");
    message = message.replaceAll("<div class='code-block'>",'<pre class="ql-syntax" spellcheck="false">');
    message = message.replaceAll("</div>","</pre>");

    if(!message.trim().startsWith("<pre")){
        message = "<p>" + message + "</p>";
    }

    return message;
}

var MessageHTMLToMarkdown = (html) => {

  var he = require('he');

  let message = html.replaceAll("</p>", "\n");
  message = message.replaceAll("<p>", "");
  message = message.replaceAll("&nbsp;", " ");
  message = message.replaceAll("<br>", "");
  message = message.replaceAll("*", "&#42;");
  message = message.replaceAll("_", "&#95;");
  message = message.replaceAll("`", "&#96;");

  message = message.replaceAll(/<strong>(.+?)<\/strong>/g, (e) => {
    return e.replace("<strong>", "**").replace("</strong>", "**");
  });

  message = message.replaceAll(/<em>(.+?)<\/em>/g, (e) => {
    return e.replace("<em>", "*").replace("</em>", "**");
  });

  message = message.replaceAll(/<code>(.+?)<\/code>/g, (e) => {
    return e.replace("<code>", "`").replace("</code>", "`");
  });

  message = message.replaceAll(/<pre(.+?)<\/pre>/gms, (e) => {
    return e.replace(/<pre(.+?)>/, "```").replace("</pre>", "").trim() + "```";
  });

  message = message.replace(/<(.|\n)*?>/g, ''); //Remove HTML tags

  message = message.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/, (r) => he.encode(r)); //Encode emojis

  return message;

}

var MessageMarkdownToHTML = (markdown) => {

  var he = require('he');

  function HTMLentities(r) {
    return r.replace(/[\x26\x0A\<>'"]/g, function(r) {
      return "&#" + r.charCodeAt(0) + ";"
    })
  }

  let message = markdown;

  message = message.replace(/&([A-z0-9#;-]+);/g, function(r) {
    if (['&#42;', '&#95;', '&#96;'].includes(r)) {
      return r;
    } else {
      return he.decode(r);
    }
  });

  message = HTMLentities(message);

  message = message.replaceAll(/\*\*(.+?)\*\*/g, (r) => "<strong>" + r.slice(2, -2) + "</strong>");
  message = message.replaceAll(/__(.+?)__/g, (r) => "<strong>" + r.slice(2, -2) + "</strong>");
  message = message.replaceAll(/\*(.+?)\*/g, (r) => "<i>" + r.slice(1, -1) + "</i>");
  message = message.replaceAll(/_(.+?)_/g, (r) => "<i>" + r.slice(1, -1) + "</i>");
  message = message.replaceAll(/```(.+?)```/g, (r) => "<div class='code-block'>" + r.slice(3, -3).replaceAll(" ", "&nbsp;") + "</div>");
  message = message.replaceAll(/`(.+?)`/g, (r) => "<span class='inline-code'>" + r.slice(1, -1) + "</span>");

  message = message.replaceAll("&#38;#42;","*");
  message = message.replaceAll("&#38;#95;","_");
  message = message.replaceAll("&#38;#96;","`");

  message = message.trim().replaceAll("\n", "<br>");
  message = message.replaceAll("&#10;", "<br>"); //New line
  message = message.replaceAll("\n", "<br>"); //New line
  message = message.replaceAll("\t", "&nbsp;&nbsp;&nbsp;"); //Tabs
  message = message.replace(/(<br>){2,}/g, "<br>"); //Remove multiple newlines
  message = message.replace(/(^<br>)|(<br>$)/g, ""); //Remove newlines at beginning and end

  return message;

}


export {
  MessageHTMLToMarkdown,
  MessageMarkdownToHTML,
  MessageMarkdownToEditable
};
