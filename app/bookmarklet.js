(function(document, body) {
    var div = document.createElement('div');
    body.appendChild(div);

    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.height = '200px';
    div.style.top = div.style.bottom = div.style.right = div.style.left = 0;
    div.style.margin = 'auto';
    div.style.backgroundColor = 'rgba(0,0,0,0.5)';  // Does this work?

    function clear() {
        div.parentNode.removeChild(div);
    }
    setTimeout(clear, 5000);

})(document, document.body);