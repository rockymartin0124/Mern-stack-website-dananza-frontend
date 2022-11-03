var ComponentsNoUiSliders2 = function() {

    var gender = function() {
        var html5Slider = document.getElementById('seller_page_gender');

        if( html5Slider !== null){
            noUiSlider.create(html5Slider, {
                start: [ 0 ],
                connect: false,
                range: {
                    'min': 0,
                    'max': 100
                }
            });
            html5Slider.noUiSlider.on('update', function( values, handle ) {
                values[0] = Math.round(values[0]);
                document.getElementById("male").innerHTML = values[0] + "%";
                document.getElementById("female").innerHTML = (100-values[0]) + "%";
            });
        }
    }
    var age = function() {
        var html5Slider = document.getElementById('seller_page_age');

        if( html5Slider !== null){
            noUiSlider.create(html5Slider, {
                start: [ 0, 60 ],
                connect: true,
                range: {
                    'min': 0,
                    'max': 60
                }
            });
            html5Slider.noUiSlider.on('update', function( values, handle ) {
                document.getElementById("age_result").innerHTML = Math.round(values[0])+"-"+Math.round(values[1])+"yrs old";
            });
        }
    }

    return {
        //main function to initiate the module
        init: function() {
            // gender();
            // age();
        }

    };

}();

jQuery(document).ready(function() {    
   ComponentsNoUiSliders2.init(); 
});