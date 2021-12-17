function showTooltip(el, t) {

  let tooltipID = Math.round(Math.random() * 100000);
  document.querySelector('.tooltip').setAttribute('data-tooltip-id', tooltipID);
  el.setAttribute('data-tooltip-ref-id', tooltipID);

  let bounding = el.getBoundingClientRect();
  document.querySelector('.tooltip .inner').innerText = t;
  document.querySelector('.tooltip').style.display = 'inline-block';
  document.querySelector('.tooltip').style.left = bounding['left'] + (bounding['width'] / 2) + 'px';
  document.querySelector('.tooltip').style.top = (bounding['bottom'] + 4) + 'px';
}

function hideTooltip(el) {
  let tooltip = document.querySelector('[data-tooltip-id="' + el.getAttribute('data-tooltip-ref-id') + '"]');
  if (tooltip !== null) {
    tooltip.removeAttribute('data-tooltip-id');
    tooltip.style.display = 'none';
    el.removeAttribute('data-tooltip-ref-id');
  }
}

setInterval(() => {
  document.querySelectorAll('ion-icon').forEach((i) => {
    if (i.shadowRoot.querySelector('title') !== null) {
      i.shadowRoot.querySelector('title').remove();
    }
  });

  document.querySelectorAll('[data-tooltip]').forEach((el) => {
    el.onmouseover = () => {
      showTooltip(el, el.getAttribute('data-tooltip'));
    };
    el.onmouseout = () => {
      hideTooltip(el);
    };
  });
  
}, 1000);
