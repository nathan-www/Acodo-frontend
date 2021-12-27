function showTooltip(el, t, location) {

  let tooltipID = Math.round(Math.random() * 100000);
  document.querySelector('.tooltip').setAttribute('data-tooltip-id', tooltipID);
  el.setAttribute('data-tooltip-ref-id', tooltipID);

  let bounding = el.getBoundingClientRect();
  document.querySelector('.tooltip .inner').innerText = t;
  document.querySelector('.tooltip').style.display = 'inline-block';
  document.querySelector('.tooltip').style.left = bounding['left'] + (bounding['width'] / 2) + 'px';

  if(location == "top"){
    document.querySelector('.tooltip').classList.add('tooltip-top');
    document.querySelector('.tooltip').style.top = (bounding['bottom'] - 4 - bounding['height']) + 'px';
  }
  else{
    document.querySelector('.tooltip').classList.remove('tooltip-top');
    document.querySelector('.tooltip').style.top = (bounding['bottom'] + 4) + 'px';
  }

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
      if (el.getAttribute('data-tooltip-location') == "top") {
        showTooltip(el, el.getAttribute('data-tooltip'), 'top');
      } else {
        showTooltip(el, el.getAttribute('data-tooltip'), 'bottom');
      }

    };
    el.onmouseout = () => {
      hideTooltip(el);
    };
  });

}, 1000);
