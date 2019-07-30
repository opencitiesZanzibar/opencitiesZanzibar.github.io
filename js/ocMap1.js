
var map = new L.map('map').setView([-6.168513, 39.202311], 16 );

map.setMaxBounds(map.getBounds());

var ZMImagelayer = L.tileLayer('https://tiles.openaerialmap.org/5ae38a540b093000130afe39/0/5ae38a540b093000130afe3a/{z}/{x}/{y}.png',{ errorTileUrl:"not working"}).addTo(map);
var osmlayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

//STYLES
var style_buildings = {
    "color":"#c2c2c2",
    "weight": 0,
    "opacity": 1,
    "fillColor": "#c2c2c2",
    "fillOpacity": 1
};
var style = {
    "color":"#4f4e4d",
    "weight": 0.5,
    "opacity": 1,
    "fillColor": "#4f4e4d",
    "fillOpacity": 0
};
var styleOpenSpaces = {
    "color":"#4f4e4d",
    "weight": 0.5,
    "opacity": 0,
    "fillColor": "#93ff7d",
    "fillOpacity": 0.5
};
var styleWaterpoints = {
    radius: 3.5,
    fillColor: "#2f86ff",
    color: "#2f86ff",
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
};
var busMarker = L.AwesomeMarkers.icon({
    icon: 'bus',
    prefix: 'fa', 
    iconColor: 'black'
});
var wasteMarker = L.AwesomeMarkers.icon({
    icon: 'trash-alt',
    prefix: 'fa', 
    iconColor: 'black'
});
var poiMarker = L.AwesomeMarkers.icon({
    icon: 'map-pin',
    prefix: 'fa', 
    iconColor: 'black'
});


//building type style
function buildingColor(test) {
    return  test === 'Permanent' ? '#bd7811' :
            test === 'Semi-permanent'  ? '#d321ff' :
                '#2176ff';
}

function typeStyle(feature,map) {
    return { 
        opacity:0.5,
        weight:0.5,
        fillColor: buildingColor(feature.properties.building_t),
        fillOpacity:0.4
    };
}

//flooding type style
function floodingColor(b) {
    return b == 'no' ? '#ff0000' :
           b == 'yes' ? '#00cc00' :
                      '#FFEDA0';
}

function floodingStyle(feature,map) {
    return { 
        opacity:0.5,
        weight:0.5,
        fillColor: floodingColor(feature.properties.flooding),
        fillOpacity:0.4
    };
}

//waste type style
function wasteColor(b) {
    return b == 'designated_point' ? '#1452ed' :
           b == 'informal_dumpsite' ? '#f0e115' :
                      '#ed1435';
}

function wasteStyle(feature,map) {
    return { 
        opacity:0.5,
        weight:0.5,
        fillColor: wasteColor(feature.properties.waste),
        fillOpacity:0.4
    };
}

//amenities type style
function amenitiesColor(b) {
    return b == 'market' ? '#342af0' :
           b == 'open_spaces' ? '#f22be8' :
           b == 'open_spaces playgrounds' ? '#e6f02a' :
           b == 'playgrounds' ? '#f0942a' :
                      '#bdbdbd';
}

function amenitiesStyle(feature,map) {
    return { 
        opacity:0.5,
        weight:0.5,
        fillColor: amenitiesColor(feature.properties.amenities),
        fillOpacity:0.4
    };
}

//LEGENDS
var legend_phy = L.control({position: 'bottomleft'});

legend_phy.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Permanent", "Semi-permanent","Other"],
        labels = [];
    div.innerHTML += '<b>Building Type</b><br>' 
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
            '<i style="background:' + buildingColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ?  '<br>' : '+');
    }
    return div;
};

var legend_flood = L.control({position: 'bottomleft'});

legend_flood.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["no", "yes"],
        labels = [];
    div.innerHTML += '<b>Affected by flooding</b><br>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + floodingColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ?  '<br>' : '+');
    }
    return div;
};

var legend_waste = L.control({position: 'bottomleft'});

legend_waste.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["designated_point", "informal_dumpsite","Others"],
        labels = [];
    div.innerHTML += '<b>Waste disposal points</b><br>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + wasteColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ?  '<br>' : '+');
    }
    return div;
};

var legend_amenities = L.control({position: 'bottomleft'});

legend_amenities.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["market", "open_spaces","open_spaces playgrounds","playgrounds","Others"],
        labels = [];
    div.innerHTML += '<b>Access to amenities</b><br>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + amenitiesColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i] ?  '<br>' : '+');
    }
    return div;
};

