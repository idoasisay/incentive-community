const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const wallet = require('./router/wallet');

const app = express();
const port = 4000;

// cors 처리
app.use(cors());
// 응답 확인
app.use(morgan('      :method :url :status :res[content-length] - :response-time ms'))
//
app.use(express.urlencoded({ extended: true }));
// 파싱
app.use(express.json());
// 라우터 분기
app.use('/wallet', wallet);

app.get('/', (req, res) => res.send('Hello World!'));
// 서버 생성
const server = app.listen(port, () => {
    console.log(`✅ サーバーが生きています ${port}!`);
});

module.exports = server;