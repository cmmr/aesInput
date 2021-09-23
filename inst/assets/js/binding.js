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
      
      let keys = [];
      let vals = [];
      let mode = $(this).attr("data-mode");   // numeric or factor
      let coln = $(this).attr("data-column"); // metadata column name (e.g. "Body Site")
      
      if (mode == "numeric") {
        keys = ['min', 'max'];
        vals = $(this).find(".aesinput-child-opt").val().split(";"); // ionRangeSelector
        
      } else {
        $(this).find(".aesinput-child-opt").each(function(j){
          keys.push($(this).attr("data-key")); // Column values (e.g. "Saliva", "Stool")
          vals.push($(this).attr("data-val")); // Colors, shapes, etc (e.g. "#00FF00")
        });
      }
      
      selections.push({picker:picker, column:coln, mode:mode, keys:keys, vals:vals});
    });
    
    
    // return the output as JSON 
    return(JSON.stringify(selections))
  },
  
  
  setValue: function(el, value) {
    // not implemented
  },
  
  
  // See https://api.jquery.com/on/
  subscribe: function(el, callback) {
    // Will need to manually trigger change event on the <div>
    $(el).on('update.aesinput', function(event) { callback(false); });	
  },
  
  
  unsubscribe: function(el) {
    $(el).off('.aesinput');
  }
});

// Register AesInput with Shiny
Shiny.inputBindings.register(AesInput);


