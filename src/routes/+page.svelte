<script>
	import { onMount } from 'svelte';
	import mapboxgl from "mapbox-gl";
    import cmaSummary from './data/cma-summary.json';
    import Select from 'svelte-select';
	import '../assets/global-styles.css';

    import transitLines from './data/transit-lines-canada.geo.json';
    import transitStops from './data/transit-stops-canada.geo.json';

	mapboxgl.accessToken = 'pk.eyJ1Ijoic2Nob29sb2ZjaXRpZXMiLCJhIjoiY2w2Z2xhOXprMTYzczNlcHNjMnNvdGlmNCJ9.lOgVHrajc1L-LlU0as2i2A';

    // for toggling the visibility of the panel
    let isContentVisible = true;
    function toggleContent() {
        isContentVisible = !isContentVisible;
    }

    // creating a geojson for points of CMAs (when zoomed out)
    let cmaPoints;
    cmaPoints = {
        type: 'FeatureCollection',
        features: cmaSummary.filter(feature => feature.cmauid !== "000").map(feature => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [feature.x, feature.y]
        },
        properties: {
            cmauid: feature.cmauid,
            cmaname: feature.cmaname
        }
        }))
    }

    // array of all cma names
    let cmaAll = cmaSummary
        .sort((a, b) => b.pop2021 - a.pop2021)
        .map(item => item.cmaname);
        
    // array of populations
    let cmaPopulation = cmaSummary
        .sort((a, b) => b.pop2021 - a.pop2021)
        .map(item => item.pop2021);
    
    let map;
        
    // initial cma selected
	let cmaSelected = 'All CMAs';
    let selectedPop = 27281056;
    let selectedActive = 13.6;
    let selectedTransit = 11.1;
    let selectedAuto = 67.3;
    let selectedExurban = 8.0;
    let selectedUnclassified = 0.0;

    // empty selected ctuid variables
    let selectedCtuid = '';
    let selectedClass = '';
    let selectedCtPop = ''
    let selectedPercActive =''
    let selectedPercTransit =''
    let selectedPercAuto = ''

    

    onMount(() => {
        map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/schoolofcities/cli0otj3n04m601pa9s0s0mc4',
            center: [-97, 55], 
            zoom: 3,
            maxZoom: 14,
            minZoom: 2,
            scrollZoom: true,
            attributionControl: false
        });

        map.on('load', function () {
            map.addLayer({
            id: 'cmaPoints',
            type: 'circle',
            source: {
                type: 'geojson',
                data: cmaPoints
            },
            paint: {
                'circle-radius': 6,
                'circle-color': '#1E3765',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
            }
            });
        });

        map.on('load', function () {
            map.addLayer({
            id: 'transitStops',
            type: 'circle',
            source: {
                type: 'geojson',
                data: transitStops
            },
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5, 0,
                    6, 1,
                    20, 10
                ],
                'circle-color': '#AB1368',
            }
            }, 'suburbs-project-cma-fill');
        });

        map.on('load', function () {
            map.addLayer({
            id: 'transitLines',
            type: 'line',
            source: {
                type: 'geojson',
                data: transitLines
            },
            paint: {
                'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    5, 0,
                    6, 1,
                ],
                'line-color': '#AB1368',
            }
            }, 'suburbs-project-cma-fill');
        });


        map.on('zoom', function () {
          if (map.getZoom() < 5) {
            map.setLayoutProperty('cmaPoints', 'visibility', 'visible');
          } else {
            map.setLayoutProperty('cmaPoints', 'visibility', 'none');
          }
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const scale = new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
            });

        map.addControl(scale, 'bottom-right');

        // Mouse functions
        map.on('mouseenter', 'suburbs-project-ct', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'suburbs-project-ct', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'cmaPoints', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'cmaPoints', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('click' , 'suburbs-project-ct' , (e) => {
            selectedCtuid = e.features[0].properties.ctuid;
            selectedClass = e.features[0].properties.class;
            selectedCtPop = (e.features[0].properties.pop2021);
            selectedPercActive = ((e.features[0].properties.active)*100).toFixed(1);
            selectedPercTransit = ((e.features[0].properties.transit)*100).toFixed(1);
            selectedPercAuto = ((e.features[0].properties.auto)*100).toFixed(1);
        });

        map.on('click', 'suburbs-project-ct', (e) => {
            map.setFilter('suburbs-project-ct-highlight',
                [
                "all",
                [
                    "match",
                    ["get", "ctuid"],
                    [e.features[0].properties.ctuid],
                    true,
                    false
                ]
                ]
            )           
		});

        map.on('click', 'suburbs-project-cma-fill', (e) => {
            $: cmaSelected = cmaSummary.filter(item => item.cmauid === parseInt(e.features[0].properties.CMAUID))[0].cmaname;
        })

        map.on('click', 'cmaPoints', (e) => {
            console.log(e.features[0]);
            $: cmaSelected = e.features[0].properties.cmaname;
        })
    });


    // function for what to do when new cma is selected
    function handleSelect(e) {

        // reset cma selected variable
        cmaSelected = e.detail.value;

        // filter cma data to just the cma we selected
        let filteredData = cmaSummary.filter(item => item.cmaname === cmaSelected)[0];

        let cmaX = filteredData.x;
        let cmaY = filteredData.y;
        let cmauid = filteredData.cmauid.toString();

        //change data values based on cma selected
        selectedPop = (filteredData.pop2021);
        selectedActive = ((filteredData.active) * 100);
        selectedTransit = ((filteredData.transit) * 100);
        selectedAuto = ((filteredData.auto) * 100);
        selectedExurban = ((filteredData.exurban) * 100);
        selectedUnclassified = ((filteredData.unclassified) * 100);

        // pan and zoom to the new cma - reset pitch and bearing if they changed
        if (cmaSelected !== "All CMAs") {
            map.setZoom(9);
            map.setBearing(0);
            map.setPitch(0);
            map.panTo([cmaX, cmaY]);

            map.setPaintProperty('suburbs-project-cma-fill', 'fill-opacity', 0.8);

            map.setFilter('suburbs-project-cma-fill',
                [
                "all",
                [
                    "match",
                    ["get", "CMANAME"],
                    [
                    "Granby",
                    "Saint-Hyacinthe",
                    "North Bay",
                    "Sault Ste. Marie",
                    "Medicine Hat",
                    "Wood Buffalo",
                    ],
                    false,
                    true
                ],
                [
                    "match",
                    ["get", "CMAUID"],
                    [cmauid.toString()],
                    false,
                    true
                ]
            ])

            map.setFilter('suburbs-project-cma-highlight',
                [
                "all",
                [
                    "match",
                    ["get", "CMAUID"],
                    [cmauid],
                    true,
                    false
                ]
                ]
            )

        } else {
            map.setPaintProperty('suburbs-project-cma-fill', 'fill-opacity', 0);
            map.setFilter('suburbs-project-cma-fill',
                [
                "all",
                [
                    "match",
                    ["get", "CMANAME"],
                    [
                    "Granby",
                    "Saint-Hyacinthe",
                    "North Bay",
                    "Sault Ste. Marie",
                    "Medicine Hat",
                    "Wood Buffalo"
                    ],
                    false,
                    true
                ]
            ])

            map.setFilter('suburbs-project-cma-highlight',
                [
                "all",
                [
                    "match",
                    ["get", "CMAUID"],
                    ["000"],
                    true,
                    false
                ]
                ]
            )
        }
    }

    let isChecked = false;
    function toggleCheckbox() {
        isChecked = !isChecked;
        if (isChecked) {
            map.setPaintProperty('suburbs-project-ct', 'fill-opacity', 0.42);
            map.setPaintProperty('mapbox-satellite', 'raster-opacity', 1.00);
        } 
        else {
            map.setPaintProperty('suburbs-project-ct', 'fill-opacity', 0.7);
            map.setPaintProperty('mapbox-satellite', 'raster-opacity', 0);
        }
    };
    
