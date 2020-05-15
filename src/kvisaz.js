const libraryName = 'Kvisaz';

// мгновенно исполняемая функция, которая наполняет передаваемый ей объект
(function (moduleName) {
    console.log('модуль сработал');
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
        shadowId: 'kvisaz-shadow',
        winId: 'kvisaz-dialog',
        winClass: 'kvisaz-dialog',
        winClassShow: 'kvisaz-dialog-show',
        winContentClass: 'kvisaz-dialog-content',
        titleClass: 'kvisaz-dialog-title',
        textClass: 'kvisaz-dialog-text',
        buttonClass: 'kvisaz-dialog-button',
        buttonWrapClass: 'kvisaz-button-wrap'

    }
    //language=CSS
    const CSSinnerHTML = `
        .${CSS.wrapperClass} {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .${CSS.shadowClass} {
            background: black;
            opacity: 0.75;
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        
        .${CSS.winId} {
            user-select: none;
            font-family: Roboto, Verdana, Arial, sans-serif;
        }        
        .${CSS.winClass} {
            opacity: 1;
            transition: all 0.25s ease-in;
            width: 35%;
            background: beige;
            position: fixed;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }        
        
        .${CSS.winClassShow} {            
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
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
        const shadow = createShadow(options);
        const win = createWindow(options);
        wrapper.appendChild(shadow);
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
        el.id = CSS.shadowId;
        document.head.appendChild(el);
    }


    /**************************************
     *  wrapper
     *************************************/
    function createWrapper(options) {
        return div(CSS.wrapperClass);
    }

    function onWrapperClick(e) {
        console.log('onWrapperClick');
        e.stopImmediatePropagation();
        if (e.target.classList.contains(CSS.buttonClass)) {
            onButtonClick(e.target);
            return;
        }
    }

    function removeWrapper() {
        const el = document.body.querySelector(`.${CSS.wrapperClass}`);
        if (el == null) {
            console.warn('no wrapper window');
            return;
        }
        el.removeEventListener('click', onWrapperClick);
        if (el.parentNode != null) el.parentNode.removeChild(el);
    }

    /**************************************
     *  shadow
     *************************************/

    function createShadow(options) {
        const el = div(CSS.shadowClass);
        el.id = CSS.shadowId;
        return el;
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
        console.log('click on button ', buttonEl);
        try {
            const btIndex = buttonEl.dataset.index;
            const callback = module.options.buttons[btIndex].callback;

            setTimeout(() => {
                removeWrapper();
            }, 0);

            setTimeout(() => {
                if (callback) callback();
            }, 0);

        } catch (e) {
            console.warn(e)
        }
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
        console.log(`${name}: `, options[name]);
        return divCode(options[name], className);
    }

    function getTitleHtml(options) {
        return divCodeOptions(options, 'title', CSS.titleClass);
    }

    function getTextHtml(options) {
        return divCodeOptions(options, 'text', CSS.textClass);
    }

    function getButtonHtml(btOptions, index) {
        return `<div class="${CSS.buttonClass}" data-index="${index}">${btOptions.text}</div>`;
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

console.log(`Объект библиотеки ${libraryName} - `, window[libraryName]);