//MAP INTERACTIONS
function zoomToOpenSpace(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachOpenSpace(feature, layer) {
    layer.bindPopup('Name:'+ feature.properties.Name);
    layer.on({
        click: zoomToOpenSpace   
    });
}

function zoomToWaterpoint(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachWaterpoint(feature, layer) {
    layer.bindPopup('Waterpoint feature:'+feature.properties.WATERPOINT +'<br>'+
    'Operational:'+ feature.properties.FUNCTIONAL
     );
    layer.on({
        click: zoomToWaterpoint   
    });
}

function onEachPoi(feature, layer) {
    layer.bindPopup('Name:'+ feature.properties.name);
}


//sidebar
var sidebar = L.control.sidebar({container: 'sidebar',position: 'right'}).addTo(map);

//Data
var busStop = L.geoJson(bus_stop,{
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: busMarker});
    }
});
var water = L.geoJson(waterpoints, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, styleWaterpoints);
    },
    onEachFeature:onEachWaterpoint
});
var dumps = L.geoJson(dumpsite,{
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: wasteMarker});
    }
});
var interestPoints = L.geoJson(POI,{
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: poiMarker});
    },
    onEachFeature:onEachPoi
});
var OpenSpaces = L.geoJson(openSpaces,{style:styleOpenSpaces,onEachFeature:onEachOpenSpace});

var shehias = L.geoJson(shehias,{style:style}).addTo(map);

filtered=L.featureGroup();
filter=L.geoJson(allBuildings,{style:style_buildings});
filtered = L.featureGroup().addLayer(filter);
filtered.addTo(map);


var buildingsfilt;

//SELECT A SHEHIA
$('.dropdown-menu a').on('click', function(event){    
    $('.dropdown-toggle').html($(this).html());
    filtered.clearLayers();
    var zone= event.target.id ;
    console.log(zone);
    if (zone === "allShehias") {
        console.log('Add allBuildings');
        buildingsfilt=allBuildings.features;
        filter=L.geoJson(allBuildings,{style:style_buildings});
        console.log(allBuildings.features.length);
        filtered = L.featureGroup().addLayer(filter);
        filtered.addTo(map);
    } 
    else{
        console.log('success');
        buildingsfilt=_.filter(allBuildings.features, function(viw){ 
            if (viw.properties.shehia === zone) return true    });
        console.log(buildingsfilt.length);
        filter=L.geoJson(buildingsfilt,{style:style_buildings});
        filtered = L.featureGroup().addLayer(filter);
        filtered.addTo(map);
    };

})

//UNDERSCORE
var residential;
var business;
var religious;
var educational;
var salon;
var office;
var workshop;
var shop;
var cafe;

//BUILDINGS
function tests(buildingsfilt){
//buidling use
    residential = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Residentia);
    });
    business = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Business);
    });
    religious = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Religious);
    });
    educational = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Educationa);
    });
//business type
    shop = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Shop);
    });
    salon = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Salon);
    });
    cafe = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Cafe);
    });
    workshop = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Workshop);
    });
    office = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.Office);
    });
//graphs
//1
    var svg_1 = dimple.newSvg("#chartContainer1", 350, 200);
    var data_1 = [
        { use: "Residential ", count: residential[1] },
        { use: "Business", count: business[1]},
        { use: "Religious", count: religious[1]},
        { use: "Educational", count:educational[1] }
    ];
    var myChart1 = new dimple.chart(svg_1, data_1);
    myChart1.setBounds(50, 40, 300, 100)
    var x = myChart1.addCategoryAxis("x", "use");
    myChart1.addMeasureAxis("y", "count");
    myChart1.addColorAxis("count",["red","blue","#008000"]);
    myChart1.addSeries(null, dimple.plot.bar);
    myChart1.draw();
//2
    var svg_2 = dimple.newSvg("#chartContainer2", 350, 200);
    var data_2 = [
        { type: "Shop ", count: shop[1] },
        { type: "Salon", count: salon[1]},
        { type: "Cafe", count: cafe[1]},
        { type: "Workshop", count: workshop[1]},
        { type: "Office", count:office[1] }
    ];
    var myChart2 = new dimple.chart(svg_2, data_2);
    myChart2.setBounds(50, 40, 300, 100)
    var x = myChart2.addCategoryAxis("x", "type");
    myChart2.addMeasureAxis("y", "count");
    myChart2.addColorAxis("count",["red","blue","#008000"]);
    myChart2.addSeries(null, dimple.plot.bar);
    myChart2.draw();
}