</script>


<svelte:head>
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css' rel='stylesheet' />
</svelte:head>


<main>

    <div id="content">

        <h1>Canadian Suburbs Atlas</h1>

            <div id="content-wrapper" style="display: {isContentVisible ? 'block' : 'none'};">
            <div class="bar"></div>

            <p>
                Mapping where and how many people live in the suburbs in Canadian cities. Read about how neighbourhoods were classified <a href="https://www.canadiansuburbs.ca/research-papers/">here</a> (David Gordon et al.) 
            </p>
            <p>    
                Select below or click on the map to view a specific Census Metropolitan Area (CMA).
            </p>

            <div class="bar"></div>

            <div id="select-wrapper">
                <Select 
                    id="select"
                    items={cmaAll} 
                    value={cmaSelected} 
                    clearable={false} 
                    showChevron={true} 
                    on:input={handleSelect}
                    --background="white"
                    --height="20px"
                    --item-color="black"
                    --border-radius="0"
                    --border="1px"
                    --list-border-radius="0px"
                    --font-size="15px"
                    --max-height="30px"
                    --item-is-active-color="black"
                    --item-is-active-bg="lightgrey"
                />
            </div>

            <div class="bar"></div>

            <div id="legend-wrapper">
                <svg id="legend"  width="300" height="130">
                    
                    <text x="10" y="20" class="legend-text" font-size="12" >Population (2021): {selectedPop.toLocaleString()}</text>

                    <rect class="legend-bar" x="30" y="30" width="{200 * selectedActive / 100}" height="15"/>
                    <rect class="legend-box" x="10" y="30" width="15" height="15" fill="#8DBF2E" />
                    <text x="30" y="42" class="legend-text" font-size="12" >Active Core: <tspan font-weight="bold">{selectedActive.toFixed(1)}%</tspan> ({Math.round(selectedPop * selectedActive / 100).toLocaleString()} people)</text>

                    <rect class="legend-bar" x="30" y="50" width="{200 * selectedTransit / 100}" height="15"/>
                    <rect class="legend-box" x="10" y="50" width="15" height="15" fill="#00A189" />
                    <text x="30" y="62" class="legend-text" font-size="12" >Transit Suburb: <tspan font-weight="bold">{selectedTransit.toFixed(1)}%</tspan> ({Math.round(selectedPop * selectedTransit / 100).toLocaleString()} people)</text>

                    <rect class="legend-bar" x="30" y="70" width="{250 * selectedAuto / 100}" height="15"/>
                    <rect class="legend-box" x="10" y="70" width="15" height="15" fill="#F1C500" />
                    <text x="30" y="82" class="legend-text" font-size="12" >Auto Suburb: <tspan font-weight="bold">{selectedAuto.toFixed(1)}%</tspan> ({Math.round(selectedPop * selectedAuto / 100).toLocaleString()} people)</text>

                    <rect class="legend-bar" x="30" y="90" width="{200 * selectedExurban / 100}" height="15"/>
                    <rect class="legend-box" x="10" y="90" width="15" height="15" fill="#f7f2df" />
                    <text x="30" y="102" class="legend-text" font-size="12" >Exurb: <tspan font-weight="bold">{selectedExurban.toFixed(1)}%</tspan> ({Math.round(selectedPop * selectedExurban / 100).toLocaleString()} people)</text>

                    <rect class="legend-bar" x="30" y="110" width="{200 * selectedUnclassified / 100}" height="15"/>
                    <rect class="legend-box" x="10" y="110" width="15" height="15" fill="#D0D1C9" />
                    <text x="30" y="122" class="legend-text" font-size="12" >Unclassified / No Data: <tspan font-weight="bold">{selectedUnclassified.toFixed(1)}%</tspan> ({Math.round(selectedPop * selectedUnclassified / 100).toLocaleString()} people)</text>

                </svg>
            </div>

            <div class="bar"></div>



            <div id="satellite-switch">
                <p>
                    <input type="checkbox" on:change={toggleCheckbox}>
                    Satellite View
                    <svg width="30" height="15" xmlns="http://www.w3.org/2000/svg">
                        <line x1="8" y1="10" x2="30" y2="10" stroke="#AB1368" stroke-width="1"/>
                        <circle cx="19" cy="10" r="3" fill="#AB1368"/>
                    </svg>
                    Major Transit Line
                </p>
            </div>

            <div class="bar"></div>

            <div id="box">
                <p>
                    Selected Census Tract: {selectedCtuid}
                    <br>
                    Classification: <b>{selectedClass}</b>
                    <br>
                    Population (2021): {parseInt(selectedCtPop).toLocaleString()}
                    <br>
                    Mode Share (Journey to Work):
                    <br>
                    Active: {selectedPercActive}% |
                    Transit: {selectedPercTransit}% |
                    Auto: {selectedPercAuto}%  
                </p>
        </div>

        <div class="bar"></div>

            <p>
                This map was built by Remus Herteg and Jeff Allen at the School of Cities. Code is on <a>GitHub</a>
            </p>

        </div>

        <div id="hide" on:click={toggleContent}>
            {isContentVisible ? "Click here to hide this panel" : "Click here to show details about this map"}
        </div>

    </div>

	<div id="map"></div>

