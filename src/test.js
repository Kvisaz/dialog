document.body.addEventListener('click', e=>{
    console.log('Main Page click !!!', e);
})

const button = document.body.querySelector('#button');
button.addEventListener('click', e=> Kvisaz.dialog({
    addClass: 'customDialog',
    title: "Опасное действие",
    text: "Могут быть последствияТекст",
    buttons: [
        {
            text: "Удалить",
            callback: ()=> console.log('Нажата кнопка Удалить'),
            warning: 'Вы уверены?' // должно появиться дополнительное окно
        },
        {
            text: "Отменить",
            callback: ()=> console.log('Нажата кнопка Отменить')
        },
     /*   {
            text: "Кнопка 2",
            callback: ()=> console.log('Нажата кнопка 2')
        },
        {
            text: "Стоп",
            callback: ()=> console.log('Хватит кликать!')
        },
        {
            text: "Ну кликни на мне",
            callback: ()=> console.log('Ну кликни на мне - удовлетворена')
        },
        ,
        {
            text: "Ну кликни на мне 2",
            callback: ()=> console.log('Ну кликни на мне 2 - удовлетворена')
        },
        ,
        {
            text: "Ну кликни на мне 3",
            callback: ()=> console.log('Ну кликни на мне 3 - удовлетворена')
        },
        {
            text: "Ну кликни на мне 4",
            callback: ()=> console.log('Ну кликни на мне 4 - удовлетворена')
        },*/
    ]
}))

Kvisaz.window({
    addClass: 'customDialog',
    html: '<h1>Hello</h1><button>Press Me</button>',
    onClick: e=> {
        const wrapper = e.target.closest(Kvisaz.getWrapperSelector());
        Kvisaz.close(wrapper);
    }
})
