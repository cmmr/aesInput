// AesInput Input Binding


// Create a Shiny-compatible input
var AesInput = new Shiny.InputBinding();

$.extend(AesInput, {
  
  find: function(scope) {
    return $(scope).find(".aesinput");
  },
  
  
  getType: function(el) {
    return "AesInput";
  },
  
  
  getValue: function(el) {
    
    let selections = [];                        // Values selected by the user
    let picker     = $(el).attr("data-picker"); // basic, multi, color, shape, or pattern
    
    // Each metadata column selected from aesinput-parent becomes an 'aesinput-child'.
    $(el).find(".aesinput-child").each(function(i){
      
      let keys   = [];
      let vals   = [];
      let mode   = $(this).attr("data-mode");   // numeric or factor
      let column = $(this).attr("data-column"); // metadata column name (e.g. "Body Site")
      
      if (mode == "numeric") {
        keys = ['min', 'max'];
        vals = $(this).find(".aesinput-child-opt").val().split(";"); // ionRangeSelector
        
      } else {
        $(this).find(".aesinput-child-opt").each(function(j){
          keys.push($(this).attr("data-key")); // Column values (e.g. "Saliva", "Stool")
          vals.push($(this).attr("data-val")); // Colors, shapes, etc (e.g. "#00FF00")
        });
      
      
        // If none are selected, select all
        if (keys.length == 0) {
          keys = $(this).find(".selectize-dropdown-content").children();
          keys = keys.map(function() { return this.innerText }).get();
          
          if (picker == "color" || picker == "shape" || picker == "pattern") {
            if (picker == "color")          { vals = ai_default_colors(keys.length);
            } else if (picker == "shape")   { vals = ai_shapes;
            } else if (picker == "pattern") { vals = ai_patterns; }
            vals = keys.map(function(key, i) { return vals[i % vals.length] });
          } else {
            vals = keys;
          }
        }
      }
      
      if (keys.length > 0 && vals.length > 0) {
        selections.push({picker:picker, column:column, mode:mode, keys:keys, vals:vals});
      }
    });
    
    
    // return the output as JSON 
    return(JSON.stringify(selections))
  },
  
  
  setValue: function(el, value) {
    // not implemented
  },
  
  
  // See https://api.jquery.com/on/
  subscribe: function(el, callback) {
    $(el).on('update.aesinput', function(event) {
      if ($('body').children(".popover").length == 0) {
        callback(false);
      }
    });	
  },
  
  
  unsubscribe: function(el) {
    $(el).off('.aesinput');
  }
});

// Register AesInput with Shiny
Shiny.inputBindings.register(AesInput);


