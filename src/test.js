document.body.addEventListener('click', e=>{
    console.log('Main Page click !!!', e);
})

const button = document.body.querySelector('#button');
button.addEventListener('click', e=> Kvisaz.dialog({
    addClass: 'customDialog',
    title: "Диалог",
    text: "Текст",
    buttons: [
        {
            text: "Кнопка 1",
            callback: ()=> console.log('Нажата кнопка 1')
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
