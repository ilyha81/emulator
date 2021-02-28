import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {storage} from './Operation/storage';
import {ESocketMsg, SocketMessenger} from './Socket/socketMessenger';
import {Timer} from './Timer/interval';
const Socket = require('socket.io'); // Нужен именно require.

const app = express();
const SocketMsg = new SocketMessenger(new Socket(app.listen(8000, () => {
    console.log('INITIALIZED!')
})), () => storage.getOperations());

// Флаг отправки пустых данных.
let isShownEmptyStorage = false;

//ПОКА ЗАДАЕМ ШАБЛОН ВРУЧНУЮ ТУТ!
import {API as SETUP} from './SETUP';
import {OperationTemplate} from './Operation/operation_templates';
import {IDocument} from "./Document/cloudDocument";
import {Operation} from "./Operation/operation";
const Template = OperationTemplate.BASE_SUCCESS();
SETUP.setOperationPresetTemplate(Template);


/**
 * Неймспейсинг для наших экшнов. (Если разрастется - вынести в класс);
 * @type {{}}
 */
const Actions = {
    /**
     * Отправляем в управляющего клиента операции.
     */
    emitOperations: () => {
        SocketMsg.emitMsg(ESocketMsg.SHOW_DATA, storage.getOperations());
    }
};


/**
 * Включаем обновление состояния на фронтре по таймеру.
 */
Timer.subscribe(()=> {
    // Если операции есть - рассылаем статусы и переключаем флаг.
    if(storage.hasOperation()) {
        Actions.emitOperations();
        isShownEmptyStorage = false;
        // Если операций нет и флаг выключен - рассылаем пустой сторедж и включаем флаг, чтоб больше не слать.
    } else if (!isShownEmptyStorage) {
        Actions.emitOperations();
        isShownEmptyStorage = true;
    }
});


/**
 * ПРИЕМ ТЕСТОВОГО СООБЩЕНИЯ.
 */
SocketMsg.on('connection', (client: any) => {
    client.on(ESocketMsg.TEST, (data: { cryptoprofileId: string, documents: IDocument[] }) => {
        console.log("ПОЛУЧИЛИ ТЕСТ");
        console.log(data);
        if(data) {
            storage.create(data).getView();
            Actions.emitOperations();
        }
    })
});

// Коментим ручную админку, буду делать на реакт.
//app.use(express.static('public'));
// В силу специфики CRA билд админки лежит там.
app.use(express.static('../adminka/build/'));


// parse various different custom JSON types as JSON
app.use(bodyParser.json({type: 'application/json'}));

/**
 * Обработка отрисовки страницы управления.
 */
app.get('/', (req, res) => {
    console.log('get');
    // Коментим ручную админку, буду делать на реакт.
    //res.sendFile(`${__dirname}/view/index.html`);
    res.sendFile(`${__dirname}/../adminka/build/index.html`);
});

/**
 * Обработчик создания операции
 */
app.post('/operation', (req: Request, res: Response) => {

    if(req.body) {
        const newOperation = storage.create(req.body).getView(); // Проверяем явно в ифе.
        Actions.emitOperations();
        if (newOperation) {
            res.status(200);
            res.json(newOperation);
        }
        return;
    }
    res.status(500).send("ОШИБКА ОТПРАВЛЕННЫХ ДАННЫХ");
});

/**
 * Обработчик получения операций
 */
app.post('/operation/view', (req: Request, res: Response) => {

    res.status(200);
    res.json(storage.getOperations(req.body.cryptoprofileId));
});

/**
 * Обработчик отмены операции
 */
app.delete('/operation/:path', (req: Request, res: Response) => {

    const operationId = req.params.path;
    res.status(200);
    res.json(storage.cancel(operationId));

    Actions.emitOperations();
});


/**
 * Пробуем перехватить СОКЖС
 */
const NOTIFICATION_INFO_RESPONSE = {"entropy":321960509,"origins":["*:*"],"cookie_needed":true,"websocket":false, "xhr-polling": true}

app.get('/notification/push/info', (req: Request, res: Response) => {
    res.status(200);
    res.json(NOTIFICATION_INFO_RESPONSE);

});

// Нужна будет сессия, а пока для отладки.
let initial = true;
let sendData = true;
app.post('/notification/push/:server/:code/:type', (req: Request, res: Response) => {
    console.log("POST: " + req.params.server + " / " + req.params.code + " / " + req.params.type);

    if(req.params.type === 'xhr') {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        res.set('Content-type', 'application/javascript;charset=UTF-8');
        res.status(200);

        if(initial) {
            initial = false;
            res.send('o');
        } else if(sendData) {
            sendData = false;
            res.send('a["{\\"items\\":[]}"]')
        } else {

            // ОТВАЛИВАЕТСЯ! ПОДОЗРЕВАЮ НУЖЕН CSRFTOKEN
            setTimeout(()=> {
                res.send('h');
            }, 1000);
        }
    } else {
        res.status(500).send(`Not Supporting ${req.params.type}`);
    }

});
app.get('/notification/push/:server/:code/:type', (req: Request, res: Response) => {
    console.log("GET: " + req.params.server + " / " + req.params.code + " / " + req.params.type);

    if(req.params.type === 'jsonp') {
        /**
         * ПРИХОДИТ ПАРАМЕТР В СТРОКЕ, КОТОРЫЙ НАДО ОТДАВАТЬ:
         * http://localhost:3000/ic/dcb-gucci/rest/notification/push/604/vdcdnwds/jsonp?c=_jp.aaxmtru
         * _jp.aaxmtru надо вернуть!, типа:
         */
         // ВОТ ЭТО ВЕРНУТЬ НАДО:  /**/_jp.af0ay5a("h");


        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        res.set('Content-type', 'application/javascript;charset=UTF-8');
        res.status(200);

        if(initial) {
            initial = false;
            res.send('o');
        } else if(sendData) {
            sendData = false;
            res.send('a["{\\"items\\":[]}"]')
        } else {
            setTimeout(()=> {
                res.send('h');
            }, 1000);
        }
    } else {
        res.status(500).send(`Not Supporting ${req.params.type}`);
    }
});



/**
 * Обмен данных сокетный с страницей управления.
 */
//io.sockets.on('connection', (client: any) => {});

