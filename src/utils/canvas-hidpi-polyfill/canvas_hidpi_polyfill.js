// 浅拷贝备份原始api
let HTMLFuncList = [
  'getContext'  
];
let CanvasFuncList = [
  'fillRect',
  'clearRect',
  'strokeRect',
  'moveTo',
  'lineTo',
  'arc',
  'arcTo',
  'bezierCurveTo',
  'isPointinPath',
  'isPointinStroke',
  'quadraticCurveTo',
  'rect',
  'translate',
  'createRadialGradient',
  'createLinearGradient',
  'stroke',
  'fillText',
  'strokeText',
  'drawImage',  // dd 新增drawImage支持
  'getImageData',  // dd 新增getImageData支持
  'ellipse'
];

let HTMLCanvasElementPrototypeBackup = {};
let CanvasRenderingContext2DPrototypeBackup = {};

HTMLFuncList.forEach((func) => {
  HTMLCanvasElementPrototypeBackup[func] = HTMLCanvasElement.prototype[func];
});
CanvasFuncList.forEach((func) => {
  CanvasRenderingContext2DPrototypeBackup[func] = CanvasRenderingContext2D.prototype[func];
});

export function canvasHiDPIPolyfill() {
  (function(prototype) {
    prototype.getContext = (function(_super) {
      return function(type) {
        var backingStore, ratio,
          context = _super.call(this, type);

        if (type === '2d') {

          backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

          ratio = (window.devicePixelRatio || 1) / backingStore;

          if (ratio > 1) {
            this.style.height = this.height + 'px';
            this.style.width = this.width + 'px';
            this.width *= ratio;
            this.height *= ratio;
          }
        }

        return context;
      };
    })(prototype.getContext);
  })(HTMLCanvasElement.prototype);

  (function(prototype) {

    var pixelRatio = (function() {
        var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
      })(),

      forEach = function(obj, func) {
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            func(obj[p], p);
          }
        }
      },

      ratioArgs = {
        'fillRect': 'all',
        'clearRect': 'all',
        'strokeRect': 'all',
        'moveTo': 'all',
        'lineTo': 'all',
        'arc': [0,1,2],
        'arcTo': 'all',
        'bezierCurveTo': 'all',
        'isPointinPath': 'all',
        'isPointinStroke': 'all',
        'quadraticCurveTo': 'all',
        'rect': 'all',
        'translate': 'all',
        'createRadialGradient': 'all',
        'createLinearGradient': 'all',
        'drawImage': [1,2,3,4],  // dd 增加对drawImage的支持
        'getImageData': 'all',  // dd 增加对getImageData的支持
        'ellipse': [0,1,2,3]  // dd 增加对ellipse的支持
      };

    if (pixelRatio === 1) return;

    forEach(ratioArgs, function(value, key) {
      prototype[key] = (function(_super) {
        return function() {
          var i, len,
            args = Array.prototype.slice.call(arguments);

          if (value === 'all') {
            args = args.map(function(a) {
              return a * pixelRatio;
            });
          }
          else if (Array.isArray(value)) {
            for (i = 0, len = value.length; i < len; i++) {
              args[value[i]] *= pixelRatio;
            }
          }

          return _super.apply(this, args);
        };
      })(prototype[key]);
    });

    // Stroke lineWidth adjustment
    prototype.stroke = (function(_super) {
      return function() {
        this.lineWidth *= pixelRatio;
        _super.apply(this, arguments);
        this.lineWidth /= pixelRatio;
      };
    })(prototype.stroke);

    // Text
    //
    prototype.fillText = (function(_super) {
      return function() {
        var args = Array.prototype.slice.call(arguments);

        args[1] *= pixelRatio; // x
        args[2] *= pixelRatio; // y

        this.font = this.font.replace(
          /(\d+)(px|em|rem|pt)/g,
          function(w, m, u) {
            return (m * pixelRatio) + u;
          }
        );

        _super.apply(this, args);

        this.font = this.font.replace(
          /(\d+)(px|em|rem|pt)/g,
          function(w, m, u) {
            return (m / pixelRatio) + u;
          }
        );
      };
    })(prototype.fillText);

    prototype.strokeText = (function(_super) {
      return function() {
        var args = Array.prototype.slice.call(arguments);

        args[1] *= pixelRatio; // x
        args[2] *= pixelRatio; // y

        this.font = this.font.replace(
          /(\d+)(px|em|rem|pt)/g,
          function(w, m, u) {
            return (m * pixelRatio) + u;
          }
        );

        _super.apply(this, args);

        this.font = this.font.replace(
          /(\d+)(px|em|rem|pt)/g,
          function(w, m, u) {
            return (m / pixelRatio) + u;
          }
        );
      };
    })(prototype.strokeText);
  })(CanvasRenderingContext2D.prototype);
}

export function canvasHiDPIRestore() {
  ((prototype) => {
    for(let func in HTMLCanvasElementPrototypeBackup) {
      prototype[func] = HTMLCanvasElementPrototypeBackup[func];
    }
  })(HTMLCanvasElement.prototype);
  ((prototype) => {
    for(let func in CanvasRenderingContext2DPrototypeBackup) {
      prototype[func] = CanvasRenderingContext2DPrototypeBackup[func];
    }
  })(CanvasRenderingContext2D.prototype);
}