</main>



<style>

	:global(body) {
		padding: 0px;
		margin: 0px;
		background-color: var(--brandDarkBlue);
	}
    
    main {
		margin: auto 0px;
        padding: 0px;
		width: 100%;
		height: 100%;
        
	}
    
	#map {
		height: 100%;
		width: 100%;
        min-width: 350px;
		position: absolute;
		z-index: -99;
	}

    h1 {
        font-size: 27px;
        font-family: TradeGothicBold;
        margin: 0px;
        padding: 10px;
        padding-bottom: 5px;
        color: var(--brandDarkBlue);
    }

    p {
        font-size: 12px;
        font-family: RobotoRegular;
        line-height: 15px;
        margin: 0px;
        padding: 0px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-top: 5px;
        color: var(--brandGray80);
    }

    a {
        color: var(--brandMedBlue);
    }

    #content {
        width: 300px;
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: white; 
        border: solid 1px lightgrey;
        border-radius: 5px;
        z-index: 1; 
    }

    .bar {
        height: 1px;
        width: 290px;
        background-color: var(--brandDarkBlue);
        padding: 0px;
        margin: 0px;
        margin-left: 5px;
        opacity: 0.25;
    }

    #select-wrapper:hover {
        cursor: pointer;
    }

    #legend {
        background-color: white;
    }

    .legend-box {
        stroke: white;
        stroke-width: 0.5px;
    }

    .legend-bar {
        fill: #efefef;
        stroke: #cecece;
        stroke-width: 0.5px;
    }

    .legend-text {
        font-family: RobotoRegular;
        fill: var(--brandGray80);
    }

    #box {
        opacity: 1;
    }

    #hide {
        font-family: RobotoRegular;
        font-size: 12px;
        height: 18px;
        text-align: center;
        background-color: none;
        border-top: solid 1px lightgrey;
        padding-top: 3px;
        opacity: 0.98;
        color: var(--brandMedBlue);
    }

    #hide:hover {
        background-color: var(--brandYellow);
        cursor: pointer;
    }

</style>
