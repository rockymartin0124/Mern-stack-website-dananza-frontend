var ComponentsNoUiSliders = function() {
    var reach = function() {
        var html5Slider = document.getElementById('reach');

        noUiSlider.create(html5Slider, {
            start: [ 0, 100 ],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });
        html5Slider.noUiSlider.on('update', function( values, handle ) {
            document.getElementById("reach_result").innerHTML = Math.round(values[0])+"-"+Math.round(values[1])+"k+";
        });
    }
    var gender = function() {
        var html5Slider = document.getElementById('gender');

        noUiSlider.create(html5Slider, {
            start: [ 0 ],
            connect: false,
            range: {
                'min': 0,
                'max': 1
            }
        });
        html5Slider.noUiSlider.on('update', function( values, handle ) {
            if( Math.round(values[0]) != values[0])
                html5Slider.noUiSlider.set([Math.round(values[0]), null]);
            //slider.noUiSlider.set(Math.round(values[0]));
        });
    }
    var age = function() {
        var html5Slider = document.getElementById('age');

        noUiSlider.create(html5Slider, {
            start: [ 0, 60 ],
            connect: true,
            range: {
                'min': 0,
                'max': 60
            }
        });
        html5Slider.noUiSlider.on('update', function( values, handle ) {
            document.getElementById("age_result").innerHTML = Math.round(values[0])+"-"+Math.round(values[1])+"+";
        });
    }

    return {
        //main function to initiate the module
        init: function() {
            gender();
            reach();
            age();
        }

    };

}();

jQuery(document).ready(function() {    
   ComponentsNoUiSliders.init(); 
});