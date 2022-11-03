var ComponentsKnobDials = function () {

    return {
        //main function to initiate the module
        
        init: function () {
            //knob does not support ie8 so skip it
            if (!jQuery().knob || App.isIE8()) {
                return;
            }

            // general knob
            $(".knob").knob({
                'dynamicDraw': true,
                'thickness': 0.1,
                'tickColorizeValues': true,
                'skin': 'tron',
                'format': function(v){return v+"%";}
            });  
            $(".rate").knob({
                'dynamicDraw': true,
                'thickness': 0.1,
                'tickColorizeValues': true,
                'skin': 'tron',
                'format': function(v){return v+(v==Math.round(v)?'.0  ':'  ');}
            });  
        }

    };

}();

jQuery(document).ready(function() {    
   ComponentsKnobDials.init(); 
});