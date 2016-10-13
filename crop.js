/**
 * Created by ally on 9/23/16.
 */

window.img_server = 'http://192.168.1.250:5000';

function ImageEditor() {

    ImageEditor.prototype.CANCEL_BUTTON_ID = "cancel-button";
    ImageEditor.prototype.BACKWARD_BUTTON_ID = "backward-button";

    ImageEditor.prototype.DRAW_RECTANGLE_REGION_BUTTON_ID = "rectangle-button";
    ImageEditor.prototype.REVERT_RECTANGLE_REGION_BUTTON_ID = "revert-rectangle-button";

    ImageEditor.prototype.DRAW_FOREGROUND_LINE_BUTTON_ID = "forground-line-button";
    ImageEditor.prototype.REVERT_ONE_FORGROUND_LINE_BUTTON_ID = "revert-one-forground-line-button";
    ImageEditor.prototype.REVERT_ALL_FORGROUND_LINES_BUTTON_ID = "revert-all-forground-lines-button";

    ImageEditor.prototype.DRAW_BACKGROUND_LINE_BUTTON_ID = "background-line-button";
    ImageEditor.prototype.REVERT_ONE_BACKGROUND_LINE_BUTTON_ID = "revert-one-background-line-button";
    ImageEditor.prototype.REVERT_ALL_BACKGROUND_LINES_BUTTON_ID = "revert-all-background-lines-button";

    ImageEditor.prototype.ITERATOR_TIMES_INPUT_ID = "iterate-times-input";
    ImageEditor.prototype.DO_AS_I_INSTRUCTED_BUTTON_ID = "process-button";
    ImageEditor.prototype.SUBMIT_PICTURE_BUTTON_ID = "submit-picture-button";

    ImageEditor.prototype.DRAW_RECTANGLE = 0;
    ImageEditor.prototype.DRAW_FOREGROUND_LINE = 1;
    ImageEditor.prototype.DRAW_BACKGROUND_LINE = 2;

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

        this.foregroundLineButton = document.getElementById(this.DRAW_FOREGROUND_LINE_BUTTON_ID);
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
            window.location.reload(true);
        })
    };

    this.bindRectangleButtonEventListener = function () {
        this.rectangleButton.addEventListener('click', function (e) {
            $('#' + this.DRAW_RECTANGLE_REGION_BUTTON_ID).addClass('selected-button');

            this.drawType = this.DRAW_RECTANGLE;
        }.bind(this));

        this.revertRectangleButton.addEventListener('click', function (e) {
            this.rectangle = null;

            this.reDraw();
        }.bind(this));
    };

    this.bindForegroundButtonEventListener = function () {
        this.foregroundLineButton.addEventListener('click', function (e) {
            $('#' + this.DRAW_FOREGROUND_LINE_BUTTON_ID).addClass('selected-button');
            $('#' + this.DRAW_BACKGROUND_LINE_BUTTON_ID).removeClass('selected-button');

            this.drawType = this.DRAW_FOREGROUND_LINE;
        }.bind(this))
    };

    this.bindRevertOneForegroundLineButtonEventListener = function () {
        this.revertOneForegroundLineButton.addEventListener('click', function (e) {
            var lines = this.foregroundLineStack[this.foregroundLineStack.length - 1];
            if(lines.length > 0) {
                lines.pop();
            }
            this.reDraw();
        }.bind(this));
    };

    this.bindRevertAllForegroundLinesButtonEventListener = function () {
        this.revertAllForegroundLinesButton.addEventListener('click', function (e) {
            var lines = this.foregroundLineStack[this.foregroundLineStack.length - 1];
            lines.length = 0;
            this.reDraw();
        }.bind(this));
    };

    this.bindRevertOneBackgroundLineButtonEventListener = function () {
        this.revertOneBackgroundLineButton.addEventListener('click', function (e) {
            var lines = this.backgroundLineStack[this.backgroundLineStack.length - 1];
            if(lines.length > 0) {
                lines.pop();
            }
            this.reDraw()
        }.bind(this));
    };

    this.bindRevertAllBackgroundLinesButtonEventListener = function () {
        this.revertAllBackgroundLinesButton.addEventListener('click', function (e) {
            var lines = this.backgroundLineStack[this.backgroundLineStack.length - 1];
            lines.length = 0;
            this.reDraw();
        }.bind(this));
    };

    this.bindBackgroundButtonEventListener = function () {
        this.backgroundLineButton.addEventListener('click', function (e) {
            $('#' + this.DRAW_BACKGROUND_LINE_BUTTON_ID).addClass('selected-button');
            $('#' + this.DRAW_FOREGROUND_LINE_BUTTON_ID).removeClass('selected-button');

            this.drawType = this.DRAW_BACKGROUND_LINE;
        }.bind(this))
    };

    this.getIterCount = function () {
        var iter_count = parseInt(this.iterateTimesInput.value);
        if(isNaN(iter_count) || iter_count < 0) {
            iter_count = 1;
        }
        this.iterateTimesInput.value = iter_count;

        return iter_count;
    };

    this.lines2str = function (lines) {
        return '[' +
            lines.map(function (line) {
                return [line.x1, line.y1, line.x2, line.y2];
            }).map(function (line) {
                return '[' + line.join(', ') + ']';
            }).join(', ') + ']';
    };

    this.getRectanglePosition = function () {
        return [
            this.rectangle.x1 < this.rectangle.x2 ? this.rectangle.x1 : this.rectangle.x2,
            this.rectangle.y1 < this.rectangle.y2 ? this.rectangle.y1 : this.rectangle.y2,
            Math.abs(this.rectangle.x1 - this.rectangle.x2),
            Math.abs(this.rectangle.y1 - this.rectangle.y2)
        ];
    }

    this.bindProcessButtonEventListener = function () {
        this.processButton.addEventListener('click', function (e) {
            if(this.foregroundLineStack.length == 0) { // on selecting rectangle region stage

                if(this.rectangle == null) {
                    alert('You have not select a rectangular region to process!!!');
                    return;
                }
            }
            else { // on drawing foreground and/or background lines
                var foreLines = this.foregroundLineStack[this.foregroundLineStack.length - 1];
                var backLines = this.backgroundLineStack[this.backgroundLineStack.length - 1];

                if(foreLines.length == 0 && backLines.length == 0) {
                    alert('You have not draw any foreground or background line');
                    return;
                }
            }

            var formData = new FormData();
            // formData.append('img_name', this.imageStack[this.imageStack.length - 1].img_name);
            formData.append('img_name', this.imageStack[0].img_name);

            if(this.foregroundLineStack.length == 0) {
                var p = this.getRectanglePosition();
                formData.append('x', p[0]);
                formData.append('y', p[1]);
                formData.append('width', p[2]);
                formData.append('height', p[3]);
            }
            else {
                formData.append('fg', this.lines2str(this.foregroundLineStack[this.foregroundLineStack.length - 1]));
                formData.append('bg', this.lines2str(this.backgroundLineStack[this.backgroundLineStack.length - 1]));
                formData.append('mask', this.maskStack[this.maskStack.length -1]);
            }
            formData.append('iter_count', this.getIterCount());

            request_url = null;
            if(this.foregroundLineStack.length == 0) {
                request_url = '/m/grab_rect';
            }
            else {
                request_url = '/m/grab_mask';
            }

            $.ajax({
                url: window.img_server + request_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                crossDomain: true,
                success: function (data, status, jqxhr) {
                    // alert(data.mask.length);
                    this.imageStack.push({ 'img_name': data.img_name, 'img_src': data.img_src });
                    this.foregroundLineStack.push([]);
                    this.backgroundLineStack.push([]);
                    this.maskStack.push(data.mask);

                    this.refreshUI();
                }.bind(this),
                error: function (jqxhr, status, error) {
                    alert('status: ' + status + '\n' + 'error: ' + error);
                }
            })
        }.bind(this))
    };

    this.bindBackwardButtonEventListener = function () {
        this.backwardButton.addEventListener('click', function (e) {
            this.imageStack.pop();
            this.foregroundLineStack.pop();
            this.backgroundLineStack.pop();
            this.maskStack.pop();

            this.refreshUI();
        }.bind(this))
    };

    this.bindSubmitPictureButtonEventListener = function () {
        this.submitButton.addEventListener('click', function (e) {

            $('#tag-model-container').modal('toggle');

        }.bind(this));
    };

    this.submitTags = function (tags) {

        var formData = new FormData();
        formData.append('img_name', this.imageStack[this.imageStack.length - 1].img_name);

        var p = this.getRectanglePosition();
        formData.append('x', p[0]);
        formData.append('y', p[1]);
        formData.append('width', p[2]);
        formData.append('height', p[3]);
        formData.append('mask', this.maskStack[this.maskStack.length -1]);
        formData.append('tags', tags);

        $.ajax({
            url: window.img_server + '/m/save',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            crossDomain: true,
            success: function (data, status, jqxhr) {
                alert('picture saved');
                window.location.reload(true);
            }.bind(this),
            error: function (jqxhr, status, error) {
                alert('status: ' + status + '\n' + 'error: ' + error);
            }
        })
    }

    // refresh ui & canvas

    this.initDrawing = function () {
        this.drawingFnished = true;

        this.rectangle = null;
        this.foregroundLineStack = [];
        this.backgroundLineStack = [];
        this.imageStack = [];
        this.maskStack = [];

        this.drawType = this.DRAW_RECTANGLE;
    };

    this.reDraw = function () {
        this.clearCanvas();

        if(this.rectangle != null) {
            var r = this.rectangle;
            // alert(r.x1 + '\t' + r.y1 + '\n' + r.x2 + '\t' + r.y2);
            this.ctx.strokeStyle="#FF0000";
            this.ctx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1)
        }
        if(this.foregroundLineStack.length > 0) {
            this.foregroundLineStack[this.foregroundLineStack.length - 1].map(function (line) {
                this.ctx.strokeStyle="#00FF00";
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
                this.ctx.closePath();
                this.ctx.stroke();
            }, this);
        }
        if(this.backgroundLineStack.length > 0) {
            this.backgroundLineStack[this.backgroundLineStack.length - 1].map(function (line) {
                this.ctx.strokeStyle="#0000FF";
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
                this.ctx.closePath();
                this.ctx.stroke();
            }, this);
        }
    };

    this.loadImageToCanvasContainer = function (url) {
        var img = new Image();

        img.onload = function () {
            this.container.style.backgroundImage = "url('" + img.src + "')"
            this.container.style.width = img.width + 'px'
            this.container.style.height = img.height + 'px' // does not work properly without 'px'

            this.canvas.width = img.width;
            this.canvas.height = img.height; // with 'px' does not work

            console.log(img.width);
            console.log(img.height);

            this.reDraw();
        }.bind(this);

        img.src = url
    };

    this.clearSelectedButtonClass = function () {
        $('#' + this.DRAW_RECTANGLE_REGION_BUTTON_ID).removeClass('selected-button');
        $('#' + this.DRAW_FOREGROUND_LINE_BUTTON_ID).removeClass('selected-button');
        $('#' + this.DRAW_BACKGROUND_LINE_BUTTON_ID).removeClass('selected-button');
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

        this.drawType = null;
        this.clearSelectedButtonClass();

        this.loadImageToCanvasContainer(window.img_server + this.imageStack[this.imageStack.length - 1].img_src);
        // this.reDraw();
    };

    this.bindButtonEventListeners = function () {
        this.bindBackwardButtonEventListener();

        this.bindCancelButtonEventListener();
        this.bindRectangleButtonEventListener();

        this.bindForegroundButtonEventListener();
        this.bindRevertOneForegroundLineButtonEventListener();
        this.bindRevertAllForegroundLinesButtonEventListener();

        this.bindBackgroundButtonEventListener();
        this.bindRevertOneBackgroundLineButtonEventListener();
        this.bindRevertAllBackgroundLinesButtonEventListener();

        this.bindProcessButtonEventListener();

        this.bindSubmitPictureButtonEventListener();
    };

    this.createNewShape = function () {

        var shape = null;

        switch (this.drawType) {
            case this.DRAW_RECTANGLE:
                if(this.rectangle === null) {
                    this.rectangle = new Object();
                }
                shape = this.rectangle;
                break;
            case this.DRAW_FOREGROUND_LINE:
                var lines = this.foregroundLineStack[this.foregroundLineStack.length - 1];
                lines.push(new Object());
                shape = lines[lines.length - 1];
                break;
            case this.DRAW_BACKGROUND_LINE:
                var lines = this.backgroundLineStack[this.backgroundLineStack.length - 1];
                lines.push(new Object());
                shape = lines[lines.length - 1];
                break;
        }

        this.lastShape = shape;

        return shape;
    }

    this.bindCanvasEventListeners = function () {

        // this.canvas.oncontextmenu = function (e) {
        //     return false
        // }

        this.canvas.addEventListener('mousedown', function (e) {

            // only allow mouse left click
            if(e.which != 1) {
                return;
            }

            if(this.drawType === null) {
                return;
            }

            // console.log(this.drawingFnished);

            // in case mouse move out of canvas and back to click,
            // we ignore this mouse down event as if user is still drawing
            if(this.drawingFnished == false) {
                return;
            }

            this.drawingFnished = false;

            // var startX = e.pageX - this.canvas.offsetLeft;
            // var startY = e.pageY - this.canvas.offsetTop;

            var startX = e.pageX - $("#image-editor").offset().left;
            var startY = e.pageY - $("#image-editor").offset().top;

            var shape = this.createNewShape();

            if(shape !== null) {
                shape.x1 = startX
                shape.y1 = startY // last shape in not complete
            }
            else {
                // abnormal
            }
        }.bind(this)) // bind this

        this.canvas.addEventListener('mousemove',function(e) {

            // ignore mouse move events when we're not drawing
            if(this.drawingFnished) {
                return;
            }

            if(this.drawType === null) {
                return;
            }

            // var endX = e.pageX - this.canvas.offsetLeft;
            // var endY = e.pageY - this.canvas.offsetTop;
            var endX = e.pageX - $("#image-editor").offset().left;
            var endY = e.pageY - $("#image-editor").offset().top;
            // alert(endX + '\t' + endY);

            var shape = this.lastShape;

            if(shape !== null) {
                shape.x2 = endX
                shape.y2 = endY // last shape in not complete
            }
            else {
                // abnormal
            }

            this.reDraw();

        }.bind(this));

        this.canvas.addEventListener('mouseup', function (e) {

            // ignore mouse up events when we're not drawing
            if(this.drawingFnished) {
                return;
            }

            this.lastShape = null;

            // set drawing finished
            this.drawingFnished = true;
        }.bind(this));
    }
}