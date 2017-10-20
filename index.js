const app = require('./clutter')


// var port = process.env.PORT || 3050;
var port = 3050;
// app.listen(port , ()=>{
//     console.log('server is running on port' , port)
// })

app.listen(port, function () {
        console.log("Express server listening on port", port);
});