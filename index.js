const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./src/routes/userRoutes');
const teacherRoute = require('./src/routes/teacherRoute');
const subjectRoute = require('./src/routes/subjectRoute');
const expressListEndpoints = require('express-list-endpoints');


app.use(express.json());
app.use('/images', express.static(__dirname + '/uploads'));
app.use(cors())

app.use('/user', userRoute);
app.use('/teacher',teacherRoute);
app.use('/subject',subjectRoute);

app.listen(3000, () => {
  expressListEndpoints(app).map((path=> console.log(path.path)));
  console.log('\nServer is running on port 3000');
});
