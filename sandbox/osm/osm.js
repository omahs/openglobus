import {
    Globe,
    GlobusTerrain,
    EmptyTerrain,
    MapboxTerrain,
    XYZ,
    control,
    utils
} from "../../lib/@openglobus/og.esm.js";


function toQuadKey(x, y, z) {
    var index = '';
    for (let i = z; i > 0; i--) {
        var b = 0;
        var mask = 1 << (i - 1);
        if ((x & mask) !== 0) b++;
        if ((y & mask) !== 0) b += 2;
        index += b.toString();
    }
    return index;
}

let sat = new XYZ("sat", {
    subdomains: ['t0', 't1', 't2', 't3'],
    url: "https://ecn.{s}.tiles.virtualearth.net/tiles/a{quad}.jpeg?n=z&g=7146",
    isBaseLayer: true,
    maxNativeZoom: 19,
    defaultTextures: [{ color: "#001522" }, { color: "#E4E6F3" }],
    attribution: `<div style="transform: scale(0.8); margin-top:-2px;"><a href="http://www.bing.com" target="_blank"><img title="Bing Imagery" src="https://sandcastle.cesium.com/CesiumUnminified/Assets/Images/bing_maps_credit.png"></a> © 2021 Microsoft Corporation</div>`,
    urlRewrite: function (s, u) {
        return utils.stringTemplate(u, {
            's': this._getSubdomain(),
            'quad': toQuadKey(s.tileX, s.tileY, s.tileZoom)
        });
    },
    specular: [0.00063, 0.00055, 0.00032],
    ambient: "rgb(90,90,90)",
    diffuse: "rgb(350,350,350)",
    shininess: 20,
    nightTextureCoefficient: 2.7
});

let osm = new XYZ("osm", {
    isBaseLayer: true,
    url: "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
    visibility: true,
    attribution: 'Data @ OpenStreetMap contributors, ODbL',
    maxNativeZoom: 19,
    defaultTextures: [{ color: "#AAD3DF" }, { color: "#F2EFE9" }],
    isSRGB: false,
    shininess: 18, //specular: "rgb(0.16575, 0.14152, 0.06375)",
    specular: [0.00063, 0.00055, 0.00032],
    ambient: [0.2, 0.2, 0.3],
    diffuse: [0.9, 0.9, 0.7], //textureFilter: "linear"
});

var highResTerrain = new MapboxTerrain(null, {
    maxZoom: 19,
    //url: "//terrain.openglobus.org/public/eu10/{z}/{x}/{y}.png",
    //url: "https://andorra.utm.microavia.com/Andora_dsm_las/{z}/{x}/{y}.png",
    //url: "//terrain.openglobus.org/public/zion/{z}/{x}/{y}.png",
    //equalizeVertices: false,
    //url: "//terrain.openglobus.org/public/nz/{z}/{x}/{y}.png",
    url: "http://127.0.0.1:8080/sandbox/osm/tiles/{z}/{x}/{y}.png",
    //imageSize: 129,
    plainGridSize: 256,
    gridSizeByZoom: [
        64, 32, 16, 8, 8, 8, 8, 16, 16, 16, 64, 64, 128, 128, 128, 256, 256, 256, 128, 64, 32, 16
        //64, 32, 16, 8, 8, 8, 8, 16, 16, 16, 16, 16, 32, 32, 32, 64, 64, 64, 64, 32, 16, 8
        //8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4
    ]
});

const globus = new Globe({
    target: "earth",
    name: "Earth",
    //terrain: highResTerrain,
    terrain: new EmptyTerrain(),
    layers: [sat],
    atmosphereEnabled: true
});

globus.planet.addControl(new control.DebugInfo());
globus.planet.addControl(new control.KeyboardNavigation());
globus.planet.addControl(new control.TimelineControl());
globus.planet.addControl(new control.Lighting());
globus.planet.addControl(new control.ToggleWireframe());