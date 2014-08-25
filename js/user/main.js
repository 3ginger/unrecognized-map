(function() {
    //example
    //g3.initContent({contentWidth:750, contentHeight:600, domain:"lenta.ru", debugMode:true});
    g3.initContent({domain:"lenta.ru", debugMode:true});
    //g3.initFullScreen("test-fs");
    g3.initMobile();

    //социальные кнопки
    g3.initSocials({
        title:"test title",
        desc:"test desc",
        sDesc:"short test desc",
        url:"lenta.ru",
        sUrl:"le.ru",
        img:""
    });

    //пример паралакса
    g3.initParallax({keyFrames:[{
            view: [".global.bgr.cover", ".fader.cover", ".title.slide"],
            time: "200%",
            objects: [
                {
                    id:".title.slide .main.header",
                    phases: [{callbacks:function(s, p, lp) {console.log(p, lp)}}, {id:"0%", opacity:1, y:0}, {id:"20%", classes:"invert permanent"}, {id:"40%", classes:"invert"}, {id:"60%", y:-200}]
                },
                {
                    id:".title.slide .sub.header",
                    phases: [{id:"0%", opacity:1, y:0}, {id:"90%", opacity:0, y:-150}]
                }
            ]
        },
        {
            view: [".global.bgr.cover", ".fader.cover"],
            time: "200%",
            objects: []
        }
    ]});


    //висячие предлоги
    var listForCarryUnion = [];
    addElements(listForCarryUnion, document.querySelectorAll(".title"));
    addElements(listForCarryUnion, document.querySelectorAll(".desc"));

    _.each(listForCarryUnion, function(el) {
        g3.carryUnionsHTML(el);
    });


    function addElements(listForCarryUnion, addedList) {
        _.each(addedList, function(el) {
            listForCarryUnion.push(el);
        });
    }


    //start here
})();

