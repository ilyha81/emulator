const ESocketMsg = {
    HELLO: "HELLO",
    SHOW_DATA: "SHOW_DATA",
    TEST: "TEST"
};

/**
 * Функция отрисовки данных в соответствующей секции
 * @param data Данные для отрисовки
 */
const drawData = (data) => {
    const section = document.getElementById('show-data');
    console.log(data);
    section.innerText = JSON.stringify(data);
};

window.onload = () => {
    let socket = io.connect('http://localhost:8000');

    /**
     * Кнопка отправки тестовых данных.
     */
    const testButton = document.getElementById("test-msg");
    testButton.onclick = ()=> {
        socket.emit(ESocketMsg.TEST, {documents: [{id: 'asd1', docType: 'RPP'}, {id: 'asd2', docType: 'RPP'}], cryptoprofileId: "TEST_PROFILE"});
    };

    socket.on(ESocketMsg.HELLO, data => {console.warn("SCOKET: incomming message = " + ESocketMsg.HELLO); drawData(data)});
    socket.on(ESocketMsg.SHOW_DATA, data => {console.warn("SCOKET: incomming message = " + ESocketMsg.SHOW_DATA); drawData(data)});

};