import updateModel from "./../utils/updateModel.js";

function init(getData) {
    // console.log('Init programs');
    // console.log(getData().programs);

    const radioBtns = document.querySelectorAll('input[name="program"]');
    const { base, it, gov, zero } = getData().programs;
    // console.log(base);

    // Устанавливаем данные значения в радиокнопки
    document.querySelector('#base-value').value = base;
    document.querySelector('#it-value').value = it;
    document.querySelector('#gov-value').value = gov;
    document.querySelector('#zero-value').value = zero;

    // Показываем ставки по программам на старнице
    document.querySelector('#base-text').innerText = base * 100 + '%';
    document.querySelector('#it-text').innerText = it * 100 + '%';
    document.querySelector('#gov-text').innerText = gov * 100 + '%';
    document.querySelector('#zero-text').innerText = zero * 100 + '%';

    radioBtns.forEach(function (radioBtn) {
        radioBtn.addEventListener('change', function () {
            updateModel(this, {
                // пользовательские данные
                onUpdate: 'radioProgram', // название элемента, который спровоцировал событие
                selectedProgram: parseFloat(this.value), // процент программы
                id: this.id
            });
        });
    });
}

export default init;