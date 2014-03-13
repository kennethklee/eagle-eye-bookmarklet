(function() {
    var makeEl = function (type, attrs, parent) {
        var el = document.createElement(type);
        for (var k in attrs){
            if (!attrs.hasOwnProperty(k)) continue;
            el.setAttribute(k, attrs[k]);
        }
        parent && parent.appendChild(el);
        return el;
    };

    // Separate words that are too long
    var hyphenate = function(str) {
        with(str)
        return length <= 7 ? str : length <= 10 ? slice(0,length - 3)+'- '+slice(length-3) : slice(0,7)+'- '+hyphenate(slice(7))
    };

    // Returns 2d array of words, their focus point, and delay until the next word
    var parse = function(str) {
        return str.trim().split(/[\s\n]+/).reduce(function(words, str) {
            var focus = (str.length - 1) / 2 | 0,
                delay = 60000 / window.eagleEyeWpm;

            for (j = focus; j >= 0; j--) {
                if (/[aeiou]/.test(str[j])) {
                    focus = j;
                    break;
                }
            }

            // Add a delay for long words, semi-stops and full-stops.
            if (str.length > 6) delay += delay / 4;
            if (str.length > 9) delay += delay / 4;
            if (~str.indexOf(',')) delay += delay;
            if (~str.indexOf('-')) delay += delay;
            if (/[\.!\?;]$/.test(str)) delay += delay * 1.5;

            if (str.length >= 15 || str.length - focus > 7) {
                return words.concat(parse(hyphenate(str)));
            } else {
                return words.concat([{
                    word: str,
                    focus: focus,
                    delay: delay
                }]);
            }
        }, []);
    };

    var getText = function(cb) {
        // text source: selection
        var selection = window.getSelection();
        if (selection.type === 'Range') {
            var container = document.createElement("div");
            for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                container.appendChild(selection.getRangeAt(i).cloneContents());
            }
            return cb(container.textContent);
        }

        // text source: readability
        var handler;
        var readabilityReady = function() {
            handler && document.removeEventListener('readility.ready', handler);
            handler = null;
            return cb(readability.grabArticleText());
        };

        if (window.readability) return readabilityReady();

        //makeEl('script', {src: '/readability.js'}, document.head);
        makeEl('script', {src: 'http://www.squirt.io/bm/readability.js'}, document.head);
        handler = document.addEventListener('readability.ready', readabilityReady);
    };

    var render = function render() {
        var div = makeEl('div', {id: 'eagle-reader'}, document.body);
        div.style.position = 'absolute';
        div.style.width = '100%';
        div.style.height = '200px';
        div.style.top = div.style.bottom = div.style.right = div.style.left = 0;
        div.style.margin = 'auto';
        div.style.backgroundColor = 'rgba(0,0,0,0.7)';  // Does this work in all browsers?
        div.style.color = 'white';
        div.style.fontSize = '40px';
        div.style.textAlign = 'center';
        div.style.lineHeight = '200px';
        div.style.fontFamily = 'Consolas';
    };

    var clear = function() {
        var div = document.querySelector('#eagle-reader');
        div.parentNode.removeChild(div);
    };
  
    var play = function() {
        var word = window.eagleEyeQueue.splice(0, 1)[0],
            div = document.querySelector('#eagle-reader');
        
        if (word) {
            var pre = word.word.substr(0, word.focus) || '';
            var letter = word.word.substr(word.focus, 1);
            var post = word.word.substr(word.focus + 1, word.word.length) || '';

            if (pre.length > post.length) {
                post += Array(pre.length - post.legnth + 1).join('&nbsp;');
            } else if (post.length > pre.length) {
                pre = Array(post.length - pre.length + 1).join('&nbsp;') + pre;
            }
            
            div.innerHTML = pre + '<span style="color: red">' + letter + '</span>' + post;
            setTimeout(play, word.delay);
        } else {
            setTimeout(clear, 1000);
        }
    };

    getText(function(text) {
        render();
        window.eagleEyeWpm = 350;
        window.eagleEyeQueue = parse(text);
        setTimeout(play, 1000);
    });
})();