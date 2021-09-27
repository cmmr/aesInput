function initAesInput (inputId, jsonIn, picker) {
   
  //alert(JSON.stringify(jsonIn));
  
  if (picker == "multi") {
    document.getElementById(inputId + "-parent").setAttribute('multiple', '');
  }
   
   
  $("#" + inputId + "-parent").selectize({
    
    plugins: ['selectize-plugin-a11y'],
     
    closeAfterSelect: true,
     
    options: jsonIn.map(function (x, i) { return ({ value: i, text: x.name }) }),
     
    onInitialize: function () {
      $("#" + inputId).triggerHandler("update");
    },
     
    onItemAdd: function (value, item) {
       
      var col  = jsonIn[value]; // 'value' is the index of the column in jsonIn
      var lvlA = inputId + "-" + value + "A";
      var lvlB = inputId + "-" + value + "B";
      var lvlC = inputId + "-" + value + "C";
       
      // The target DIV to insert into
      var container = document.getElementById(inputId);
       
      // Remove all prior controls when in single mode
      if (picker != "multi") {
        $("#" + inputId).children(".aesinput-child").remove();
      }
       
      // Add a new div that we can easily remove
      var newdiv = document.createElement("div");
          newdiv.setAttribute("id", lvlA);
          newdiv.setAttribute("class", "aesinput-child");
          newdiv.setAttribute("data-column", col.name);
          newdiv.setAttribute("data-mode",   col.mode);
      if (picker == "multi") {
        newdiv.setAttribute("style", "padding-top:5px; margin-left:20px");
      }
      container.appendChild(newdiv);
      container = newdiv;
       
       
      if (picker == "multi") {
       
        // Add the form-group for a label/control pair
        var fgDiv = document.createElement("div");
            fgDiv.setAttribute("class", "form-group shiny-input-container");
        container.appendChild(fgDiv);
        container = fgDiv;
         
        // The Label for this control
        var labelDiv = document.createElement("label");
            labelDiv.setAttribute("for", lvlB);
            labelDiv.setAttribute("class", "control-label");
            labelDiv.innerHTML = col.name;
        container.appendChild(labelDiv);
      }
       
      // A DIV for just the control (give id matching `label for`)
      var ctrlDiv = document.createElement("div");
          ctrlDiv.setAttribute("id", lvlB);
      container.appendChild(ctrlDiv);
      container = ctrlDiv;
       
       
      // Render different controls depending on data class
       
      if (col.mode === "factor") {
         
        // Create and append select list
        var selectList = document.createElement("select");
            selectList.setAttribute("id", lvlC);
            selectList.setAttribute("class", "form-control");
            selectList.setAttribute("multiple", "multiple");
        container.appendChild(selectList);
         
        // Create and append the options
        var optionList = col.options;
        if (optionList.constructor !== Array) {
          optionList = [optionList]; // Coerce n=1 into an array
        }
        for (var j in optionList) {
          var option       = document.createElement("option");
              option.value = j;
              option.text  = optionList[j];
          selectList.appendChild(option);
        }
        
         
        // //-----------------------------------------------
        // // Options WITH a color picker
        // //-----------------------------------------------
        // if (picker == "color") {
        //    
        //   // Define the default color list
        //   var colorList = [];
        //   if (optionList.length <= 2) { // Colorblind friendly palette
        //     colorList = ['#00B9EB', '#ED5F16'];
        //      
        //   } else if (optionList.length <= 8) { // RColorBrewer's Set1
        //     colorList = ['#EE2C2C', '#4682B4', '#548B54', '#8B4789', '#FF7F00', '#FFFF00', '#A0522D', '#FF82AB'];
        //      
        //   } else if (optionList.length <= 11) { // Andrea's set of 11
        //     colorList = ['#66CDAA', '#FF8C69', '#8DB6CD', '#008B8B', '#FF6EB4', '#A2CD5A', '#FF6347', '#FFC125', 
        //                  '#EEC591', '#BEBEBE', '#CD96CD'];
        //      
        //   } else if (optionList.length <= 20) { // Andrea's set of 20
        //     colorList = ['#8B4500', '#CD853F', '#FF1493', '#FFB5C5', '#CDC5BF', '#6C7B8B', '#B22222', '#FF0000', 
        //                  '#FF7F24', '#FFD700', '#00FF00', '#2E8B57', '#00FFFF', '#63B8FF', '#0000FF', '#191970', 
        //                  '#8B008B', '#A020F0', '#DA70D6', '#F08080'];
        //                   
        //   } else { // Dan's set of 24
        //     colorList = ['#1C86EE', '#E31A1C', '#008B00', '#6A3D9A', '#A52A2A', '#FF7F00', '#FFD700', '#7EC0EE', 
        //                  '#FB9A99', '#90EE90', '#CAB2D6', '#FDBF6F', '#B3B3B3', '#EEE685', '#B03060', '#FF83FA', 
        //                  '#FF1493', '#0000FF', '#36648B', '#00CED1', '#00FF00', '#8B8B00', '#CDCD00', '#8B4500'];
        //   }
        //    
        //   // Break up list into chunks of four colors for the color picker
        //   var colorPalette = [];
        //   for (i = 0; i < colorList.length; i+=4) {
        //     colorPalette.push(colorList.slice(i, Math.min(i+4, colorList.length)));
        //   }
        //    
        //    
        //   $("#" + selectList.id).selectize({
        //     
        //     plugins: ['selectize-plugin-a11y'],
        //  
        //     render: {
        //       // Show text-only in the dropdown.
        //       option: function (item, escape) {
        //         return '<div>' + escape(item.text) + '</div>';
        //       },
        //       // Add a color picker to each item in the selected list.
        //       item: function (item, escape) {
        //         return '<div>' + escape(item.text) + '<input id="' + lvlC + "-" + item.value + '"></div>';
        //       }
        //     },
        //          
        //     // Initialize each color picker.
        //     onItemAdd: function (value, item) {
        //       //alert("Adding " + JSON.stringify(value) + " :: " + JSON.stringify(item));
        //        
        //       $("#" + lvlC + "-" + value).spectrum({
        //         color:                colorList[parseInt(value) % colorList.length],
        //         showInput:            true,
        //         showPalette:          true,
        //         showPaletteOnly:      true,
        //         togglePaletteOnly:    true,
        //         showSelectionPalette: true,
        //         showButtons:          false,
        //         preferredFormat:      "hex",
        //         palette:              colorPalette,
        //         maxSelectionSize:     12,
        //         localStorageKey:      "atima.colors",
        //          
        //         // Return focus to the selectize after choosing a color
        //         hide: function (color) {
        //           var p = document.activeElement.closest('div[id]');
        //           if (!(p && p.id == lvlB)) {
        //             document.getElementById(lvlC).selectize.focus();
        //           }
        //         }
        //       });
        //       
        //       // Remove zombie color pickers if present.
        //       // (Selecting an option, deselecting it, then selecting it again 
        //       // would result in two color pickers, only the first would work.)
        //       if ($("#" + lvlC + "-" + value).parent().children().length > 2) {
        //         $("#" + lvlC + "-" + value).parent().children().last().remove()
        //       }
        //     },
        //      
        //     // List of selected items for this column has changed.
        //     onChange: function (value) {
        //       jsonOut[col.name].indices = value;
        //     },
        //      
        //     // Only trigger changes to shiny upon losing mouse focus.
        //     onBlur: function () {
        //        
        //       // Don't fire if any color pickers are open
        //       if (document.getElementsByClassName("sp-container").length != document.getElementsByClassName("sp-hidden").length) {
        //         return (null);
        //       }
        //        
        //       jsonOut[col.name].selected = [];
        //       jsonOut[col.name].color    = [];
        //        
        //       // Lookup each selected index's value and color
        //       if (jsonOut[col.name].indices && jsonOut[col.name].indices.length) {
        //          
        //         for (var j in jsonOut[col.name].indices) {
        //           var idx = jsonOut[col.name].indices[j];
        //           var id  = "#" + selectList.id + "-" + idx;
        //           jsonOut[col.name].selected.push(optionList[parseInt(idx)]);
        //           jsonOut[col.name].color.push($(id).spectrum("get").toHexString());
        //         }
        //          
        //       } else { // If no values are selected, act as if all values are selected
        //        
        //         for (i = 0; i < optionList.length; i++) {
        //           jsonOut[col.name].selected.push(optionList[i]);
        //           jsonOut[col.name].color.push(colorList[i % colorList.length]);
        //         }
        //       }
        //       //console.log(JSON.stringify(jsonOut));
        //       Shiny.setInputValue(inputId, jsonOut);
        //     }
        //     
        //   });
        // }
        
        
        $("#" + selectList.id).selectize({
  
          plugins: ['selectize-plugin-a11y'],
       
          render: {
            
            
            // Show text-only in the dropdown.
            // --------------------------------------------------------------
            option: function (item, escape) {
              return '<div>' + escape(item.text) + '</div>';
            },
            
            
            // Add a shape/pattern picker to each item in the selected list.
            // --------------------------------------------------------------
            item: function (item, escape) {
              
              const label = escape(item.text);
              
              
              // Basic and multi pickers don't need popovers or previews
              if (picker == "basic" || picker == "multi") {
                
                let divParams  = [
                  'class'    + '="item aesinput-child-opt"',
                  'data-key' + `="${label}"`,
                  'data-val' + `="${label}"`
                ].join(" ");
                
                return `<div ${divParams}>${label}</div>`;
              }
              
              
              // A target for initialization of a popover
              let divParams  = [
                'id'             + `="${lvlC}-${item.value}-pop"`,
                'class'          + '="item"',
                'title'          + `="Select ${picker} for <b>${label}</b>"`,
                'data-toggle'    + `="popover"`,
                'data-container' + `="body"`
              ].join(" ");
              
              // Tack on a preview image of the selected color/shape/pattern.
              // color => modifies background-color
              // shape/pattern => modifies src
              let imgParams  = [
                'id'       + `="${lvlC}-${item.value}-opt"`,
                'class'    + '="aesinput-child-opt"',
                'style'    + '="height:1em"',
                'src'      + `="${aesinput_pixel}"`,
                'data-key' + `="${label}" `,
                'data-val' + '=""'
              ].join(" ");
              
              return `<div ${divParams}>${label} <img ${imgParams}></div>`;
            }
          },
          
          
          // Initialize each color/shape/pattern picker.
          // --------------------------------------------------------------
          onItemAdd: function (value, item) {
            
            if (picker == "basic" || picker == "multi") return null;
            
            if (picker == "color")   ai_color_picker(lvlC,   value, item, optionList.length);
            if (picker == "shape")   ai_shape_picker(lvlC,   value, item, optionList.length);
            if (picker == "pattern") ai_pattern_picker(lvlC, value, item, optionList.length);
            
            // Only allow one popover to be open at once.
            // Simulate closing clicks instead of calling $(this).popover('hide')
            // https://stackoverflow.com/q/32581987/3259270
            // --------------------------------------------------------------
            $("#" + lvlC + "-" + value + "-pop").on("show.bs.popover", function () {
              $('body').children(".popover").each(function() {
                $('[aria-describedby="' + this.id + '"]').click();
              });
            });
          },
           
           
          // Only trigger changes to shiny upon losing mouse focus.
          // --------------------------------------------------------------
          onBlur: function () {
             $("#" + inputId).triggerHandler("update");
          }
        });
        
         
        // Send the focus there
        $("#" + lvlB).children(".selectize-control").children(".selectize-input").children("input").focus();
      }
       
      if (col.mode === "numeric") {
         
        //Create and append slider input
        var slider = document.createElement("input");
            slider.setAttribute("type", "text");
            slider.setAttribute("id", lvlC);
            slider.setAttribute("class", "aesinput-child-opt");
        container.style = "padding-bottom:5px";
        container.appendChild(slider);
         
        $("#" + slider.id).ionRangeSlider({
          type:     "double",
          skin:     "shiny",
          min:      col.min,
          max:      col.max,
          onFinish: function (data) {
            $("#" + inputId).triggerHandler("update");
          }
        });
         
      }
    },
     
    onItemRemove: function (value) {
      $("#" + inputId + "-" + value + "A").remove();
    },
     
    onBlur: function () {
       $("#" + inputId).triggerHandler("update");
    }
     
  });
}
    
