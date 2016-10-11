/**
 * Created by ally on 9/23/16.
 */

window.img_server = 'http://192.168.1.250:5000';

function ImageEditor() {

    ImageEditor.prototype.CANCEL_BUTTON_ID = "cancel-button";
    ImageEditor.prototype.BACKWARD_BUTTON_ID = "backward-button";

    ImageEditor.prototype.DRAW_RECTANGLE_REGION_BUTTON_ID = "rectangle-button";
    ImageEditor.prototype.REVERT_RECTANGLE_REGION_BUTTON_ID = "revert-rectangle-button";

    ImageEditor.prototype.DRAW_FORGROUND_LINE_BUTTON_ID = "forground-line-button";
    ImageEditor.prototype.REVERT_ONE_FORGROUND_LINE_BUTTON_ID = "revert-one-forground-line-button";
    ImageEditor.prototype.REVERT_ALL_FORGROUND_LINES_BUTTON_ID = "revert-all-forground-lines-button";

    ImageEditor.prototype.DRAW_BACKGROUND_LINE_BUTTON_ID = "background-line-button";
    ImageEditor.prototype.REVERT_ONE_BACKGROUND_LINE_BUTTON_ID = "revert-one-background-line-button";
    ImageEditor.prototype.REVERT_ALL_BACKGROUND_LINES_BUTTON_ID = "revert-all-background-lines-button";

    ImageEditor.prototype.ITERATOR_TIMES_INPUT_ID = "iterate-times-input";
    ImageEditor.prototype.DO_AS_I_INSTRUCTED_BUTTON_ID = "process-button";
    ImageEditor.prototype.SUBMIT_PICTURE_BUTTON_ID = "submit-picture-button";

    ImageEditor.prototype.DRAW_RECTANGLE = 0;
    ImageEditor.prototype.DRAW_FORGROUND_LINE = 0;
    ImageEditor.prototype.DRAW_BACKGROUND_LINE = 0;

    this.clearCanvas = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    this.init = function (data) {
        // this.data = data;

        this.container = document.getElementById('canvas-container');
        this.canvas = document.getElementById('image-editor');
        this.ctx = this.canvas.getContext('2d');

        this.cancelButton = document.getElementById(this.CANCEL_BUTTON_ID);
        this.backwardButton = document.getElementById(this.BACKWARD_BUTTON_ID);

        this.rectangleButton = document.getElementById(this.DRAW_RECTANGLE_REGION_BUTTON_ID);
        this.revertRectangleButton = document.getElementById(this.REVERT_RECTANGLE_REGION_BUTTON_ID);

        this.foregroundLineButton = document.getElementById(this.DRAW_FORGROUND_LINE_BUTTON_ID);
        this.revertOneForegroundLineButton = document.getElementById(this.REVERT_ONE_FORGROUND_LINE_BUTTON_ID);
        this.revertAllForegroundLinesButton = document.getElementById(this.REVERT_ALL_FORGROUND_LINES_BUTTON_ID);

        this.backgroundLineButton = document.getElementById(this.DRAW_BACKGROUND_LINE_BUTTON_ID);
        this.revertOneBackgroundLineButton = document.getElementById(this.REVERT_ONE_BACKGROUND_LINE_BUTTON_ID);
        this.revertAllBackgroundLinesButton = document.getElementById(this.REVERT_ALL_BACKGROUND_LINES_BUTTON_ID);

        this.iterateTimesInput = document.getElementById(this.ITERATOR_TIMES_INPUT_ID);
        this.processButton = document.getElementById(this.DO_AS_I_INSTRUCTED_BUTTON_ID);
        this.submitButton = document.getElementById(this.SUBMIT_PICTURE_BUTTON_ID);

        // disable buttons should not be clicked on startup
        this.disableBackwardButton();
        this.disableForegroundLineButtons();
        this.disableBackgroundLineButtons();
        this.disableSubmitButton();

        this.initDrawing();

        // this.loadImageToCanvasContainer(window.img_server + this.data.img_src);
        // this.loadImageToCanvasContainer('shape-1.jpeg')
        this.bindCanvasEventListeners();
        this.bindButtonEventListeners();

        this.imageStack.push({ 'img_name': data.img_name, 'img_src': data.img_src });
        this.refreshUI();
    };

    // control ui usability

    this.disableBackwardButton = function () {
        this.backwardButton.disabled = true;
    };

    this.enableBackwardButton = function () {
        this.backwardButton.disabled = false;
    };

    this.disableRectangleButtons = function () {
        this.rectangleButton.disabled = true;
        this.revertRectangleButton.disabled = true;

        $('#' + this.DRAW_RECTANGLE_REGION_BUTTON_ID).removeClass('selected-button');
    };

    this.enableRectangleButtons = function () {
        this.rectangleButton.disabled = false;
        this.revertRectangleButton.disabled = false;
    };

    this.disableForegroundLineButtons = function () {
        this.foregroundLineButton.disabled = true;
        this.revertOneForegroundLineButton.disabled = true;
        this.revertAllForegroundLinesButton.disabled = true;
    };

    this.enableForegroundLineButtons = function () {
        this.foregroundLineButton.disabled = false;
        this.revertOneForegroundLineButton.disabled = false;
        this.revertAllForegroundLinesButton.disabled = false;
    };

    this.disableBackgroundLineButtons = function () {
        this.backgroundLineButton.disabled = true;
        this.revertOneBackgroundLineButton.disabled = true;
        this.revertAllBackgroundLinesButton.disabled = true;
    };

    this.enableBackgroundLineButtons = function () {
        this.backgroundLineButton.disabled = false;
        this.revertOneBackgroundLineButton.disabled = false;
        this.revertAllBackgroundLinesButton.disabled = false;
    };

    this.disableSubmitButton = function () {
        this.submitButton.disabled = true;
    };

    this.enableSubmitButton = function () {
        this.submitButton.disabled = false;
    };

    // bind event listeners

    this.bindCancelButtonEventListener = function () {
        this.cancelButton.addEventListener('click', function (e) {
            location.reload(true);
        })
    };

    this.bindRectangleButtonEventListener = function () {
        this.rectangleButton.addEventListener('click', function (e) {
            $('#' + this.DRAW_RECTANGLE_REGION_BUTTON_ID).addClass('selected-button');
        }.bind(this));

        this.revertRectangleButton.addEventListener('click', function (e) {
            this.rectangle = null;

            this.reDraw();
        }.bind(this));
    };

    this.bindProcessButtonEventListener = function () {
        this.processButton.addEventListener('click', function (e) {
            if(this.forgroundLineStack.length == 0) { // on selecting rectangle region stage

                if(this.rectangle == null) {
                    alert('You have not select a rectangular region to process!!!');
                    return;
                }

                var iter_count = parseInt(this.iterateTimesInput.value);
                if(isNaN(iter_count) || iter_count < 0) {
                    iter_count = 1;
                }
                this.iterateTimesInput.value = iter_count;

                formData = new FormData();
                formData.append('img_name', this.imageStack[this.imageStack.length - 1].img_name);
                formData.append('x', this.rectangle.x1 < this.rectangle.x2 ? this.rectangle.x1 : this.rectangle.x2);
                formData.append('y', this.rectangle.y1 < this.rectangle.y2 ? this.rectangle.y1 : this.rectangle.y2);
                formData.append('width', Math.abs(this.rectangle.x1 - this.rectangle.x2));
                formData.append('height', Math.abs(this.rectangle.y1 - this.rectangle.y2));
                formData.append('iter_count', iter_count);

                $.ajax({
                    url: window.img_server + '/m/grab_rect',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    crossDomain: true,
                    success: function (data, status, jqxhr) {
                        // alert(data.mask.length);
                        this.imageStack.push({ 'img_name': data.img_name, 'img_src': data.img_src });
                        this.refreshUI();
                    }.bind(this),
                    error: function (jqxhr, status, error) {
                       alert('status: ' + status + '\n' + 'error: ' + error);
                    }
                })
            }
            else { // on drawing foreground and/or background lines
                alert('not implemented'); //TODO:
            }
        }.bind(this))
    };

    this.bindBackwardButtonEventListener = function () {
        this.backwardButton.addEventListener('click', function (e) {

        })
    };

    // refresh ui & canvas

    this.initDrawing = function () {
        this.DrawingFnished = true;

        this.rectangle = null;
        this.forgroundLineStack = [];
        this.backgroundLineStack = [];
        this.imageStack = [];

        this.drawType = this.DRAW_RECTANGLE;
    };

    this.reDraw = function () {
        this.clearCanvas();

        if(this.rectangle != null) {
            var r = this.rectangle;
            // alert(r.x1 + '\t' + r.y1 + '\n' + r.x2 + '\t' + r.y2);
            this.ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1)
        }
        if(this.forgroundLineStack.length > 0) {
            this.forgroundLineStack[this.forgroundLineStack.length - 1].map(function (line) {
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
                this.ctx.closePath();
                this.ctx.stroke();
            }, this);
        }
        if(this.backgroundLineStack.length > 0) {
            this.backgroundLineStack[this.backgroundLineStack.length - 1].map(function (line) {
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
                this.ctx.closePath();
                this.ctx.stroke();
            }, this);
        }
    };

    this.loadImageToCanvasContainer = function (url) {
        var img = new Image()

        img.onload = function () {
            this.container.style.backgroundImage = "url('" + img.src + "')"
            this.container.style.width = img.width + 'px'
            this.container.style.height = img.height + 'px' // does not work properly without 'px'

            this.canvas.width = img.width;
            this.canvas.height = img.height; // with 'px' does not work

        }.bind(this);

        img.src = url
    }

    this.refreshUI = function () {
        if(this.imageStack.length == 0) {
            // TODO: not uploaded, abnormal
        }
        else if(this.imageStack.length == 1) {
            // TODO: just uploaded
            this.disableBackwardButton();
            this.enableRectangleButtons();
            this.disableForegroundLineButtons();
            this.disableBackgroundLineButtons();
            this.disableSubmitButton();
        }
        else if(this.imageStack.length == 2) {
            // TODO: just processed rectangular region, and after wards
            this.enableBackwardButton();
            this.disableRectangleButtons();
            this.enableForegroundLineButtons();
            this.enableBackgroundLineButtons();
            this.enableSubmitButton();
        }

        this.loadImageToCanvasContainer(window.img_server + this.imageStack[this.imageStack.length - 1].img_src);
        this.reDraw();
    };

    this.bindButtonEventListeners = function () {
        this.bindCancelButtonEventListener();
        this.bindRectangleButtonEventListener();

        this.bindProcessButtonEventListener();
        //
        // this.rectangleButton.addEventListener('click', function (e) {
        //     this.lineButton.style.backgroundColor = ''
        //     this.rectangleButton.style.backgroundColor = 'gray'
        //
        //     this.selectedDrawType = 0
        //     this.DrawingFnished = true
        // }.bind(this))
        //
        // this.lineButton.addEventListener('click', function (e) {
        //     this.rectangleButton.style.backgroundColor = ''
        //     this.lineButton.style.backgroundColor = 'gray'
        //
        //     this.selectedDrawType = 1
        //     this.DrawingFnished = true
        // }.bind(this))
        //
        // this.revertOneButton.addEventListener('click', function (e) {
        //     if(this.lines.length > 0) {
        //         this.lines.pop()
        //         this.reDraw()
        //
        //         this.DrawingFnished = true
        //     }
        // }.bind(this))
        //
        // this.revertAllButton.addEventListener('click', function (e) {
        //     if(this.lines.length > 0) {
        //         this.lines = []
        //         this.reDraw()
        //
        //         this.DrawingFnished = true
        //     }
        // }.bind(this))
        //
        // this.submitButton.addEventListener('click', function (e) {
        //     this.rectangleButton.disabled = true
        // }.bind(this))
    };

    // this.getSelectedDrawType = function () {
    //     if('selectedDrawType' in this) {
    //         return this.selectedDrawType
    //     }
    //     else {
    //         return null
    //     }
    // };

    this.bindCanvasEventListeners = function () {

        // this.canvas.oncontextmenu = function (e) {
        //     return false
        // }

        this.canvas.addEventListener('mousedown', function (e) {

            // only allow mouse left click
            if(e.which != 1) {
                return;
            }

            // console.log(this.DrawingFnished);

            // in case mouse move out of canvas and back to click,
            // we ignore this mouse down event as if user is still drawing
            if(this.DrawingFnished == false) {
                return;
            }

            this.DrawingFnished = false;

            // var startX = e.pageX - this.canvas.offsetLeft;
            // var startY = e.pageY - this.canvas.offsetTop;

            var startX = e.pageX - $("#image-editor").offset().left;
            var startY = e.pageY - $("#image-editor").offset().top;


            var shape = new Object()
            shape.type = this.drawType
            shape.x1 = startX
            shape.y1 = startY // last shape in not complete

            this.rectangle = shape;

            return;
            //
            // if(this.drawType == 0) {
            // }
            // else {
            //     this.lines.push(shape)
            // }
        }.bind(this)) // bind this

        this.canvas.addEventListener('mousemove',function(e) {

            // ignore mouse move events when we're not drawing
            if(this.DrawingFnished) {
                return
            }

            // var endX = e.pageX - this.canvas.offsetLeft;
            // var endY = e.pageY - this.canvas.offsetTop;
            var endX = e.pageX - $("#image-editor").offset().left;
            var endY = e.pageY - $("#image-editor").offset().top;
            // alert(endX + '\t' + endY);

            // if(this.drawType == 0) {
                this.rectangle.x2 = endX;
                this.rectangle.y2 = endY;
            // }
            // else {
            //     var shape = this.lines.pop()
            //     shape.x2 = endX
            //     shape.y2 = endY
            //     // alert("mousemove: \n" + shape.type + '\n' + shape.x1 + '\n' + shape.y1 + '\n' + shape.x2 + '\n' + shape.y2)
            //     this.lines.push(shape) // modified shape
            // }

            this.reDraw();

        }.bind(this));

        this.canvas.addEventListener('mouseup', function (e) {

            // ignore mouse up events when we're not drawing
            if(this.DrawingFnished) {
                return;
            }

            // set drawing finished
            this.DrawingFnished = true;
        }.bind(this));
    }
}