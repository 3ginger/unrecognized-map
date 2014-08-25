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
(new function () {
}());
//parallax
(new function () {
    g3.initParallax = function(settings) {
        var keyframes = settings.keyFrames || [];
        var frameRate = settings.frameRate || 60;
        var mobileFrameRate = settings.mobileFrameRate || frameRate;
        var animationSmooth = settings.animationSmooth || 10;
        var minScrollAnimate = settings.minScrollAnimate || 10;
        var maxScrollAnimate = settings.maxScrollAnimate || 100;
        var typeBrowser = g3.browser_info[0];
        var keyElements = settings.keyElements || ['.slide', '.cover'];

        var scrollStep = 1;

        //touch
        if(isMobile) {
            scrollStep = 2;
            document.addEventListener("touchstart", function (e) {
                if (e.touches.length == 1) {
                    var touch = e.touches[0];
                    lastTouchPoint = touch.pageY;
                    checkTouchMove = true;
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            document.addEventListener("touchend touchleave", function (e) {
                var touch = e.touches[0];
                lastTouchPoint = 0;
                checkTouchMove = false;
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            document.addEventListener("touchmove", function (e) {
                if(checkTouchMove) {
                    var touchY = e.touches[0].pageY;
                    var offset = (lastTouchPoint - touchY);
                    correctNextScrollTop(nextScrollTop1 + offset);
                    lastTouchPoint = touchY;
                }
            });
        } else {
            if(typeBrowser == "Firefox") {
                scrollStep = 33;
                g3.body.addEventListener('DOMMouseScroll', function(e) {
                    correctNextScrollTop(nextScrollTop1 + e.detail * scrollStep);
                });
            } else if(typeBrowser == "IE" || typeBrowser == "Safari") {
                g3.body.addEventListener('mousewheel', function(e) {
                    scrollStep = .84;
                    correctNextScrollTop(nextScrollTop1 - e.wheelDelta * scrollStep);
                    e.preventDefault();
                    return false;
                });
            } else {
                g3.body.addEventListener('mousewheel', function(e) {
                    correctNextScrollTop(nextScrollTop1 + e.deltaY * scrollStep);
                });
            }
        }



        function correctNextScrollTop(tmpScrollTop) {
            nextScrollTop1 = parseInt(tmpScrollTop > bodyHeight ? bodyHeight : tmpScrollTop < 0 ? 0 : tmpScrollTop);
            window.scrollTo(0, nextScrollTop1);
        }

        var inited = false, updateContent = false, forceUpdateContent = false;
        var views = [], allView = null;
        var keyframe = null, keyframeIndex = -1, keyframeTime = 0, lastKeyFrameIndex = -1;
        var windowHeight = 0, windowWidth = 0, bodyHeight = 1;

        var scrollTop = 0, relativeScrollTop = 0, scrollDirect = 0;
        //desktop
        var nextScrollTop = 0, nextScrollTop1 = 0;
        //mobile
        var checkTouchMove = false, lastTouchPoint = 0, nextTouchScrollTop = 0;


        var intProperties = ['x', 'y', 'rotate', 'left', 'right', 'top', 'bottom', 'height'], stringProperties = ['display'];

        g3.getKeyframeIndex = function() {
            return keyframeIndex;
        };

        g3.getKeyframeLabel = function() {
            return keyframe.label || keyframeIndex;
        };

        allView = [];
        _.each(keyElements, function(keyElementName) {
            _.each(document.querySelectorAll(keyElementName), function(el) {
                allView.push(el);
            });
        });

        //init
        g3.addClass(g3.html, "parallax");
        if(keyframes.length > 0) {
            window.addEventListener('resize', setupValues);
            setupValues();
            setInterval(updatePage, 1000/(isMobile ? mobileFrameRate : frameRate));
            changeKeyFrame(0);
            inited = true;
        }



        function setupValues() {
            forceUpdateContent = true;
            var lastProgress = scrollTop/bodyHeight, lastNextProgress = nextScrollTop/bodyHeight;
            bodyHeight = 1;
            keyframeIndex = -1;
            keyframeTime = 0;
            relativeScrollTop = 0;

            windowWidth = g3.getWindowWidth();
            windowHeight = g3.getWindowHeight();
            formatProperties();
            nextScrollTop = parseInt(lastNextProgress * bodyHeight);
            scrollTop = parseInt(lastProgress * bodyHeight);

            g3.body.style.height = bodyHeight + "px";
            window.scrollTo(0, scrollTop);
            calculateKeyFrame();
        }

        function updatePage() {
            window.requestAnimationFrame(function() {
                scrollContent();
                if(updateContent) {
                    animateElements(keyframe, relativeScrollTop);
                }
            });
        }

        function scrollContent() {
            var nextScrollTop = isMobile ? nextTouchScrollTop : (window.pageYOffset);
            if(forceUpdateContent || nextScrollTop != scrollTop) {
                updateContent = true;
                forceUpdateContent = false;
                if(nextScrollTop > scrollTop) {
                    scrollDirect = 1;
                    //scrollTop += .01;
                } else if(nextScrollTop < scrollTop) {
                    scrollDirect = -1;
                    //scrollTop -= .01;
                } else {
                    scrollDirect = 0;
                }

                var nextStopPoint = -1;
                if(keyframe.stopPointsY) {
                    for (var i = 0, len = keyframe.stopPointsY.length; i < len - 1; i++) {
                        var beginPoint = keyframe.stopPointsY[i] + keyframe.offsetTimeY, endPoint = keyframe.stopPointsY[i+1] + keyframe.offsetTimeY;
                        if(scrollTop > beginPoint && scrollTop < endPoint) {
                            if(scrollDirect == 1) {
                                nextStopPoint = endPoint;
                            } else if(scrollDirect == -1) {
                                nextStopPoint = beginPoint;
                            }
                            break;
                        }
                    }
                }


                if(nextStopPoint > -1) {
                    nextStopPoint = parseInt(nextStopPoint);
                    nextScrollTop = nextStopPoint;
                }

                var offsetFull = (nextScrollTop - scrollTop);
                var offset = parseInt(offsetFull/animationSmooth);
                offset = offset > maxScrollAnimate ? maxScrollAnimate : offset;
                if(offset > 0) {
                    offset = offset < minScrollAnimate ? minScrollAnimate : offset;
                } else if(offset < 0) {
                    offset = offset > -minScrollAnimate ? -minScrollAnimate : offset;
                }

                if(offset == 0) {
                    scrollTop = nextScrollTop;
                } else {
                    scrollTop = scrollTop + offset;
                }
                if(updateContent) {
                    window.scrollTo(0, nextScrollTop);
                    nextScrollTop1 = nextScrollTop;
                    calculateKeyFrame();
                    relativeScrollTop = scrollTop - keyframeTime;
                }
            } else {
                updateContent = false;
            }
        }

        function animateElements(keyframe, relativeScrollTop) {
            _.each(keyframe.objects, function(obj) {
                var newProperties = {};
                _.each(obj.phasesValues, function(values, property) {
                    var beginVal = null;
                    var endVal = null;
                    var beginId = null;
                    var endId = null;
                    _.each(values, function(d) {
                        if(endVal == null && relativeScrollTop >= d.id) {
                            beginVal = d.val;
                            beginId = d.id;
                        } else if(beginVal != null && endVal == null && relativeScrollTop < d.id) {
                            endVal = d.val;
                            endId = d.id;
                        }
                    });

                    if(property == "callbacks") {
                        _.each(obj.phasesValues[property], function(callback) {
                            callback.call(this, keyframe, scrollTop/bodyHeight, relativeScrollTop/keyframe.timeY, keyframeIndex, lastKeyFrameIndex, scrollDirect);
                        });
                    } else if(property == "classes") {
                        _.each(obj.phasesValues[property], function(seq, className) {
                            var action = null;
                            var stopSearch = false;
                            _.each(seq, function(d) {
                                if(!stopSearch) {
                                    if (relativeScrollTop >= d.id) {
                                        action = d.val;
                                    }
                                    if (relativeScrollTop < d.id) {
                                        stopSearch = true;
                                        if (action == 'add') {
                                            _.each(obj.$obj, function (el) {
                                                g3.addClass(el, className);
                                            });
                                        } else if (action == 'remove') {
                                            _.each(obj.$obj, function (el) {
                                                g3.removeClass(el, className);
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        var currentValue = null;
                        if(beginVal != null && endVal != null) {
                            var distanceValue = (endVal - beginVal);
                            currentValue = beginVal + (relativeScrollTop - beginId)/(endId - beginId)*distanceValue;
                        } else if(beginVal == null) {
                            currentValue = values[0].val;
                        } else if(endVal == null) {
                            currentValue = values[values.length - 1].val;
                        }
                        newProperties[property] = currentValue;
                    }
                });

                var translateProperty = "translate(-xpx,-ypx) scale(-scale) rotate(-rotatedeg)";
                var setProperties = {};
                _.each(newProperties, function(d, k) {
                    if(k == "x") {
                        translateProperty = translateProperty.replace("-x", parseInt(d));
                    } else if(k == "y") {
                        translateProperty = translateProperty.replace("-y", parseInt(d));
                    } else if(k == "scale") {
                        translateProperty = translateProperty.replace("-scale", d);
                    } else if(k == "rotate") {
                        translateProperty = translateProperty.replace("-rotate", d);
                    } else {
                        setProperties[k] = d;
                    }
                });

                translateProperty = translateProperty.replace("-x", '0');
                translateProperty = translateProperty.replace("-y", '0');
                translateProperty = translateProperty.replace("-scale", '1');
                translateProperty = translateProperty.replace("-rotate", '0');
                setProperties["-webkit-transform"] = translateProperty;
                setProperties["-moz-transform"] = translateProperty;
                setProperties["-ms-transform"] = translateProperty;
                setProperties["-o-transform"] = translateProperty;
                setProperties["transform"] = translateProperty;
                _.each(obj.$obj, function(el) {
                    g3.setStyle(el, setProperties);
                });
            });
        }

        function calculateKeyFrame() {
            for (var i = 0, len = keyframes.length; i < len; i++) {
                var tmpKeyframe = keyframes[i];
                if(scrollTop >= tmpKeyframe.offsetTimeY && scrollTop < tmpKeyframe.endOffsetTimeY) {
                    changeKeyFrame(tmpKeyframe.id);
                    break;
                }
            }
        }

        function formatProperties() {
            _.each(keyframes, function(d, i) {
                d.timeY = 0;
                d.offsetTimeY = 0;
                d.stopPointsY = d.stopPointsY || [];
                d.stopPointsY.length = 0;
                d.id = i;
                if(!inited) {
                    var tmpViews = [];
                    if(_.isArray(d.view)) {
                        _.each(d.view, function(d) {
                            if(d) {
                                _.each(document.querySelectorAll(d), function(el) {
                                    tmpViews.push(el);
                                });
                            }
                        });
                    } else {
                        if(d) {
                            _.each(document.querySelectorAll(d), function (el) {
                                tmpViews.push(el);
                            });
                        }
                    }
                    views.push(tmpViews);
                    _.each(d.objects, function(obj) {
                        var phasesKeys = [];
                        _.each(obj.phases, function(phase) {
                            phasesKeys = _.union(phasesKeys, _.filter(_.keys(phase), function(key) {
                                return key != "id"
                            }));
                        });
                        obj.keys = phasesKeys;
                    });
                }
                d.offsetTimeY = bodyHeight;
                bodyHeight += d.timeY = parseInt(convertPercentToPx(d.time, 'y'));
                d.endOffsetTimeY = d.offsetTimeY + d.timeY;
                _.each(d.stopPoints, function(per) {
                    d.stopPointsY.push(convertPercentToPx(per, 'y', d.timeY));
                });
                _.each(d.objects, function(obj) {
                    obj.$obj = document.querySelectorAll(obj.id);
                    obj.phasesValues = {classes:{}, callbacks:[]};
                    _.each(obj.phases, function(phase) {
                        _.each(obj.keys, function(key){
                            if(phase[key] != undefined) {
                                var property = null;
                                if(!obj.phasesValues[key]) {
                                    obj.phasesValues[key] = [];
                                }
                                property = obj.phasesValues[key];

                                if(key == "callbacks") {
                                    function checkCallBack(callback) {
                                        if(_.isFunction(callback) && _.indexOf(callback, property) == -1) {
                                            property.push(callback);
                                        }
                                    }
                                    if(_.isArray(phase[key])) {
                                        _.each(phase[key], function(callback) {
                                            checkCallBack(callback);
                                        });
                                    } else {
                                        checkCallBack(phase[key]);
                                    }
                                } else if(key == "classes") {
                                    _.each(phase[key].split(" "), function(className, i) {
                                        var classProperty = null;
                                        if(!property[className]) {
                                            property[className] = [];
                                            property[className].push({id:0, val:'remove'});
                                            property[className].push({id:parseInt(convertPercentToPx("100%", "y", d.timeY)), val:'remove'});
                                        }
                                        classProperty = property[className];

                                        var lastPhase = classProperty[classProperty.length - 2];
                                        var nextId = parseInt(convertPercentToPx(phase.id, "y", d.timeY));
                                        var nextVal = lastPhase.val == 'add' ? 'remove' : 'add';
                                        if(nextId == lastPhase.id) {
                                            lastPhase.val = nextVal;
                                        } else if(nextId > lastPhase.id) {
                                            var nextPhase = {id:nextId, val:nextVal};
                                            classProperty.splice(classProperty.length - 1, 0, nextPhase);
                                            lastPhase = nextPhase;
                                        }
                                    });
                                } else {
                                    var nextVal = convertPercentToPx(phase[key], key);
                                    if(_.indexOf(intProperties, key) == -1) {
                                        nextVal = parseInt(nextVal);
                                    }
                                    property.push({id:convertPercentToPx(phase.id, "y", d.timeY), val:nextVal});
                                }
                            }
                        });
                    });
                });
            });
        }

        function changeKeyFrame(frame, force) {
            if(frame != keyframeIndex) {
                force = force || false;
                /*if(keyframeIndex != -1) {
                 if(keyframeIndex < frame) {
                 animateElements(keyframe, 0);
                 } else {
                 animateElements(keyframe, keyframe.timeY);
                 }
                 }*/
                lastKeyFrameIndex = keyframeIndex;
                keyframeIndex = frame;
                keyframe = keyframes[keyframeIndex];
                keyframeTime = keyframe.offsetTimeY;

                _.each(allView, function(el) {
                    el.style.display = 'none';
                });
                _.each(views[keyframeIndex], function(el) {
                    el.style.display = 'block';
                });

                if(force) {
                    scrollContent();
                    animateElements();
                }
            }
        }

        function convertPercentToPx(value, axis, base) {
            if(typeof value === "string" && value.match(/%/g)) {
                value = parseFloat(value)/100;
                axis = axis || 'x';
                base = base || ((axis == "x") ? windowWidth : windowHeight);
                value *= base;
            }
            return parseFloat(value);
        }

        function easeInOutQuad(t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }

        g3.changeKeyFrame = function(index, force) {
            force = force || false;
            if(_.isString(index)) {
                var result = _.findWhere(keyframes, {label:index});
                move(result.offsetTimeY);
            } else {
                if(index >= 0 && index < keyframes.length) {
                    move(keyframes[index].offsetTimeY);
                }
            }
            function move(position) {
                forceUpdateContent = true;
                window.scrollTo(0, position);
                nextScrollTop1 = position;
                if(force) {
                    scrollTop = position;
                }
            }
        };
    };
}());