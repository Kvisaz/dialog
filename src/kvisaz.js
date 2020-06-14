const libraryName = 'Kvisaz';

// мгновенно исполняемая функция, которая наполняет передаваемый ей объект
(function (moduleName) {
    const module = {};
    window[moduleName] = module;

    module.moduleName = moduleName;
    module.window = openWindow;
    module.dialog = openWindow;
    module.getWrapperSelector = () => '.' + CSS.wrapperClass;
    module.close = close;

    module.optionHash = {}; // hash опций
    module.counter = 0; // id для hash опций

    /**************
     *  CSS
     **************/
    const CSS = {
        wrapperClass: 'kvisaz-createWindow-wrapper',
        shadowClass: 'kvisaz-shadow',
        winId: 'kvisaz-createWindow',
        warningClass: 'kvisaz-createWindow-warning',
        winClass: 'kvisaz-createWindow',
        winClassShow: 'kvisaz-createWindow-show',
        winContentClass: 'kvisaz-createWindow-content',
        titleClass: 'kvisaz-createWindow-title',
        textClass: 'kvisaz-createWindow-text',
        buttonClass: 'kvisaz-createWindow-button',
        buttonWrapClass: 'kvisaz-button-wrap',
        styleId: 'kvisaz-createWindow-style'

    }
    //language=CSS
    const CSSinnerHTML = `
        .${CSS.wrapperClass} {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .${CSS.shadowClass} {
            background: rgba(0,0,0,0.75);
        }
        
        .${CSS.winId} {
            user-select: none;
            font-family: Roboto, Verdana, Arial, sans-serif;
        }        
        .${CSS.winClass} {
            opacity: 1;
            transition: all 0.2s ease-in;
            width: 35%;
            background: beige;
            margin-top: 100%;
        }        
        
        .${CSS.winClassShow} {  
          margin: 0;    
        }
        
        .${CSS.winContentClass} {}
        
        .${CSS.titleClass} {
            background: bisque;
            text-align: center;
            padding: 1em;
        }
        .${CSS.textClass} {
            text-align: center;
            padding: 1em;
        }
        
        .${CSS.buttonWrapClass} {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-bottom: 1em;
        }
        .${CSS.buttonClass} {
            display: flex;
            justify-items: center;
            align-content: center;
            align-items: center;
            justify-content: center;
            background: #dedede;
            cursor: pointer;
            padding: 1em;
            margin: 1em;
            width: 6em;
            text-align: center;
            height: 2em;
            border: 2px outset #c4c0c0;
            transform: scale(1);
        }
        
        .${CSS.buttonClass}:active {
            transform: translateY(0.15em);
            border: 2px solid #c4c0c0;
        }
    `;

    injectStyle(CSSinnerHTML);

    /******
     *  Главная функция модуля
     * @param options
     */
    function openWindow(options) {
        // уникальные опции для каждого вызова
        module.counter++;
        module.optionHash[module.counter] = options;

        const wrapper = createWrapper(options);
        setOptionsId(wrapper, module.counter);
        wrapper.classList.add(CSS.shadowClass);

        const win = createDialogWindow(options);

        wrapper.appendChild(win);

        wrapper.addEventListener('click', onWrapperClick);
        document.body.appendChild(wrapper);

        return wrapper;
    }

    /**
     *  Закрыть окно
     *      - если оно последнее - закрыть и тень
     * @param wrapperHtmlElement - окно
     */
    function close(wrapperHtmlElement) {
        const W = wrapperHtmlElement;
        const optionsId = getOptionsId(W);
        module.optionHash[optionsId] = null;
        delete module.optionHash[optionsId];
        W.removeEventListener('click', onWrapperClick);
        removeEl(W);
    }


    /**************************************
     *  utils
     *************************************/
    function div(className) {
        const el = document.createElement('div');
        if (className) el.className = className;
        return el;
    }

    function divCode(content, className) {
        return `<div class="${className}">${content}</div>`
    }

    function injectStyle(styleText) {
        const el = document.createElement('style');
        el.innerHTML = styleText;
        el.id = CSS.styleId;
        document.head.appendChild(el);
    }

    function delay(fn) {
        setTimeout(fn, 0)
    }

    function removeEl(el) {
        if (el.parentNode != null) el.parentNode.removeChild(el);
    }


    /**************************************
     *  wrapper is shadow (rgba) and click interceptor
     *************************************/
    function createWrapper(options) {
        return div(CSS.wrapperClass);
    }

    function onWrapperClick(e) {
        e.stopImmediatePropagation();
        const options = getOptions(e.currentTarget);

        if(options.onClick){
            options.onClick(e);
            return;
        }

        if (e.target.classList.contains(CSS.buttonClass)) {
            onButtonClick(e.target);
            return;
        }
    }

    function getWrapper(child) {
        return child.closest(`.${CSS.wrapperClass}`);
    }

    function getOptionsId(child) {
        const wrapper = getWrapper(child);
        return wrapper.dataset.optionsId;
    }

    function getOptions(child) {
        const id = getOptionsId(child);
        return module.optionHash[id];
    }

    function setOptionsId(wrapper, optionsId) {
        wrapper.dataset.optionsId = optionsId;
    }

    function removeWrapperForButton(buttonEl) {
        const wrapper = getWrapper(buttonEl);
        if (wrapper == null) {
            console.warn('no wrapper window');
            return;
        }

        close(wrapper);
    }

    /**************************************
     *  window
     *************************************/

    function createDialogWindow(options) {
        if (options.html == null) {
            const titleCode = getTitleHtml(options);
            const textCode = getTextHtml(options);
            const buttonsCode = getButtonsHTML(options);
            options.html = titleCode + textCode + buttonsCode;
        }

        return createWindow(options);

    }

    function createWindow(options) {
        const winEl = createWindowEl();
        if (options.addClass != null) {
            winEl.classList.add(options.addClass)
        }

        winEl.innerHTML = `<div class="${CSS.winContentClass}">${options.html}</div>`;

        delay(() => winEl.classList.add(CSS.winClassShow));

        return winEl;
    }

    function onButtonClick(buttonEl) {
        console.log('onButtonClick', buttonEl);
        try {
            const btIndex = buttonEl.dataset.index;
            const warning = buttonEl.dataset.warning;
            const options = getOptions(buttonEl);
            const callback = options.buttons[btIndex].callback;

            if (warning != null) onWarningClick(buttonEl, warning, () => {
                onSimpleClick(buttonEl, callback)
            })
            else onSimpleClick(buttonEl, callback);

        } catch (e) {
            console.warn(e)
        }
    }

    function onSimpleClick(buttonEl, callback) {
        setTimeout(() => {
            removeWrapperForButton(buttonEl);
        }, 0);

        setTimeout(() => {
            if (callback) callback();
        }, 0);
    }

    function onWarningClick(buttonEl, warning, callback) {
        openWindow({
            addClass: CSS.warningClass,
            text: warning,
            buttons: [
                {
                    text: 'OK',
                    callback: callback
                },
                {
                    text: 'Cancel',
                    callback: () => {
                    }
                }
            ]
        })
    }

    /**************************************
     *  window events
     *************************************/

    /**************************************
     *  window utils
     *************************************/

    function createWindowEl() {
        const winEl = div(CSS.winClass);
        winEl.id = CSS.winId;
        return winEl;
    }

    function divCodeOptions(options, name, className) {
        if (options[name] == null) return '';
        return divCode(options[name], className);
    }

    function getTitleHtml(options) {
        return divCodeOptions(options, 'title', CSS.titleClass);
    }

    function getTextHtml(options) {
        return divCodeOptions(options, 'text', CSS.textClass);
    }

    function getButtonHtml(btOptions, index) {
        const warningAttr = btOptions.warning != null
            ? `data-warning="${btOptions.warning}"`
            : '';

        return `<button class="${CSS.buttonClass}" ${warningAttr} data-index="${index}">${btOptions.text}</button>`;
    }

    function getButtonsHTML(options) {
        if (options.buttons == null || options.buttons.length == 0) {
            console.warn('NO buttons in createWindow');
            return;
        }

        const buttonsCode = options.buttons
            .map(getButtonHtml)
            .join('\n');

        const buttonWrapper = divCode(buttonsCode, CSS.buttonWrapClass);

        return buttonWrapper;
    }

})(libraryName)
