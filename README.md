# Simple modal dialog library

Библиотека для создания диалоговых окон с одной функцией. 

Фичи:
- открывает окно в центре экрана поверх всего
- под окном - тень, которая не дает реагировать на нижележащие объекты
- кастомный дизайн (тупо описать классы CSS - и подключать их позже)
- в окне может быть куча кнопок


## Modal Dialog Window
```javascript
Kvisaz.dialog({ 
    addClass: 'myDialogClass', // кастомный класс, будет добавлен к имеющимся у окна
    title: 'Выберите действие',  // заголовок окна [необязательно]
    text: 'Оно может быть опасным', // текст [необязательно]
    buttons: [
        {
            text: 'Удалить',       //    
            callback: ()=> { console.log('Уверен')}, // функция j
            warning: 'Вы уверены?', // если задано - открывает дополнительный диалог, в котором можно отменить нажатие
        },
        {
            text: 'Отменить',       //    
            callback: ()=> { console.log('Не уверен')}, // функция 
        }  
    ]    
  });
```

## custom modal Window

```javascript
Kvisaz.window({ 
    addClass: 'myDialogClass', // custom window class
    html: '<h1>Hello</h1><button>Press Me</button>',  // custom win html
    onClick: e => { // custom click listener for window
            const wrapper = e.target.closest(Kvisaz.getWrapperSelector());
            Kvisaz.close(wrapper);
        }
  });

const windowWrapSelector = Kvisaz.getWrapperSelector();

// Kvisaz.close(wrapper); // close window with shadow


```


