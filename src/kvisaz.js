const libraryName = 'Kvisaz';

// мгновенно исполняемая функция, которая наполняет передаваемый ей объект
(function (moduleName) {
    const module = {};
    window[moduleName] = module;

    module.moduleName = moduleName;
    module.dialog = dialog;

    /**************
     *  CSS
     **************/
    const CSS = {
        wrapperClass: 'kvisaz-dialog-wrapper',
        shadowClass: 'kvisaz-shadow',
        winId: 'kvisaz-dialog',
        warningClass: 'kvisaz-dialog-warning',
        winClass: 'kvisaz-dialog',
        winClassShow: 'kvisaz-dialog-show',
        winContentClass: 'kvisaz-dialog-content',
        titleClass: 'kvisaz-dialog-title',
        textClass: 'kvisaz-dialog-text',
        buttonClass: 'kvisaz-dialog-button',
        buttonWrapClass: 'kvisaz-button-wrap',
        styleId: 'kvisaz-dialog-style'

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
    function dialog(options) {
        const wrapper = createWrapper(options);
        wrapper.classList.add(CSS.shadowClass);
        // const shadow = createShadow(options);
        const win = createWindow(options);
        //  wrapper.appendChild(shadow);
        wrapper.appendChild(win);

        wrapper.addEventListener('click', onWrapperClick);
        document.body.appendChild(wrapper);
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


    /**************************************
     *  wrapper is shadow (rgba) and click interceptor
     *************************************/
    function createWrapper(options) {
        return div(CSS.wrapperClass);
    }

    function onWrapperClick(e) {
        e.stopImmediatePropagation();
        if (e.target.classList.contains(CSS.buttonClass)) {
            onButtonClick(e.target);
            return;
        }
    }

    function removeWrapper(buttonEl) {
        const el = buttonEl.closest(`.${CSS.wrapperClass}`);
        if (el == null) {
            console.warn('no wrapper window');
            return;
        }
        el.removeEventListener('click', onWrapperClick);
        if (el.parentNode != null) el.parentNode.removeChild(el);
    }

    /**************************************
     *  window
     *************************************/

    function createWindow(options) {
        const winEl = createWindowEl();
        if (options.addClass != null) {
            winEl.classList.add(options.addClass)
        }

        const titleCode = getTitleHtml(options);
        const textCode = getTextHtml(options);
        const buttonsCode = getButtonsHTML(options);

        const content = titleCode + textCode + buttonsCode;
        const winContent = `<div class="${CSS.winContentClass}">${content}</div>`
        winEl.innerHTML = winContent;

        // winEl.addEventListener('click', onWindowClick)

        module.options = options;

        setTimeout(() => {
            winEl.classList.add(CSS.winClassShow);
        }, 0)

        return winEl;

    }

    function onButtonClick(buttonEl) {
        try {
            const btIndex = buttonEl.dataset.index;
            const warning = buttonEl.dataset.warning;
            const callback = module.options.buttons[btIndex].callback;

            if (warning != null) onWarningClick(buttonEl, warning, ()=>{
                onSimpleClick(buttonEl, callback)
            })
            else onSimpleClick(buttonEl, callback);

        } catch (e) {
            console.warn(e)
        }
    }

    function onSimpleClick(buttonEl, callback) {
        setTimeout(() => {
            removeWrapper(buttonEl);
        }, 0);

        setTimeout(() => {
            if (callback) callback();
        }, 0);
    }

    function onWarningClick(buttonEl, warning, callback) {
        dialog({
            addClass: CSS.warningClass,
            text: warning,
            buttons: [
                {
                    text: 'OK',
                    callback: callback
                },
                {
                    text: 'Cancel',
                    callback: ()=> {}
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

        return `<div class="${CSS.buttonClass}" ${warningAttr} data-index="${index}">${btOptions.text}</div>`;
    }

    function getButtonsHTML(options) {
        if (options.buttons == null || options.buttons.length == 0) {
            console.warn('NO buttons in dialog');
            return;
        }

        const buttonsCode = options.buttons
            .map(getButtonHtml)
            .join('\n');

        const buttonWrapper = divCode(buttonsCode, CSS.buttonWrapClass);

        return buttonWrapper;
    }

})(libraryName)
