// alert("Adding value = " + JSON.stringify(value) + " :: item = " + JSON.stringify(item));


  
// Don't sanitize away IMG style and onclick attributes
// https://getbootstrap.com/docs/3.4/javascript/#js-sanitizer
var aesinput_whiteList = $.fn.tooltip.Constructor.DEFAULTS.whiteList
    aesinput_whiteList['img'].push('style');
    aesinput_whiteList['img'].push('onclick');

// A 1px x 1px transparent png, encoded as base64 from https://png-pixel.com
var aesinput_pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";


function ai_color_picker (lvlC, value, item, nOpts) {
  
  
  const color_sets = [
    {
      title: "Colorblind 2",
      opts: ['#00B9EB', '#ED5F16']
    }, {
      title: "Colorblind 8",
      opts: [
        '#EE2C2C', '#4682B4', '#548B54', '#8B4789', '#FF7F00', '#FFFF00', 
        '#A0522D', '#FF82AB' ]
    }, {
      title: "N = 11",
      opts: [
        '#66CDAA', '#FF8C69', '#8DB6CD', '#008B8B', '#FF6EB4', '#A2CD5A', 
        '#FF6347', '#FFC125', '#EEC591', '#BEBEBE', '#CD96CD' ]
    }, {
      title: "N = 20",
      opts: [
        '#8B4500', '#CD853F', '#FF1493', '#FFB5C5', '#CDC5BF', '#6C7B8B', 
        '#B22222', '#FF0000', '#FF7F24', '#FFD700', '#00FF00', '#2E8B57', 
        '#00FFFF', '#63B8FF', '#0000FF', '#191970', '#8B008B', '#A020F0', 
        '#DA70D6', '#F08080' ]
    }, {
      title: "N = 24",
      opts: [
        '#1C86EE', '#E31A1C', '#008B00', '#6A3D9A', '#A52A2A', '#FF7F00', 
        '#FFD700', '#7EC0EE', '#FB9A99', '#90EE90', '#CAB2D6', '#FDBF6F', 
        '#B3B3B3', '#EEE685', '#B03060', '#FF83FA', '#FF1493', '#0000FF', 
        '#36648B', '#00CED1', '#00FF00', '#8B8B00', '#CDCD00', '#8B4500' ]
    }
  ];
  
  
  // Find the smallest color set that works for current optionList
  let color_set = color_sets[color_sets.length - 1].opts;
  color_sets.reverse().forEach(function(item, index, array) {
    if (item.opts.length >= nOpts) color_set = item.opts;
  })
  
  let opt = color_set[parseInt(value) % color_set.length]
  document.getElementById(lvlC + "-" + value + "-opt").style['background-color'] = opt;
  document.getElementById(lvlC + "-" + value + "-opt").dataset.val = opt;
  
  $("#" + lvlC + "-" + value + "-pop").popover({
    html:      true,
    whiteList: aesinput_whiteList, 
    content:   function () {
      return color_sets.map(i => {
        return `<b>${i.title}</b><br>` + i.opts.map(j => {
          const imgParams = [
            'src'     + `="${aesinput_pixel}"`,
            'style'   + `="height:20px; width:30px; background-color:${j}"`,
            'onclick' + `="ai_select('${lvlC}-${value}', 'color', '${j}')"`
          ].join(" ");
          return `<img ${imgParams}>`;
        }).join('');
      }).join("<hr>");
    }
    
  });
  
}


function ai_shape_picker (lvlC, value, item, nOpts) {
  
  const pickerOptions = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
    '11', '12', '13', '14', '15', '16', '17', '18' ];
  
  let opt = pickerOptions[parseInt(value) % pickerOptions.length]
  let src   = 'aesinput/shape/' + opt + '.png';
  document.getElementById(lvlC + "-" + value + "-opt").src = src;
  document.getElementById(lvlC + "-" + value + "-opt").dataset.val = opt;
  
  $("#" + lvlC + "-" + value + "-pop").popover({
    html:      true,
    whiteList: aesinput_whiteList, 
    content:   function () {
      
      let opt = '';
      pickerOptions.forEach(function(item, index, array) {
        let imgParams = '';
            imgParams += 'src'     + `="aesinput/shape/${item}.png" `;
            imgParams += 'onclick' + `="ai_select('${lvlC}-${value}', 'shape', '${item}')"`;
      
        opt += `<img ${imgParams}>`;
      })
      return opt;
    }
    
  });
}

function ai_pattern_picker (lvlC, value, item, nOpts) {
  
  const pickerOptions = [
    'bricks', 'checkerboard', 'circles', 'hexagons', 
    'smallfishscales', 'fishscales', 'octagons', 
    'crosshatch', 'crosshatch30', 'crosshatch45', 
    'gray0', 'gray20', 'gray40', 'gray60', 'gray80', 'gray100', 
    'horizontal', 'horizontal2', 'horizontal3', 
    'horizontalsaw', 'hs_bdiagonal', 'hs_cross', 'hs_diagcross', 
    'hs_fdiagonal', 'hs_horizontal', 'hs_vertical', 
    'left30', 'left45', 'right30', 'right45', 
    'leftshingle', 'rightshingle', 
    'vertical', 'vertical2', 'vertical3', 'verticalbricks', 
    'verticalleftshingle', 'verticalrightshingle', 'verticalsaw' ];
  
  let opt = pickerOptions[parseInt(value) % pickerOptions.length]
  let src   = 'aesinput/pattern/' + opt + '.png';
  document.getElementById(lvlC + "-" + value + "-opt").src = src;
  document.getElementById(lvlC + "-" + value + "-opt").dataset.val = opt;
  
  $("#" + lvlC + "-" + value + "-pop").popover({
    html:      true,
    whiteList: aesinput_whiteList, 
    content:   function () {
      
      let opt = '';
      pickerOptions.forEach(function(item, index, array) {
        let imgParams = '';
            imgParams += 'src'     + `="aesinput/pattern/${item}.png" `;
            imgParams += 'onclick' + `="ai_select('${lvlC}-${value}', 'pattern', '${item}')"`;
      
        opt += `<img ${imgParams}>`;
      })
      return opt;
    }
    
  });
}




function ai_select(el, picker, opt) {
  
  document.getElementById(el + '-opt').dataset.val = opt;
  
  if (picker == "color") {
    document.getElementById(el + '-opt').style['background-color'] = opt;
    
  } else {
    const src = 'aesinput/' + picker + '/' + opt + '.png';
    document.getElementById(el + '-opt').src = src;
  }
  
  // Close this popover
  $('#' + el + '-pop').popover('hide');
  
  // Needs two clicks after being hidden.
  // https://stackoverflow.com/q/32581987/3259270
  $('#' + el + '-opt').click();
}

