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
}