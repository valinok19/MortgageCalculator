import updateModel from "../utils/updateModel.js";

function init(getData) {
    const data = getData();
    const input = document.querySelector('#input-term');

    const settings = {
        numeral: true,
        numeralThousandGroupStyle: 'thoursand',
        delimiter: ' ' // разделитель
    };

   const cleaveInput = new Cleave(input, settings);
    cleaveInput.setRawValue(data.time);

    input.addEventListener('input', function() {
        const value = +cleaveInput.getRawValue();

        // Проверка на мин и макс цену
        if (value < data.minYear || value > data.maxYear){
            input.closest('.param__details').classList.add('param__details--error');
        }

        if (value >= data.minYear && value <= data.maxYear) {
            input.closest('.param__details').classList.remove('param__details--error');
        }

        // Обновляем модель
        updateModel(input, { time: value, onUpdate: 'inputTime' });
    })

    input.addEventListener('change', function () {
        const value = +cleaveInput.getRawValue();

        if (value > data.maxYear) {
            input.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(data.maxYear);
        }

        if (value < data.minYear) {
            input.closest('.param__details').classList.remove('param__details--error');
            cleaveInput.setRawValue(data.minYear);
        }

        // Обновляем модель
        updateModel(input, { time: +cleaveInput.getRawValue(), onUpdate: 'inputTime' });
        
    })

    return cleaveInput;
}

export default init;