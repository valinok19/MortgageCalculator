import * as Model from "./model.js";
import updateResultsView from './view/updateResultsView.js';
import programs from './view/radioPrograms.js';
import { updateMinPercents } from "./view/utils.js";

import costInput from "./view/costInput.js";
import costRange from "./view/costRange.js";

import paymentInput from "./view/paymentInput.js";
import paymentRange from "./view/paymentRange.js";

import timeInput from "./view/timeInput.js";
import timeRange from "./view/timeRange.js";


window.onload = function () {
    const getData = Model.getData;

    // Инициализируем programs
    programs(getData);

    // Инициализируем costInput
    const cleaveCost = costInput(getData);
    // Инициализируем costRange
    const sliderCost = costRange(getData);

    // Инициализируем payment input
    const cleavePayment = paymentInput(getData);
    // Инициализируем payment slider
    const sliderPayment = paymentRange(getData);

    // Инициализируем time input
    const cleaveTime = timeInput(getData);
    // Инициализируем time slider
    const sliderTime = timeRange(getData);


    Model.setData({});
    const results = Model.getResults();
    updateResultsView(results);


    document.addEventListener('updateForm', (e) => {
        Model.setData(e.detail);

        const data = Model.getData();
        const results = Model.getResults(getData);

        // Обновление всех связанных с внешним видом форм,основываясь на model
        updateFormAndSliders(data);

        // Обновление блока results
        updateResultsView(results);
    });

    function updateFormAndSliders(data) {
        // Обновление радиокнопок
        if (data.onUpdate === 'radioProgram') {
            updateMinPercents(data);

            // Обновление payment slider
            sliderPayment.noUiSlider.updateOptions({
                range: {
                    min: data.minPaymentPercents * 100,
                    max: data.maxPaymentPercents * 100,
                },
            })
        }
        // costInput
        if (data.onUpdate !== 'inputCost') {
            cleaveCost.setRawValue(data.cost);
        }
        // costSlider
        if (data.onUpdate !== 'costSlider') {
            sliderCost.noUiSlider.set(data.cost);
        }

        // paymentInput
        if (data.onUpdate !== 'inputPayment') {
            cleavePayment.setRawValue(data.payment);
        }

        // paymentSlider
        if (data.onUpdate !== 'paymentSlider') {
            sliderPayment.noUiSlider.set(data.paymentPercents * 100);
        }

        // timeInput
        if (data.onUpdate !== 'inputTime') {
            cleaveTime.setRawValue(data.time);
        }

        // timeSlider
        if (data.onUpdate !== 'timeSlider') {
            sliderTime.noUiSlider.set(data.time);
        }
    }

    // Форма заказа
    const openFormBtn = document.querySelector('#openFormBtn');
    const orderForm = document.querySelector('#orderForm');
    const submitFormBtn = document.querySelector('#submitFormBtn');

    openFormBtn.addEventListener('click', function () {
        orderForm.classList.remove('none');
        openFormBtn.classList.add('none');
    })

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Собираем данные с формы перед disable
        const formData = new FormData(orderForm);
        console.log(formData);
        console.log(formData.get('name'));
        console.log(formData.get('email'));
        console.log(formData.get('phone'));

        // Disable для кнопки и инпутов
        submitFormBtn.setAttribute('disabled', true);
        submitFormBtn.innerText = 'Заявка отправляется...';

        orderForm.querySelectorAll('input').forEach(function (input) {
            input.setAttribute('disabled', true);
        })

        fetchData();

        async function fetchData() {
            const data = Model.getData();
            const results = Model.getResults();

            let url = checkOnUrl(document.location.href);

            function checkOnUrl(url) {
                let urlArrayDot = url.split('.');

                if (urlArrayDot[urlArrayDot.length - 1] === 'html') {
                    urlArrayDot.pop();
                    let newUrl = urlArrayDot.join('.');
                    let ulArraySlash = newUrl.split('/');
                    ulArraySlash.pop();
                    newUrl = ulArraySlash.join('/') + '/';
                    return newUrl;
                }

                return url;
                
            }

            const response = await fetch(url + 'mail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    form: {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                    },
                    data,
                    results
                })
            });

            const result = await response.text();
            console.log(result);

            submitFormBtn.removeAttribute('disabled', true);
            submitFormBtn.innerText = 'Оформить заявку';

            orderForm.querySelectorAll('input').forEach(function (input) {
                input.removeAttribute('disabled', true);
            });

            // Очищаем поля формы
            orderForm.reset();
            orderForm.classList.add('none');
            
            // На основе ответа от сервера показываем сообщения об успехе или оштбке
            if (result === 'SUCCESS') {
                document.getElementById('success').classList.remove('none');
            } else {
                document.getElementById('error').classList.remove('none');
            }
        }
    })
}