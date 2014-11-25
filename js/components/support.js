// Avoid console errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
//RAF
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
//JS union wrappers
(new function() {
    window.g3 = this;
    g3.html = document.getElementsByTagName("html")[0];
    g3.body = document.getElementsByTagName("body")[0];

    g3.browser_info = (function() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return ['IE', tem[1]||''];
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/);
            if(tem!=null)   {
                return ['Opera', tem[1]];
            }
        }
        M[1] = M[1]==='MSIE' ? 'IE' : M[1];
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return M;
    })();

    g3.addClass = function(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };

    g3.removeClass = function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    g3.hasClass = function(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    };

    g3.blockEvent = function(el, type) {
        el.addEventListener(type, function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    };
    g3.getWindowWidth = function() {
        return window.innerWidth || document.documentElement.clientWidth || g3.body.clientWidth;
    };
    g3.getWindowHeight = function() {
        return window.innerHeight|| document.documentElement.clientHeight|| g3.body.clientHeight;
    };
    g3.setStyle = function ( el, propertyObject ) {
        _.each(propertyObject, function(val, key) {
            el.style[key] = val;
        });
    };

    g3.POST_EXCUSES = ["мы", "она", "они", "оно", "я", "что", "все", "без", "безо", "близ", "в", "во", "вместо", "вне", "для", "до", "за", "из", "изо", "из-за", "из-под", "к", "ко", "кроме", "между", "меж", "на", "над", "надо", "о", "об", "обо", "от", "ото", "перед", "передо", "пред", "предо", "по", "под", "подо", "при", "про", "ради", "с", "со", "сквозь", "среди", "у", "через", "чрез", "так", "и", "да", "не", "но", "также", "тоже", "ни", "зато", "однако", "же", "или", "либо", "то", "ли", "а", "я", "он"];
    g3.PREV_EXCUSES = ["века", "в.", "год", "г.", "года"];

    g3.carryUnionsHTML = function(el, text) {
        if(el) {
            var words = (text || el.innerHTML).replace(/ +(?= )/g,'').replace(/></g, "> <").split(" ");
            text = '';

            _.each(words, function(word, i) {
                word = word.replace(/[,;:!?()"]/g, '').replace(/<.*?>/gi, '').toLowerCase();
                var space = "";

                if (_.indexOf(g3.POST_EXCUSES, word) != -1) {
                    text += words[i];
                    space = "\u00A0";
                } else if(_.indexOf(g3.PREV_EXCUSES, word) != -1) {
                    text = text.substr(0, text.length - 1) + "\u00A0" + words[i];
                    space = " ";
                } else {
                    text += words[i];
                    space = " ";
                }
                if(i < (words.length - 1)) {
                    text += space;
                }
            });
            el.innerHTML = text;
        }
    };

    g3.carryUnionsHTML2 = function(text) {
        var words = text.replace(/ +(?= )/g,'').replace(/></g, "> <").split(" ");
        text = '';

        _.each(words, function(word, i) {
            word = word.replace(/[,;:!?()"]/g, '').replace(/<.*?>/gi, '').toLowerCase();
            var space = "";

            if (_.indexOf(g3.POST_EXCUSES, word) != -1) {
                text += words[i];
                space = "\u00A0";
            } else if(_.indexOf(g3.PREV_EXCUSES, word) != -1) {
                text = text.substr(0, text.length - 1) + "\u00A0" + words[i];
                space = " ";
            } else {
                text += words[i];
                space = " ";
            }
            if(i < (words.length - 1)) {
                text += space;
            }
        });
        return text;
    };

    g3.initContent = function(settings) {
        g3.contentWidth = settings.contentWidth;
        g3.contentHeight = settings.contentHeight;
        g3.curZoom = 1;
        g3.curWidth = g3.contentWidth;
        g3.curHeight = g3.contentHeight;
        g3.debugMode = settings.debugMode ? true : false;
        g3.domain = settings.domain || "";

        g3.ig = document.getElementById("ig");
        g3.content = document.querySelectorAll("#ig > .content")[0];

        if(settings.contentWidth) {
            g3.content.style.width = g3.ig.style.width = g3.contentWidth + "px";
        }
        if(settings.contentHeight) {
            g3.content.style.height = g3.ig.style.height = g3.contentHeight + "px";
        }
    };
}());
//Add classes with browser info in html tag
(function() {
    var browserTitle = g3.browser_info[0].substr(0, 2).toLowerCase();
    var fullBrowserTitle = browserTitle + g3.browser_info[1].toString();
    g3.addClass(g3.html, browserTitle);
    g3.addClass(g3.html, fullBrowserTitle);
})();
//Mobile devices
(new function() {
    g3.MOBILE_EVENTS = ["tap", "touchstart", "touchend", "touchmove", "touchenter", "touchleave", "touchcancel"];
    g3.DESKTOP_EVENTS = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave"];

    g3.initMobile = function() {
        window.isMobile = ('ontouchstart' in window);

        if (isMobile) {
            g3.addClass(g3.html, "mobile-device");
            for (var i = 0, len = g3.DESKTOP_EVENTS.length; i < len; i++) {
                g3.blockEvent(document, g3.DESKTOP_EVENTS[i]);
            }
        } else {
            g3.addClass(g3.html, "desktop-device");
            for (i = 0, len = g3.MOBILE_EVENTS.length; i < len; i++) {
                g3.blockEvent(document, g3.MOBILE_EVENTS[i]);
            }
        }
    }
}());
//Full screen only for: lenta.ru
(function() {
    g3.initFullScreen = function(parentId) {
        g3.igFrame = window.parent.document.getElementById(parentId);
        var fsBtn = document.getElementById("full-screen");

        g3.ig.style.height = g3.ig.style.width = null;

        g3.addClass(g3.html, "full-screen");
        window.addEventListener("resize", resize);
        resize();

        var fsParentStyle = document.createElement('style');
        fsParentStyle.setAttribute('type', 'text/css');
        fsParentStyle.innerHTML = ".ig-frame {" +
            "width: " + g3.contentWidth + "px;" +
            "height: " + g3.contentHeight + "px;" +
            "}" +
            ".full-screen {" +
            "position: fixed;" +
            "width: 100%;" +
            "height: 100%;" +
            "z-index: 100;" +
            "left: 0px;" +
            "top: 0px;" +
            "}";
        window.parent.document.head.appendChild(fsParentStyle);

        if(g3.igFrame) {
            if(!g3.debugMode && g3.domain) {
                document.domain = g3.domain;
            }
            if(fsBtn) {
                fsBtn.addEventListener('click', function () {
                    if (g3.hasClass(g3.igFrame, "full-screen")) {
                        g3.removeClass(g3.igFrame, "full-screen");
                    } else {
                        g3.addClass(g3.igFrame, "full-screen");
                    }
                });
            }
        }

        function resize() {
            var widthRatio = window.innerWidth / g3.contentWidth;
            var heightRatio = window.innerHeight / g3.contentHeight;
            g3.curZoom = heightRatio < widthRatio ? heightRatio : widthRatio;
            g3.curWidth = Math.floor(g3.contentWidth * g3.curZoom);
            g3.curHeight = Math.floor(g3.contentHeight * g3.curZoom);

            var scale = 'scale(' + g3.curZoom + ')';
            g3.content.style.webkitTransform = scale;
            g3.content.style.mozTransform = scale;
            g3.content.style.msTransform = scale;
            g3.content.style.oTransform = scale;
            g3.content.style.transform = scale;
            g3.content.style.top = parseInt((window.innerHeight - g3.curHeight) / 2) + 'px';
            g3.content.style.left = parseInt((window.innerWidth - g3.curWidth) / 2) + 'px';
        }
    };
})();
//Social buttons and handlers
g3.initSocials = function(settings) {
    _.each(settings, function(val, key) {
        settings[key] = encodeURIComponent(val);
    });

    g3.vkUrl = 'http://vkontakte.ru/share.php' +
        '?title=' + settings.title +
        '&description=' + settings.desc +
        '&url=' + settings.url +
        '&image=' + settings.img +
        '&noparse=1';
    g3.fbUrl = 'http://www.facebook.com/sharer.php' +
        '?s=100&p[title]=' + settings.title +
        '&p[summary]=' + settings.desc +
        '&p[url]=' + settings.url +
        '&p[images][0]=' + settings.img +
        '&t=' + settings.title +
        '&e=' + settings.desc;
    g3.tUrl = 'https://twitter.com/intent/tweet' +
        '?status=' + (settings.sDesc || settings.desc);

    var vk = document.getElementById("vk"),
        fb = document.getElementById("fb"),
        t = document.getElementById("t");
    if(vk) {
        vk.addEventListener("click", function() {
            window.open(g3.vkUrl, 'sharer', 'toolbar=0,status=0,width=626,height=436');
        });
    }
    if(fb) {
        fb.addEventListener("click", function() {
            window.open(g3.fbUrl, 'sharer', 'toolbar=0,status=0,width=626,height=436');
        });
    }
    if(t) {
        t.addEventListener("click", function() {
            window.open(g3.tUrl, 'sharer', 'toolbar=0,status=0,width=626,height=436');
        });
    }
};
