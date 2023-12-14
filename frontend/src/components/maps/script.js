function digitKabKota(idkabkota) {
    const digitasi = new google.maps.Data();
    const infoWindow = new google.maps.InfoWindow();

    if (idkabkota < 10) {
        digitasiValue = 'K0' + idkabkota;
    } else if(idkabkota >= 10) {
        digitasiValue = 'K' + idkabkota;
    }
    $.ajax({
        url: baseUrl + '/api/village',
        type: 'POST',
        data: {
            digitasi: digitasiValue
        },
        dataType: 'json',
        success: function (response) {
            const data = response.data;
            digitasi.addGeoJson(data);
            digitasi.setStyle({
                fillColor: '#F875AA',
                strokeWeight: 0.5,
                strokeColor: '#ffffff',
                fillOpacity: 0.5,
                clickable: true // Set clickable to true to enable click event
            });
            digitasi.setMap(map);

            // Event listener for click
            digitasi.addListener('click', function(event) {
                const kabkotaName = event.feature.getProperty('name');
                console.log(kabkotaName);

                // Set label for the clicked feature using InfoWindow
                infoWindow.setContent(kabkotaName+', Sumatera Barat');
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
            });
        }
    });
}