//FLOODING
function flood(buildingsfilt){
//cause
    lackDrainage = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.lack_of_dr);
    });
    terrain = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.terrain);
    });
    blocked = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.blocked_dr);
    });
//contact
    none = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.none_1);
    });
    Ladmin = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.local_admi);
    });
    neighbours = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.neighbours);
    });
    family = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.family_mem);
    });
//effect
    destruction = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.destructio);
    });
    displacement = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.displaceme);
    });
    livelihoods = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.livelihoods);
    });
    diseases = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.diseases);
    });
//graphs
//3
    var svg_3 = dimple.newSvg("#chartContainer3", 350, 200);
    var data_3 = [
        { cause: "Lack Drainage ", count: lackDrainage[1] },
        { cause: "Terrain", count: terrain[1]},
        { cause: "Blocked Drainage", count:blocked[1] }
    ];
    var myChart3 = new dimple.chart(svg_3, data_3);
    myChart3.setBounds(50, 40, 300, 100)
    var x = myChart3.addCategoryAxis("x", "cause");
    myChart3.addMeasureAxis("y", "count");
    myChart3.addColorAxis("count",["red","blue","#008000"]);
    myChart3.addSeries(null, dimple.plot.bar);
    myChart3.draw();
//4
    var svg_4 = dimple.newSvg("#chartContainer4", 350, 200);
    var data_4 = [
        { effect: "Destruction ", count: destruction[1] },
        { effect: "Displacement", count: displacement[1]},
        { effect: "Disruption of livelihoods", count: livelihoods[1]},
        { effect: "Causes diseases", count:diseases[1] }
    ];
    var myChart4 = new dimple.chart(svg_4, data_4);
    myChart4.setBounds(50, 40, 300, 100)
    var x = myChart4.addCategoryAxis("x", "effect");
    myChart4.addMeasureAxis("y", "count");
    myChart4.addColorAxis("count",["red","blue","#008000"]);
    myChart4.addSeries(null, dimple.plot.bar);
    myChart4.draw();
//5
    var svg_5 = dimple.newSvg("#chartContainer5", 350, 200);
    var data_5 = [
        { contact: "No-one ", count: none[1] },
        { contact: "Sheha", count: Ladmin[1]},
        { contact: "Neighbours", count: neighbours[1]},
        { contact: "Family", count:family[1] }
    ];
    var myChart5 = new dimple.chart(svg_5, data_5);
    myChart5.setBounds(50, 40, 300, 100)
    var x = myChart5.addCategoryAxis("x", "contact");
    myChart5.addMeasureAxis("y", "count");
    myChart5.addColorAxis("count",["red","blue","#008000"]);
    myChart5.addSeries(null, dimple.plot.bar);
    myChart5.draw();

}

//OTHERS
function other(buildingsfilt){
//waste
    informal = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.informal_d);
    });
    designated = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.designated);
    });
    burns= _.countBy(buildingsfilt, function(th){ 
        return (th.properties.burn);
    });
    openDrain = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.open_drain);
    });
//mobility
    car = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.car);
    });
    daladala = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.daladala);
    });
    motorbike = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.motorbike);
    });
    walking = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.walking);
    });
//graphs
//6
    var svg_6 = dimple.newSvg("#chartContainer6", 350, 200);
    var data_6 = [
        { waste: "Informal dumpsite ", count: informal[1] },
        { waste: "Designated", count: designated[1]},
        { waste: "Burn", count: burns[1]},
        { waste: "Open Drainage", count:openDrain[1] }
    ];
    var myChart6 = new dimple.chart(svg_6, data_6);
    myChart6.setBounds(50, 40, 300, 100)
    var x = myChart6.addCategoryAxis("x", "waste");
    myChart6.addMeasureAxis("y", "count");
    myChart6.addColorAxis("count",["red","blue","#008000"]);
    myChart6.addSeries(null, dimple.plot.bar);
    myChart6.draw();
//7
    var svg_7 = dimple.newSvg("#chartContainer7", 350, 200);
    var data_7 = [
        { mobility: "Personal Car ", count: car[1] },
        { mobility: "Daladala", count: daladala[1]},
        { mobility: "Motorbike", count: motorbike[1]},
        { mobility: "walking", count:walking[1] }
    ];
    var myChart7 = new dimple.chart(svg_7, data_7);
    myChart7.setBounds(50, 40, 300, 100)
    var x = myChart7.addCategoryAxis("x", "mobility");
    myChart7.addMeasureAxis("y", "count");
    myChart7.addColorAxis("count",["red","blue","#008000"]);
    myChart7.addSeries(null, dimple.plot.bar);
    myChart7.draw();

}

