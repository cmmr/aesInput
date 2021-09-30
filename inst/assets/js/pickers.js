// alert("Adding value = " + JSON.stringify(value) + " :: item = " + JSON.stringify(item));


// A 1px x 1px transparent png, encoded as base64 from https://png-pixel.com
var aesinput_pixel = '' +
  'data:image/png;base64,' +
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA' +
  'AAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const ai_colors = [
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


//---------------------------------------------------------
// Find the smallest color set that works for n colors
//---------------------------------------------------------
function ai_default_colors (n) {
  
  for (let i = 0; i < ai_colors.length; i++) {
    if (ai_colors[i].opts.length >= n) {
      return ai_colors[i].opts;
    }
  }
  
  return ai_colors[ai_colors.length - 1].opts;
}


//---------------------------------------------------------
// Initialize an item displayed inside a selectize.
//---------------------------------------------------------
function ai_color_picker (lvlC, value, item, nOpts) {
  
  // Set the preview thumbnail for the selectize input item
  const colors = ai_default_colors(nOpts);
  const color  = colors[parseInt(value) % colors.length];
  document.getElementById(lvlC + "-" + value + "-opt").style['background-color'] = color;
  document.getElementById(lvlC + "-" + value + "-opt").dataset.val = color;
  
  
  // Define the popover color picker
  //---------------------------------------------------------
  $("#" + lvlC + "-" + value + "-pop").popover({
    html:     true,
    sanitize: false,
    content:  function () {
      return ai_colors.map(i => {
        
        let imgs = i.opts.map(j => 
          `<td style="border-radius:10px; background-color:${j}">` +
          `<img height=20 width=30 src="${aesinput_pixel}"` +
          ` onclick="ai_select('${lvlC}-${value}', 'color', '${j}')"` +
          '></td>'
        );
        
        let tbl = '';
        while (imgs.length) {
          tbl += '<tr>' + imgs.splice(0,7).join('') + '</tr>';
        }
        
        return `<b>${i.title}</b><br><table>${tbl}</table>`;
        
      }).join("<hr>");
    }
    
  });
  
}


const ai_shapes = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 
  '14', '15', '16', '17', '18' ];


//---------------------------------------------------------
// Initialize an item displayed inside a selectize.
//---------------------------------------------------------
function ai_shape_picker (lvlC, value, item, nOpts) {
  
  let shape  = ai_shapes[parseInt(value) % ai_shapes.length]
  let source = 'aesinput/shape/' + shape + '.png';
  document.getElementById(lvlC + "-" + value + "-opt").src = source;
  document.getElementById(lvlC + "-" + value + "-opt").dataset.val = shape;
  
  $("#" + lvlC + "-" + value + "-pop").popover({
    html:     true,
    sanitize: false,
    content:  function () {
      return ai_shapes.map(x => {
        const src     = `aesinput/shape/${x}.png`;
        const onclick = `ai_select('${lvlC}-${value}', 'shape', '${x}')`;
        return `<img src="${src}" onclick="${onclick}">`
      });
    }
    
  });
}


const ai_patterns = [
  'bricks', 'checkerboard', 'circles', 'hexagons', 'smallfishscales', 
  'fishscales', 'octagons', 'crosshatch', 'crosshatch30', 'crosshatch45', 
  'gray0', 'gray20', 'gray40', 'gray60', 'gray80', 'gray100', 'horizontal', 
  'horizontal2', 'horizontal3', 'horizontalsaw', 'hs_bdiagonal', 'hs_cross', 
  'hs_diagcross', 'hs_fdiagonal', 'hs_horizontal', 'hs_vertical', 'left30', 
  'left45', 'right30', 'right45', 'leftshingle', 'rightshingle', 'vertical', 
  'vertical2', 'vertical3', 'verticalbricks', 'verticalleftshingle', 
  'verticalrightshingle', 'verticalsaw' ];


//---------------------------------------------------------
// Initialize an item displayed inside a selectize.
//---------------------------------------------------------
function ai_pattern_picker (lvlC, value, item, nOpts) {
  
  let pattern = ai_patterns[parseInt(value) % ai_patterns.length]
  let source  = 'aesinput/pattern/' + pattern + '.png';
  document.getElementById(lvlC + "-" + value + "-opt").src = source;
  document.getElementById(lvlC + "-" + value + "-opt").dataset.val = pattern;
  
  $("#" + lvlC + "-" + value + "-pop").popover({
    html:     true,
    sanitize: false,
    content:  function () {
      return ai_patterns.map(x => {
        const src     = `aesinput/pattern/${x}.png`;
        const onclick = `ai_select('${lvlC}-${value}', 'pattern', '${x}')`;
        return `<img src="${src}" onclick="${onclick}">`
      });
    }
    
  });
}




//---------------------------------------------------------
// Update the selectize item and close the popover.
//---------------------------------------------------------
function ai_select(el, picker, opt) {
  
  document.getElementById(el + '-opt').dataset.val = opt;
  
  if (picker == "color") {
    document.getElementById(el + '-opt').style['background-color'] = opt;
    
  } else {
    const src = 'aesinput/' + picker + '/' + opt + '.png';
    document.getElementById(el + '-opt').src = src;
  }
  
  // Close the popover by simulating a click.
  $('#' + el + '-pop').click();
  $('#' + el + '-pop').focus();
  
}

