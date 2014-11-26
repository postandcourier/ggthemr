(function () {

  var svg = d3.select('#logo svg');

  function getSvgDimensions (svg) {
    return [
      svg[0][0].clientWidth,
      svg[0][0].clientHeight
    ];
  }

  function createScales (dimensions) {
    
    return {
      x: d3.scale
        .linear()
        .domain([0, 1])
        .range([0, dimensions[0]]),
      y: d3.scale
        .linear()
        .domain([0, 1])
        .range([dimensions[1], 0])
    }; 
  }

  function randomCorner () {
    var corners = [[0, 0], [1, 0], [0, 1], [1, 1]];
    return randomElement(corners);
  }

  var getBackgroundClass = (function () {
    var first = true;
    return function () {
      first = !first;
      return ['bg-1', 'bg-2'][first + 0];
    };
  })();

  function updateChart (svg, data, easing, duration, changePalette, close) {
    
    var palette = randomPalette(!changePalette);
    
    if (changePalette) {
      
      var corner = randomCorner();
      var backgroundClass = getBackgroundClass();
      console.log(backgroundClass);
      
      svg
        .selectAll('.' + backgroundClass)
        .attr({
          'fill': palette.background,
          'x': scales.x(corner[0]),
          'y': scales.y(corner[1]),
          'r': 0
        })
        .transition()
        .duration(200)
        .ease('linear')
        .attr('r', 500);  
      
    }
      
    svg
      .selectAll('.bar')
      .data(data)
      .attr('fill', function (datum, i) {
        return palette.swatch[i];
       })
      .transition()
      .duration(duration)
      .delay(function (datum, i) {
        if (i === 1) {
          return 0;
        } else {
          return Math.random() * 300;
        }
      })
      .ease(easing)
      .attr({
        'x': function (datum) {
          return scales.x(datum[0]);
        },
        'y': function (datum) {
          return scales.y(datum[1]);
        }
      });
    
  }

  function randomElement (items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffleArray (o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  var randomPalette = (function () {

    var lightBackground = true;
    var backgroundElements = ['dark', 'light'];
    
    var palettes = [
      {
        background: {light: '#F5F5F5', dark: '#151515'}, 
        swatch:['#AC4142', '#D28445', '#F4BF75']
      },
      {
        background: {light: '#EFF1F5', dark: '#2B303B'}, 
        swatch: ['#D08770', '#A3BE8C', '#8FA1B3']
      },
      {
        background: {light: '#F2F0EC', dark: '#2D2D2D'}, 
        swatch: ['#6699CC', '#CC99CC', '#66CCCC']
      }
    ];
    
    var cache;
    
    return function (cached) {
      
      if (!cached) {
        var paletteIndex = Math.floor(Math.random() * palettes.length);
        var palette = palettes[paletteIndex].swatch;    
        var backgroundElement = backgroundElements[lightBackground + 0];
        var background = palettes[paletteIndex].background[backgroundElement];
        lightBackground = !lightBackground;
        cache = {swatch: shuffleArray(palette), background: background};
      }
      
      return cache;
      
    };
    
  })();


  var updateDelay = 2500;
  var dimensions = getSvgDimensions(svg);
  var scales = createScales(dimensions);
  var yValues = [0.618, 1, 0.382];
  var points = yValues.length;
  var barWidth = 1 / points;

  var liveData = [];
  var deadData = [];
  for (var i = 0; i < points; i++) {
    var xValue = i / points;
    liveData.push([xValue, yValues[i]]);
    deadData.push([xValue, 0]);
  }


  var palette = randomPalette();

  svg
    .selectAll('.bar')
    .data(liveData)
    .enter()
    .append('rect')
    .attr({
      'x': function (datum) {
        return scales.x(datum[0]);
      },
      'y': function (datum) {
        return scales.y(0);
      },
      'width': function (datum) {
        return scales.x(barWidth);
      },
      'height': function (datum) {
        return scales.x(1);
      },
      'class': 'bar',
      'fill': function (datum, i) {
        return palette.swatch[i];
      }
    })
    .transition()
    .duration(800)
    .delay(function (datum, i) {
      if (i === 1) {
        return 0;
      } else {
        return Math.random() * 300;
      }
    })
    .ease('elastic')
    .attr({
      'x': function (datum) {
        console.log(scales.x(datum[0]));
        return scales.x(datum[0]);
      },
      'y': function (datum) {
        return scales.y(datum[1]);
      }
    });


  setInterval(function () {
    updateChart(svg, deadData, 'linear', 200, false, true);
  }, updateDelay);

  setTimeout(function () {
    setInterval(function () {
      updateChart(svg, liveData, 'elastic', 800, true, false);
    }, updateDelay);
  }, updateDelay / 2);

})();