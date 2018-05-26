(function () {

    "use strict";

    this.tx_pdfjs = function () {

        this.renderTask = null;
        this.pdfLoaderTask = null;
        this.pdfDoc = null;

        this.pageCount = 0;

        // Set default
        var defaults = {
            'pdf': null,
            'elementId': '',
            'canvasId': '',
            'uid': 0,
            'pageToDisplay': 1,
            'scale': 'page-fit',
            'pageFit': false,
            'linkDisableClass': 'disabled'
        };

        if (arguments[0] && typeof arguments[0] === 'object')
            this.options = extendDefaults(defaults, arguments[0]);

        this.options.pageFit = this.options.scale === 'page-fit';
        this.options.scale = this.options.scale > 0 ? this.options.scale : 1;

        this.element = document.getElementById(this.options.elementId);
        this.canvas = document.getElementById(this.options.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pageNumEl = document.getElementById('pdfjs-page-num-' + this.options.uid);
        this.pageCountEl = document.getElementById('pdfjs-page-count-' + this.options.uid);
        this.jumpEl = document.getElementById('pdfjs-jump-' + this.options.uid);

        PDFJS.disableWorker = false;

        this.pageNumEl.innerHTML = this.options.pageToDisplay;
        if (this.options.pageToDisplay === 1) {
            var previousEl = document.getElementById('pdfjs-previous-' + this.options.uid);
            previousEl.className = previousEl.className + ' ' + this.options.linkDisableClass;
        }

        addNavigationEventListeners.call(this);

        addWindowResizeEventListener.call(this);

        renderPDF.call(this);
    };


    function extendDefaults(source, properties) {
        var property;
        for (property in properties)
            if (properties.hasOwnProperty(property))
                source[property] = properties[property];
        return source;
    }

    function addNavigationEventListeners() {
        var t = this;
        document.getElementById('pdfjs-previous-' + this.options.uid)
            .addEventListener('click', function () {
                t.goPrevious()
            });
        document.getElementById('pdfjs-jump-' + this.options.uid)
            .addEventListener('input', function () {
                t.jump(this)
            });
        document.getElementById('pdfjs-next-' + this.options.uid)
            .addEventListener('click', function () {
                t.goNext()
            });

        document.getElementById('pdfjs-zoom-in-' + this.options.uid)
            .addEventListener('click', function () {
                t.zoomIn()
            });
        document.getElementById('pdfjs-fit-' + this.options.uid)
            .addEventListener('click', function () {
                t.fit()
            });
        document.getElementById('pdfjs-zoom-out-' + this.options.uid)
            .addEventListener('click', function () {
                t.zoomOut()
            });
    }

    function addWindowResizeEventListener() {
        var t = this;
        window.addEventListener('resize', function () {
            if (t.options.pageFit === true)
                renderPage.call(t, t.options.pageToDisplay);

            if (t.canvas.hasAttribute('data-computed-ratio'))
                t.element.style.height = (t.element.offsetWidth / t.canvas.getAttribute('data-computed-ratio')) + 'px';
        });
    }

    function backingScale(canvas) {
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    }

    function setCanvasDimensions(canvas, w, h) {
        var ratio = backingScale(canvas);
        canvas.width = Math.floor(w * ratio);
        canvas.height = Math.floor(h * ratio);
        canvas.style.width = Math.floor(w) + 'px';
        canvas.style.height = Math.floor(h) + 'px';
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return canvas;
    }

    function renderPage(num) {
        var t = this;

        if (t.renderTask)
            t.renderTask._internalRenderTask.cancel();

        this.pdfDoc.getPage(num).then(function (page) {
            var viewport;
            var pageWidthScale;
            var renderContext;

            if (t.options.pageFit) {
                viewport = page.getViewport(1);
                var clientRect = t.element.getBoundingClientRect();
                pageWidthScale = clientRect.width / viewport.width;
                t.options.scale = pageWidthScale;
            }
            viewport = page.getViewport(t.options.scale);

            if (!t.canvas.hasAttribute('data-compute-ratio')) {
                t.element.style.height = viewport.height + 'px';
            } else if (t.canvas.getAttribute('data-compute-ratio') === '1') {
                var ratio = viewport.width / viewport.height;
                t.canvas.setAttribute('data-computed-ratio', ratio.toString());
                t.element.style.height = viewport.height + 'px';
                t.canvas.setAttribute('data-compute-ratio', '0');
            }

            setCanvasDimensions(t.canvas, viewport.width, viewport.height);

            renderContext = {
                canvasContext: t.ctx,
                viewport: viewport
            };

            t.renderTask = page.render(renderContext);
            t.renderTask.promise.then(function () {
            }).catch(function (reason) {
                console.log(reason);
            });
        });
    }

    function clearCanvas() {
        if (this.ctx)
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    function renderPDF() {
        clearCanvas.call(this);

        if (this.options.pdf && this.options.pdf.length) {
            var t = this;
            this.pdfLoaderTask = PDFJS.getDocument(this.options.pdf);
            this.pdfLoaderTask.then(
                function (_pdfDoc) {
                    t.pdfDoc = _pdfDoc;
                    renderPage.call(t, t.options.pageToDisplay);
                    t.pageCount = _pdfDoc.numPages;
                    t.pageCountEl.innerHTML = t.pageCount;

                    document.getElementById('pdfjs-jump-' + t.options.uid).max = t.pageCount;
                }, function (error) {
                    console.error(error);
                }
            );
        }
    }

    tx_pdfjs.prototype.jump = function (inputEl) {
        var target = inputEl.value;

        if (!target) {
            return;
        }

        if (target > this.pdfDoc.numPages) {
            target = this.pdfDoc.numPages;
            inputEl.value = target;
        } else if (target < 1) {
            target = 1;
            inputEl.value = target;
        }

        this.options.pageToDisplay = parseInt(target);
        this.pageNumEl.innerHTML = this.options.pageToDisplay;

        var nextEl = document.getElementById('pdfjs-next-' + this.options.uid);
        var cssClassesNext = nextEl.className;
        if (this.options.pageToDisplay === this.pdfDoc.numPages && cssClassesNext.indexOf(this.options.linkDisableClass) === -1) {
            nextEl.className = cssClassesNext + ' ' + this.options.linkDisableClass;
        } else {
            nextEl.className = cssClassesNext.replace(this.options.linkDisableClass, '');
        }

        var previousEl = document.getElementById('pdfjs-previous-' + this.options.uid);
        var cssClassesPrevious = previousEl.className;
        if (this.options.pageToDisplay === 1 && cssClassesPrevious.indexOf(this.options.linkDisableClass) === -1) {
            previousEl.className = cssClassesPrevious + ' ' + this.options.linkDisableClass;
        } else {
            previousEl.className = cssClassesPrevious.replace(this.options.linkDisableClass, '');
        }

        renderPage.call(this, this.options.pageToDisplay);
    };

    tx_pdfjs.prototype.goPrevious = function () {
        if (this.options.pageToDisplay <= 1)
            return;

        if (this.options.pageToDisplay === this.pdfDoc.numPages) {
            var nextEl = document.getElementById('pdfjs-next-' + this.options.uid);
            var cssClasses = nextEl.className;
            nextEl.className = cssClasses.replace(this.options.linkDisableClass, '');
        }

        this.options.pageToDisplay = parseInt(this.options.pageToDisplay) - 1;
        this.pageNumEl.innerHTML = this.options.pageToDisplay;
        this.jumpEl.value = this.options.pageToDisplay;

        if (this.options.pageToDisplay === 1) {
            var previousEl = document.getElementById('pdfjs-previous-' + this.options.uid);
            previousEl.className = previousEl.className + ' ' + this.options.linkDisableClass;
        }

        renderPage.call(this, this.options.pageToDisplay);
    };

    tx_pdfjs.prototype.goNext = function () {
        if (this.options.pageToDisplay >= this.pdfDoc.numPages)
            return;

        if (this.options.pageToDisplay === 1) {
            var previousEl = document.getElementById('pdfjs-previous-' + this.options.uid);
            var cssClasses = previousEl.className;
            previousEl.className = cssClasses.replace(this.options.linkDisableClass, '');
        }

        this.options.pageToDisplay = parseInt(this.options.pageToDisplay) + 1;
        this.pageNumEl.innerHTML = this.options.pageToDisplay;
        this.jumpEl.value = this.options.pageToDisplay;

        if (this.options.pageToDisplay === this.pdfDoc.numPages) {
            var nextEl = document.getElementById('pdfjs-next-' + this.options.uid);
            nextEl.className = nextEl.className + ' ' + this.options.linkDisableClass;
        }

        renderPage.call(this, this.options.pageToDisplay);
    };

    tx_pdfjs.prototype.zoomIn = function () {
        this.options.pageFit = false;
        this.options.scale = parseFloat(this.options.scale) + 0.2;
        renderPage.call(this, this.options.pageToDisplay);
        return this.options.scale;
    };

    tx_pdfjs.prototype.zoomOut = function () {
        this.options.pageFit = false;
        this.options.scale = parseFloat(this.options.scale) - 0.2;
        renderPage.call(this, this.options.pageToDisplay);
        return this.options.scale;
    };
    tx_pdfjs.prototype.fit = function () {
        this.options.pageFit = true;
        renderPage.call(this, this.options.pageToDisplay);
        return this.options.scale;
    };
}.call((typeof window === 'undefined') ? this : window));