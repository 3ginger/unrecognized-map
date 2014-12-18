(function() {
    //example
    g3.initContent({contentWidth:1280, contentHeight:720, domain:"lenta.ru", debugMode:true});

    var staticMapPath = 'img/maps/';
    var mapPointColors = {un:'#A1A4A7', unna:'#FFC519', na:'#F3740D'};
    var allData = null, tagData = null, borderList = null;
    var bordersLayer = d3.select('#borders'), mapPoints = d3.selectAll('#rects rect'),
        linksLayer = d3.select('#links');
    var mapPointSize = 5, mapPointOffset = mapPointSize/2;
    var filters = null, filterPoints = null;
    var filtersInfo = [
        {title:"Кто признаёт", prop:"approveList"},
        {title:"Кто не признаёт", prop:"negativeList"},
        {title:"Кого признаёт", prop:"approvedList"},
        {title:"Кого не признаёт", prop:"negativedList"}
    ], filterPointOffset = 2, numPointsInLine = 20,
        filterWidth = (mapPointSize + filterPointOffset)*numPointsInLine - filterPointOffset, filterHeight = 30,
        filterOffset = 30, filterPosition = [1280 - filtersInfo.length * (filterWidth + filterOffset) + 40 - filterOffset - filterHeight - filterOffset, 20];

    var curPoint = null, curFilter = null;
    var problemPopup = d3.select('.problem-popup'), infoPopup = d3.select('.popup'), naInfoBtn = d3.select('.na-info.btn');
    var infoPopupOffset = 10;

    var reboundRadius = 30;
    var nearestCountries, rafID, numFrames, maxFrames = 30;


    var aboutMethodsPopup = d3.select('.about-methods');


    d3.select('.about-methods-btn').on('click', function() {
        aboutMethodsPopup.classed('disabled', !aboutMethodsPopup.classed('disabled'));
    });

    aboutMethodsPopup.on('click', function() {
        aboutMethodsPopup.classed('disabled', true);
    });

    problemPopup.on('click', function() {
        problemPopup.classed('disabled', true);
    });
    d3.tsv('data.csv', function(data) {
        allData = data;

        d3.tsv('problems.csv', function(problemData) {
            //format data
            _.each(allData, function(d) {
                d.mapPoint = d3.select('#' + d.id);
                d.mapPoint.datum(d).style('fill', mapPointColors[d.tag.toLowerCase()]);
                d.position = [+d.mapPoint.attr('x'), +d.mapPoint.attr('y')];
                d.tag = d.tag.toLowerCase();
                if(d.borderList) {
                    d.borderList = updateLinks(d.borderList.replace(/\s{1,}/g, '').split(','), allData);
                } else {
                    d.borderList = [];
                }

                if(d.approveList) {
                    d.approveList = updateLinks(d.approveList.replace(/\s{1,}/g, '').split(','), allData);
                } else {
                    d.approveList = [];
                }

                if(d.negativeList) {
                    d.negativeList = updateLinks(d.negativeList.replace(/\s{1,}/g, '').split(','), allData);
                } else {
                    d.negativeList = [];
                }

                d.approvedList = [];
                d.negativedList = [];
            });
            balanceLinks(allData);
            invertLinks(allData);


            _.each(problemData, function(problem) {
                problem.desc = problem.desc.split('///');
                problem.square = +problem.square;
                problem.metropolisSquare = +problem.metropolisSquare;
                problem.population = +problem.population;
                problem.metropolisPopulation = +problem.metropolisPopulation;
                if(problem.metropolisSquare) {
                    problem.squarePercent = problem.square / problem.metropolisSquare;
                } else {
                    problem.squarePercent = null;
                }
                if(problem.metropolisPopulation) {
                    problem.populationPercent = problem.population / problem.metropolisPopulation;
                } else {
                    problem.populationPercent = null;
                }
                var node = _.findWhere(allData, {id:problem.id});
                if(node) {
                    node.problem = problem;
                } else {
                    console.log('problem id = ', problem.id);
                }
            });
            borderList = formatBorderList(allData);
            tagData = d3.nest()
                .key(function(d){ return d.tag;})
                .entries(allData);


            mapPoints.on('click', function(data) {
                console.log(data);
                _.each(nearestCountries, function(country) {
                    country.mapPoint.interrupt().transition().duration(200 + Math.random()*100).attr('x', country.position[0]).attr('y', country.position[1]);
                });
                function getSquare(x) {
                    return x*x;
                }
                nearestCountries = _.filter(allData, function(country) {
                    if(country != data) {
                        var distance = Math.sqrt(getSquare(data.position[0] - country.position[0]) + getSquare(data.position[1] - country.position[1]));
                        if(distance < reboundRadius) {
                            country.reboundK = reboundRadius/distance;
                            country.curDistance = distance;
                            return true;
                        }
                    }
                    return false;
                });
                _.each(nearestCountries, function(country) {
                    var deltaX = country.position[0] - data.position[0];
                    var deltaY = country.position[1] - data.position[1];

                    var reboundPosition = [data.position[0] + deltaX*country.reboundK, data.position[1] + deltaY*country.reboundK];
                    country.mapPoint.interrupt().transition().duration(200 + Math.random()*100).attr('x', reboundPosition[0]).attr('y', reboundPosition[1]);
                });

                curPoint = d3.select(this);

                if(rafID) window.cancelAnimationFrame(rafID);
                function rafAnimate() {
                    numFrames++;
                    drawBorderLines();
                    drawApproveLines.call(curPoint, curFilter.prop);
                    if(numFrames < maxFrames) {
                        setTimeout(function() {
                            rafAnimate();
                        }, 1000/60)
                    }

                }
                rafID = window.requestAnimationFrame(function() {
                    numFrames = 0;
                    rafAnimate();
                });

                drawFilters.call(this);

                viewProblemPopup(data);
            }).on('mouseover', function(data) {
                var mousePos = d3.mouse(this);
                infoPopup.text(data.title)
                    .style('left', mousePos[0] + infoPopupOffset + 'px')
                    .style('top', mousePos[1] + infoPopupOffset + 'px')
                    .classed('disabled', false);
            }).on('mouseout', function() {
               infoPopup.classed('disabled', true);
            });
            drawBorderLines();
            //hideBorderLines();
        });
        _.filter(allData, function(dd) {
            if(dd.tag == 'na' && !dd.problem ) {
                console.log('na country dont\'t have problem set', dd.title);
            }
        });
    });

    addFilters();
    setFilter.call(filtersInfo[0].header);
    function setFilter() {
        d3.selectAll('.filter .header').classed('selected', false);
        curFilter = d3.select(this).classed('selected', true).datum();
    }


    function viewProblemPopup(curPointData) {
        problemPopup.classed('disabled', true);
        if(curPointData.tag == "na" || curPointData.tag == "unna") {
            naInfoBtn
                .classed('disabled', false)
                .style('left', curPointData.position[0] + mapPointOffset + 'px')
                .style('top', curPointData.position[1] + mapPointOffset + 'px')
                .on('click', function() {
                    problemPopup.classed('disabled', false)
                        .selectAll('.list .line')
                        .classed('disabled', true);
                    var problem = curPointData.problem;
                    problemPopup.select('.title').text(problem.title);

                    if(problem.metropolis) {
                        var metropolisInfo = _.findWhere(allData, {id:problem.metropolis});
                        problemPopup.select('.metropolis')
                            .classed('disabled', false)
                            .select('.val')
                            .text(metropolisInfo.title);
                    }

                    if(problem.when) {
                        problemPopup.select('.year')
                            .classed('disabled', false)
                            .select('.val')
                            .text(problem.when + ' год');
                    }

                    if(problem.square) {
                        problemPopup.select('.square')
                            .classed('disabled', false)
                            .select('.val')
                            .text(problem.square + " км");
                    }

                    if(problem.population) {
                        problemPopup.select('.populas')
                            .classed('disabled', false)
                            .select('.val')
                            .text(problem.population + " тыс. чел.");
                    }

                    function getPercent(percent) {
                        return percent < 1 ? '<1' : percent;
                    }

                    if(problem.populationPercent != null) {
                        problemPopup.select('.percents .people').classed('disabled', false);
                        problemPopup.select('.percents .people .inside-rect')
                            .style('width', 0)
                            .style('height', 0)
                            .interrupt()
                            .transition()
                            .style('width', 50 * problem.populationPercent + 'px')
                            .style('height', 50 * problem.populationPercent + 'px');

                        problemPopup.select('.percents .people .val')
                            .text(0)
                            .interrupt()
                            .transition()
                            .text(getPercent(parseInt(Math.floor(problem.populationPercent * 100))));
                    } else {
                        problemPopup.select('.percents .people').classed('disabled', true);
                    }

                    if(problem.populationPercent != null) {
                        problemPopup.select('.percents .square').classed('disabled', false);
                        problemPopup.select('.percents .square .inside-rect')
                            .style('width', 0)
                            .style('height', 0)
                            .interrupt()
                            .transition()
                            .style('width', 50 * problem.squarePercent + 'px')
                            .style('height', 50 * problem.squarePercent + 'px');


                        problemPopup.select('.percents .square .val')
                            .text(getPercent(parseInt(Math.floor(problem.squarePercent * 100))));
                    } else {
                        problemPopup.select('.percents .square').classed('disabled', true);
                    }

                    if(problem.desc) {
                        function clickOnPage(i) {
                            problemPopup.selectAll('.pager .page')
                                .classed('selected', false);
                            var d3this = d3.select(this).classed('selected', true);

                            d3.select(problemPopup.selectAll('.about .desc')
                                .classed('disabled', true)[0][i])
                                .classed('disabled', false);

                            d3.event.stopPropagation();
                        }
                        problemPopup.select('.about').html('')
                            .classed('disabled', false)
                            .selectAll('.desc')
                            .data(problem.desc).enter()
                            .append('div')
                            .attr('class', 'desc')
                            .text(function(d) { return g3.carryUnionsHTML2(d);})
                            .classed('disabled', false);


                        if(problem.desc.length > 1) {
                            problemPopup.select('.pager').html('')
                                .classed('disabled', false)
                                .style('width', (problem.desc.length*12*2 - 12) + 'px')
                                .selectAll('.page')
                                .data(problem.desc).enter()
                                .append('div')
                                .attr('class', 'page btn')
                                .classed('selected', false).on('click', function(d, i) {
                                    clickOnPage.call(this, i);
                                });
                            clickOnPage.call(problemPopup.selectAll('.pager .page')[0][0], 0);
                        } else {
                            problemPopup.select('.pager').classed('disabled', true);
                        }
                    } else {
                        problemPopup.select('.about')
                            .classed('disabled', true);
                    }

                    var map = problemPopup.select('.map');
                    if(problem.pic) {
                        map.attr('src', staticMapPath + problem.pic);
                    } else {
                        map.attr('src', '');
                    }
                });
        } else {
            naInfoBtn.on('click', null).classed('disabled', true);
        }
    }
    function addFilters() {
        filters = d3.select('#filters').selectAll('.filter')
            .data(filtersInfo).enter()
            .append('g')
            .attr('class', 'filter')
            .attr('transform', function(d, i) {return 'translate(' + (filterPosition[0] + (filterWidth + filterOffset) * i) + ',' + filterPosition[1] + ')' ;});

        var headers = filters.append('g')
            .attr('class', 'header')
            .each(function(d) {
                d.header = this;
            })
            .on('click', function(d) {
                setFilter.call(this);
                if(curPoint) {
                    drawApproveLines.call(curPoint, curFilter.prop);
                }
            });
        headers.append('rect')
            .attr('width', filterWidth)
            .attr('height', filterHeight);

        headers.append('text')
            .attr('x', 10)
            .attr('y', 19)
            .text(function(d) {return d.title;});

        /*var circleOffset = 10;
        headers.append('circle')
            .attr('class', 'border-point')
            .attr('cx', circleOffset)
            .attr('cy', circleOffset)
            .attr('r', 6);

        headers.append('circle')
            .attr('class', 'inner-circle')
            .attr('cx', circleOffset)
            .attr('cy', circleOffset)
            .attr('r', 3);*/

        filterPoints = filters.append('g')
            .attr('class', 'points')
            .attr('transform', 'translate(0,' + (filterHeight + filterPointOffset) + ')');
    }

    function drawFilters() {
        var data = d3.select(this).datum();
        filterPoints.each(function(d, i) {
            var taggedList = d3.nest().key(function(d){ return d.tag;}).entries(data[d.prop]);
            var list = [];
            for (var j = 0; j < taggedList.length; j++) {
                list = list.concat(taggedList[j].values);
            }
            var pointRects = d3.select(this).selectAll('.filter-point')
                .data(list, function(d) {return d.id;});

            pointRects.enter()
                .append('rect')
                .attr('x', function(d) {return d.position[0] - filterPosition[0] - i*(filterWidth + filterOffset)})
                .attr('y', function(d) {return d.position[1] - filterPosition[1] - (20 + filterPointOffset)})
                .attr('class', 'filter-point')
                .attr('width', mapPointSize)
                .attr('height', mapPointSize)
                .attr('fill', function(d) {return mapPointColors[d.tag]})
                .on('click', function(d) {
                    console.log(111);
                    curPoint = d.mapPoint;
                    drawFilters.call(this);
                    drawApproveLines.call(curPoint, curFilter.prop);
                    viewProblemPopup(d);
                }).on('mouseover', function(data) {
                    var mousePos = d3.mouse(d3.select('.content')[0][0]);
                    infoPopup.text(data.title)
                        .style('left', mousePos[0] + infoPopupOffset + 'px')
                        .style('top', mousePos[1] + infoPopupOffset + 'px')
                        .classed('disabled', false);
                }).on('mouseout', function() {
                    infoPopup.classed('disabled', true);
                });

            pointRects.transition()
                .duration(function() {return 300 + Math.random() * 200})
                .attr('x', function(d, i) {return i%numPointsInLine * (mapPointSize  +  filterPointOffset) + 'px'})
                .attr('y', function(d, i) {return parseInt(i/numPointsInLine) * (mapPointSize  +  filterPointOffset) + 'px'})
                .style('opacity', 1);

            pointRects.exit().transition()
                .duration(function() {return 300 + Math.random() * 200})
                .attr('x', function() {return -500 + Math.random()*2000;})
                .attr('y', function() {return -500 + Math.random()*1000;})
                .style('opacity', 0)
                .remove();
        });
    }

    function invertLinks(data) {
        _.each(data, function(d) {
            _.each(d.approveList, function(d2) {
                d2.approvedList.push(d);
            });
            _.each(d.negativeList, function(d2) {
                d2.negativedList.push(d);
            });
        });
    }

    function balanceLinks(data) {
        _.each(data, function(d) {
            if(d.approveList.length > 0) {
                d.negativeList = formatInversList(data, d.approveList, d.id);
            } else if(d.negativeList.length > 0) {
                d.approveList = formatInversList(data, d.negativeList, d.id);
            } else if(d.tag.indexOf('na') != -1) {
                var result = [];
                _.each(data, function(d2) {
                    if(d2.tag.indexOf('un') != -1 && d.id != d2.id) {
                        result.push(d2);
                    }
                });
                d.negativeList = result;
            }
        });
    }

    function formatInversList(data, removeList, pointID) {
        var result = [];
        for (var i = 0, len = data.length; i < data.length; i++) {
            var dataElement = data[i];
            var addInResult = true;
            if(dataElement.tag.indexOf('un') != -1 && dataElement.id != pointID) {
                for (var j = 0, len2 = removeList.length; j < len2; j++) {
                    if (dataElement.id == removeList[j].id) {
                        addInResult = false;
                        break;
                    }
                }
                if (addInResult) {
                    result.push(dataElement);
                }
            }
        }
        return result;
    }

    function updateLinks(arr, data) {
        _.each(arr, function(d, i) {
            var el = _.findWhere(data, {id:d});
            if(el) {
                arr[i] = el;
            } else {
                console.log(arr, d);
            }
        });
        return arr;
    }

    function formatBorderList(data) {
        var result = [];
        _.each(data, function(d) {
            _.each(d.borderList, function(d2) {
                var newLink = true;
                for (var i = 0; i < result.length; i++) {
                    var resultElement = result[i];
                    if(result[i][0] == d2.id && result[i][1] == d.id || result[i][0] == d.id && result[i][1] == d2.id) {
                        newLink = false;
                        break;
                    }
                }
                if(newLink) {
                    result.push([d, d2]);
                }
            });
        });
        return result;
    }

    function drawApproveLines(prop) {
        var data = this.datum();
        linksLayer.html('').selectAll('line')
            .data(data[prop]).enter()
            .append('line')
            .attr('class', 'approve-line')
            .attr('x1', data.position[0] + mapPointOffset)
            .attr('x2', function(d) {return parseInt(d.mapPoint.attr('x')) + mapPointOffset;})
            .attr('y1', data.position[1] + mapPointOffset)
            .attr('y2', function(d) {return parseInt(d.mapPoint.attr('y')) + mapPointOffset;});
    }

    function drawBorderLines() {
        bordersLayer.html('').selectAll('line')
            .data(borderList).enter()
            .append('line')
            .attr('class', 'border-line')
            .attr('x1', function(d) {return parseInt(d[0].mapPoint.attr('x')) + mapPointOffset;})
            .attr('x2', function(d) {return parseInt(d[1].mapPoint.attr('x')) + mapPointOffset;})
            .attr('y1', function(d) {return parseInt(d[0].mapPoint.attr('y')) + mapPointOffset;})
            .attr('y2', function(d) {return parseInt(d[1].mapPoint.attr('y')) + mapPointOffset;});
    }

    function showBorderLines() {
        bordersLayer.style('display', 'block');
    }

    function hideBorderLines() {
        bordersLayer.style('display', 'none');
    }
    //start here
})();

