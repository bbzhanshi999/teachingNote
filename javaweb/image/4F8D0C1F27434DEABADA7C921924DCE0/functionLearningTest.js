/*
/!**
 * 用于学习js函数表达式的测试代码
 * Created by Administrator on 2016/3/3 0003.
 *!/
/!*测试function.name*!/
function functionName(){};
 console.log(functionName.name);//（chrome，firefox，opera，safari 中有效）

函数声明提升
sayHi();
 function sayHi(){
 console.log("HI");
 }

/!*函数声明带来的问题，需要用callee解决*!/

 function farcial(num){
 if(num<=1){
 return 1;
 }else{
 return arguments.callee(num-1)*num;
 }
 }

 var another = farcial;
 farcial = null;
 console.log(another(5));

/!*另一种解决的方式，及时在严格模式下有效*!/
 var farcial =function f(num){
 if(num<=1){
 return 1;
 }else{
 return f(num-1)*num;
 }
 }

 var ff = farcial;
 farcial =null;
 console.log(ff(5));

/!*闭包原理解析*!/
 function comapre(v1,v2){
 if(v1<v2){
 return -1;
 }else if(v1>v2){
 return 1;
 }else{
 return 0;
 }
 }

 var result = comapre(5,10);

/!*测试自调函数*!/
(function(){
 console.log("nidie");
 })()

 function outputNum(){
 (function(){
 for(var i = 0;i<10;i++){
 console.log(i);
 }
 })();
 //a();
 //console.log(i);
 }
 outputNum();
 function outputNum1(){
 var a = function(){
 for(var i = 0;i<10;i++){
 console.log(i);
 }
 };
 a();
 console.log(i);//报错，因为i是a的私有变量
 }
 outputNum1();

/!*通过自调函数避免创建全局变量的例子*!/
(function () {
    var now = new Date();
    if (now.getMonth() == 2 && now.getDate() == 3) {
        console.log("what a horrible day");
    }
})();

/!*通过特权方法来保证变量私有*!/
function Person(name){
     this.getName = function(){
        return name ;
    };
    this.setName = function(value){
        name = value;
    }
}

var p = new Person("er");
console.log(p.getName());
p.setName("erer");
console.log(p.getName());*/

/*静态私有变量（将访问变量的方法保存prototype中）*/
/*
(function(name){
    Person = function(value){
        name =value;
    };
    Person.prototype.getName =function(){
        return name;
    }
    Person.prototype.setName = function(value){
        name =value;
    };
})();

var person = new Person('niba');
console.log(person.getName());
var person2 = new Person('nima');
console.log(person.getName());*//*由于访问私有变量的方法放置于prototype中，因此那么属性大家共享，因为proto中就一个setName方法，所有的实例
对象都使用这个方法，而该方法的作用域链就一条，因此只有一个name*/

/*重点：模块化编程的例子（原理就是利用私有变量和特权方法来服务单例）*/
/*
var application =function(){
    var components =new Array();
    return {
      getComponentCount:function(){
          return components.length;
      },
      registerComponent:function(component){
          if(typeof component =='object'){
              components.push(component);
          }
      }
    };
};

var o = new Object();
console.log(typeof o);
var app = application();
app.registerComponent(o);
console.log(app.getComponentCount());

var app2 = application();
app2.registerComponent(o);
console.log(app2.getComponentCount());*/
