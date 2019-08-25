### promise and deferred
1. ajax链式调用（无需嵌套请求）如：

```
//orgin is a promise
var orgin = request.get('url',{...}).then(function(resp){
    .....
    return resp;
})
var processB = function(result){
        ....
        return request.get(...,).then(function(resp){
            .....
            return resp;
        })
    });
};
var proceesC = function(result){
    ....
    return request.get(....).then( function(resp){
        .....
    })
}
orgin.then(processB).then(proceesC);

```
### functional包（lang.hitch等对象方法）
参考以下API[：functional api](http://dojotoolkit.org/api/?qs=1.10/dojox/lang/functional)