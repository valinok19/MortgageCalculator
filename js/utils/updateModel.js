function updateModel(element, data) {
    // Генерируем пользовательское событие
    element.dispatchEvent(
        new CustomEvent('updateForm', {
            // Передаем объект с настройками
            bubbles: true, //всплывающее событие
            detail: {...data}
        })
    );
}

export default updateModel;