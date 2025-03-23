async function initMap(locations) {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 48.956373424716, lng: 31.37509150510081 },
        mapId: "DEMO_MAP_ID",
    });

    const colorMapping = {
        'Інше': '#93938d',
        'Житло': '#a7e3fb',
        'Освіта': '#d0fba7',
        'Водогони': '#5198f9',
        'Медицина': '#f77070',
        'Адміністративні': '#f7cc70',
        'Транспорт': '#f1f537'
    }

    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    function formatContent(data) {
        return '<p>Категорія: ' + data['object_type'] + '</p>' +
        '<p>Бюджет: ' + data['amount_decision'] + ' грн</p>' +
        '<p>Використано*: ' + +data['amount'] + ' грн</p>' +
        '<p>Відсоток освоєння: ' + (data['amount'] / data['amount_decision'] * 100).toFixed(2) + '%</p>' +
            '* можливі неточності'
    }

    const markers = Object.keys(locations).map((key, index) => {
        const data = locations[key];
        const position = {lat: data['latitude'], lng: data['longitude']}

        const pinGlyph = new google.maps.marker.PinElement({
            background: colorMapping[data['object_type']],
        });
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            content: pinGlyph.element,
        });

        marker.addListener("click", () => {
            infoWindow.setHeaderContent(data['name'].capitalize());
            infoWindow.setContent(
                formatContent(data)
            );
            infoWindow.open(map, marker);
        });
        return marker;
        }
    );
    new markerClusterer.MarkerClusterer({ markers, map });
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});
readTextFile("demo-data.json", (text) => {
    initMap(JSON.parse(text));
});