//IMPROVEMENTS AND AMENITIES
function improve(buildingsfilt){
//amenities
    open_space = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.open_space);
    });
    playground = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.playground);
    });
    market = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.market);
    });
//improvements
    hospital = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.hospital);
    });
    marketsImp = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.marketsImp);
    });
    school = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.school);
    });
    water = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.water);
    });
    electricity = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.electricit);
    });
    worship = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.worship);
    });
    rdAccess = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.road_acces);
    });
    pTransport = _.countBy(buildingsfilt, function(th){ 
        return (th.properties.public_tra);
    });
//graphs
//8
    var svg_8 = dimple.newSvg("#chartContainer8", 350, 200);
    var data_8 = [
        { amenities: "Open Space ", count: open_space[1] },
        { amenities: "Playground", count: marketsImp[1]},
        { amenities: "Market", count:market[1] }
    ];
    var myChart8 = new dimple.chart(svg_8, data_8);
    myChart8.setBounds(50, 40, 300, 100)
    var x = myChart8.addCategoryAxis("x", "amenities");
    myChart8.addMeasureAxis("y", "count");
    myChart8.addColorAxis("count",["red","blue","#008000"]);
    myChart8.addSeries(null, dimple.plot.bar);
    myChart8.draw();
//9
    var svg_9 = dimple.newSvg("#chartContainer9", 350, 200);
    var data_9 = [
        { improvements: "Hospital ", count: hospital[1] },
        { improvements: "New Market", count: marketsImp[1]},
        { improvements: "School", count: school[1]},
        { improvements: "Water", count: water[1]},
        { improvements: "Electricity", count: electricity[1]},
        { improvements: "Worship", count: worship[1]},
        { improvements: "Road Access", count: rdAccess[1]},
        { improvements: "Public Transport", count:pTransport[1] }
    ];
    var myChart9 = new dimple.chart(svg_9, data_9);
    myChart9.setBounds(50, 40, 300, 100)
    var x = myChart9.addCategoryAxis("x", "improvements");
    myChart9.addMeasureAxis("y", "count");
    myChart9.addColorAxis("count",["red","blue","#008000"]);
    myChart9.addSeries(null, dimple.plot.bar);
    myChart9.draw();

}



$('.form-check').on('click', function(event){ 
    var formid= event.target.id ;
    console.log(formid);
    if (formid==="qn1") {
        map.removeControl(legend_flood);
        map.removeControl(legend_waste);
        map.removeControl(legend_amenities);
        map.addControl(legend_phy);
        $('.collaps').html('<div class="card card-body">Classification by building use <div id="chartContainer1"></div><br>Classification by business type <div id="chartContainer2"></div></div>'); 
        tests(buildingsfilt);
        filtered.setStyle(typeStyle);

    } 
    else if ((formid==="qn2")){
        map.removeControl(legend_phy);
        map.removeControl(legend_waste);
        map.removeControl(legend_amenities);
        map.addControl(legend_flood);
        $('.collaps').html('<div class="card card-body">Causes of flooding <div id="chartContainer3"></div><br>Effects of flooding <div id="chartContainer4"></div><br>First person contacted during flooding <div id="chartContainer5"></div></div>');
        flood(buildingsfilt);
        filtered.setStyle(floodingStyle);
    }
    else if ((formid==="qn3")){
        map.removeControl(legend_phy);
        map.removeControl(legend_flood);
        map.removeControl(legend_amenities);
        map.addControl(legend_waste);
        $('.collaps').html('<div class="card card-body">Dumping of household waste <div id="chartContainer6"></div><br>Modes of transport <div id="chartContainer7"></div></div>');
        other(buildingsfilt);
        filtered.setStyle(wasteStyle);
    }
    else{
        map.removeControl(legend_phy);
        map.removeControl(legend_flood);
        map.removeControl(legend_waste);
        map.addControl(legend_amenities);
        $('.collaps').html('<div class="card card-body">Access to amenities <div id="chartContainer8"></div><br>Improvements wishlist <div id="chartContainer9"></div></div>');        
        improve(buildingsfilt); 
        filtered.setStyle(amenitiesStyle);
    };
    
})


//layer control
var overlays = {
            "Daladala Stop":busStop,
            "POI Landmarks":interestPoints,
            "Dumping sites":dumps,
            "Open Spaces":OpenSpaces,
            "Water Points":water
        };
var basemaps = {
            
            "ZMI Image":ZMImagelayer,
            "OpenStreetMap":osmlayer
        };
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.layers(overlays,basemaps,{position:'topright'}).addTo(map);
