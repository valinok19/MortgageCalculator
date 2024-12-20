let data = {
    selectedProgram: 0.249,
    cost: 12000000,
    minPrice: 375000,
    maxPrice: 100000000,
    minPaymentPercents: 0.15,
    maxPaymentPercents: 0.9,
    paymentPercents: 0.5, 
    payment: 6000000,
    getMinPayment: function () {
        return this.cost * this.minPaymentPercents;
    },
    getMaxPayment: function () {
        return this.cost * this.maxPaymentPercents;
    },
    minYear: 1,
    maxYear: 30,
    time: 10,
    programs: {
        base: 0.249,
        it: 0.06,
        gov: 0.237,
        zero: 0.257,
    },
};

let results = {
    rate: data.selectedProgram,

}

function getData() {
    return{...data}
}

function getResults() {
    return { ...results }
}

function setData(newData) {
    console.log('New data:', newData);

    if (newData.onUpdate === "radioProgram") {
        if (newData.id === "zero-value") {
            data.minPaymentPercents = 0;
        } else {
            data.minPaymentPercents = 0.15;
        }
    }

    if (newData.onUpdate === 'inputCost' || newData.onUpdate === 'costSlider') {
        // Обновление цены
        // Если стоимость меньше мин цены
        if (newData.cost < data.minPrice) newData.cost = data.minPrice;

        // Если стоимость пришла больше макс цены
        if (newData.cost > data.maxPrice) newData.cost = data.maxPrice;

        // Если новая стоимость меньше первоначального взноса
        if (data.payment > data.getMaxPayment()) {
            data.payment = data.getMaxPayment();
        }

        // Если сумма первоначального взноса меньше, чем допустимый мин платеж
        if (data.payment < data.getMinPayment()) {
            data.payment = data.getMinPayment();
        }

        data.paymentPercents = (data.payment * 100) / newData.cost / 100;
    }

    if (newData.onUpdate === 'inputPayment') {
        console.log ('MODEL')
        // Пересчитываем проценты
        newData.paymentPercents = newData.payment / data.cost;

        // Если проценты больше мфксимального процента
        if (newData.paymentPercents > data.maxPaymentPercents) {
            newData.paymentPercents = data.maxPaymentPercents;
            newData.payment = data.cost * data.maxPaymentPercents;
        }

        // Если проценты меньше минимального процента
        if (newData.paymentPercents < data.minPaymentPercents) {
            newData.paymentPercents = data.minPaymentPercents;
            newData.payment = data.cost * data.minPaymentPercents;
        }
    }

    if (newData.onUpdate === 'paymentSlider') {
        newData.paymentPercents /= 100;
        data.payment = data.cost * data.paymentPercents;
    }

    if (newData.onUpdate === 'inputTime') {
        if (newData.time > data.maxYear) {
            newData.time = data.maxYear;
        }
        if (newData.time < data.minYear) {
            newData.time = data.minYear;
        }
    }

    data = {
        ...data,
        ...newData
    };

    // Рассчет ипотеки
    const months = data.time * 12;
    console.log('months', months);

    const totalAmont = data.cost - data.payment;
    console.log('totalAmount:', totalAmont);

    const monthRate = data.selectedProgram / 12;
    console.log('monthRate:', monthRate);

    const generalRate = (1 + monthRate) ** months;
    console.log('generalRate:', generalRate);

    const monthPayment = (totalAmont * monthRate * generalRate) / (generalRate - 1);
    console.log('monthPayment:', monthPayment);

    const overPayment = monthPayment * months - totalAmont;
    console.log('overPayment:', overPayment);


    results = {
        rate: data.selectedProgram,
        totalAmont,
        monthPayment,
        overPayment
    };

    console.log('Updated data:', data);
    console.log('New results:', results);
}

export {getData, setData, getResults}