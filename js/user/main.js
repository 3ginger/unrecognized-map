(function() {
    //example
    //g3.initContent({contentWidth:750, contentHeight:600, domain:"lenta.ru", debugMode:true});
    g3.initContent({domain:"lenta.ru", debugMode:true});
    //g3.initFullScreen("test-fs");
    g3.initMobile();

    g3.initSocials({
        title:"test title",
        desc:"test desc",
        sDesc:"short test desc",
        url:"lenta.ru",
        sUrl:"le.ru",
        img:""
    });

    g3.initParallax({keyFrames:[{
            view: [".global.bgr.cover", ".fader.cover", ".title.slide"],
            time: "200%",
            objects: [
                {
                    id:".title.slide .main.header",
                    phases: [{id:"0%", opacity:1, y:0}, {id:"60%", opacity:0, y:-200}]
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

    g3.carryUnionsHTML(document.querySelectorAll(".main.header")[0]);

    //start here


})();