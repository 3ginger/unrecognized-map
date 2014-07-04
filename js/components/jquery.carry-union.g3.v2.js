(function ($) {
    if($) {
        var pluginName = "carry-union-g3";
        var namespace = "." + pluginName;
        var version = "2";
        var developer = "German Gurov";

        var excuses = ["без", "безо", "близ", "в", "во", "вместо", "вне", "для", "до", "за", "из", "изо", "из-за", "из-под", "к", "ко", "кроме", "между", "меж", "на", "над", "надо", "о", "об", "обо", "от", "ото", "перед", "передо", "пред", "предо", "по", "под", "подо", "при", "про", "ради", "с", "со", "сквозь", "среди", "у", "через", "чрез", "так",
            "и", "да", "не", "но", "также", "тоже", "ни", "зато", "однако", "же", "или", "либо", "то", "ли", "а", "я", "он"];
        var prevExcuses = ["века", "в.", "год", "г.", "года"];

        $.fn[pluginName] = function (text) {
            return this.each(function () {
                var $this = $(this);
                var words = text.replace(/ +(?= )/g,'').replace(/></g, "> <").split(" ");
                text = "";
                for (var i = 0; i < words.length; i++) {
                    var word = words[i].replace(/[,;:!?()"]/g, '').replace(/<.*?>/gi, '').toLowerCase();
                    var space = "";
                    if (excuses.filter(function(val) { return val == word; }).length > 0) {
                        text += words[i];
                        space = "\u00A0";
                    } else if(prevExcuses.filter(function(val) { return val == word; }).length > 0) {
                        text = text.substr(0, text.length - 1) + "\u00A0" + words[i];
                        space = " ";
                    } else {
                        text += words[i];
                        space = " ";
                    }
                    if(i < (words.length - 1)) {
                        text += space;
                    }
                }

                $this.html(text);
            });
        }
    }
})(window.jQuery);