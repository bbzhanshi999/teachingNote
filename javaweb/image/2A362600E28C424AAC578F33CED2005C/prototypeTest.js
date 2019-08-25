/**
 * 用于学习prototype相关概念
 * Created by Administrator on 2016/3/2 0002.
 */
/*重点：prototype*/
/*function Person(name,age){
 if(name){
 Person.prototype.name = name;
 Person.prototype.sayName = function(){
 console.log(this.name);
 };
 }
 if(age){
 Person.prototype.age = age;
 }
 }
 var p = new Person( "ssss","29");
 p.sayName();

 var p2 = new Person(null,30);
 p2.sayName = function(){
 console.log('qunima');
 };
 console.log(p2.age);
 console.log(p.age);
 p2.sayName();
 //getPrototypeOf方法测试
 console.log("**************");
 Object.getPrototypeOf(p2).sayName();

 p2.name = null;
 console.log(p2.name);
 console.log(p.name);
 console.log(p2.hasOwnProperty('name'));
 delete p2.name;
 delete p2.sayName;
 p2.sayName();
 console.log(p2.hasOwnProperty('name'));*/

/*判断属性是否是原型对象的方法*/
/*
 function hasPrototypeProperty(obj, propertyName) {
 return !obj.hasOwnProperty(propertyName) && (propertyName in obj);
 }
 function Person() {
 Person.prototype.name = "fuck";
 Person.prototype.sayName = function () {
 console.log(this.name);
 };
 Person.prototype.age = 19;
 }
 p1 = new Person();
 console.log(hasPrototypeProperty(p1,"name"));
 p1.name = "you";
 console.log(hasPrototypeProperty(p1,"name"));
 */

/*for in与keys及getOwnPropertyNames三种方法测试*/
/*function Person(){
 Person.prototype.name = "赵千里";
 Person.prototype.age = "30";
 this.toString = function(){
 console.log(Person.prototype.name);
 }
 }
 p1 = new Person();

 for(var prop in p1){
 if(prop=="toString"){
 console.log("has String"); //IE8以下不会打印
 }
 }
 console.log(Object.keys(p1));
 console.log(Object.keys(Object.getPrototypeOf(p1)));
 console.log(Object.getOwnPropertyNames(p1));
 console.log(Object.getOwnPropertyNames(Person.prototype));//不可枚举的属性也被显示出来（Enumerable:false）*/

/*prototype快速定义方法*/
/*function Person(){

 }
 Person.prototype = {
 //constructor:Person,//加上这句，prototype就有constructor了,这种方式可枚举
 name:"niba",
 age:"29",
 sayName:function(){
 console.log(this.name);
 }
 }

 //加上这句，prototype就有constructor了,并且不可枚举
 Object.defineProperty(Person.prototype,'constructor',{
 enumerable:false,
 value:Person
 })


 var p = new Person();
 console.log(p.toString());
 p.sayName();
 for(var prop in p){
 if(prop=="constructor"){
 console.log("has constructor"); //IE8以下不会打印
 }
 }
 console.log(Object.keys(Object.getPrototypeOf(p)));
 console.log(Object.getOwnPropertyNames(Person.prototype));//已经没有constructor了

 console.log(p instanceof Object);
 console.log(p instanceof Person);
 console.log(p.constructor==Object);
 console.log(p.constructor==Person);
 console.log(Person.prototype.constructor);*/

/*重点：原型的动态特性*/
/*function Person(){

 }
 var p = new Person();

 Person.prototype.sayHi= function(){
 console.log("Hello");
 }
 p.sayHi();

 Person.prototype ={
 sayHi:function(name){
 console.log(name);
 }
 }
 var p1 = new Person();
 p1.sayHi("niba");
 p.sayHi("niba");*/


/*给基本包装类型添加方法*/
/*String.prototype.isStart = function(text){
 return this.indexOf(text)==0;
 }

 var a = "niba";
 var b = "ni";
 var c = "nd";
 console.log(a.isStart(b));
 console.log(a.isStart(c));*/

/*prototype中的this值测试*/
/*function Person(){
 this.job = "solider";
 }
 Person.prototype = {
 job : "driver",
 sayJob:function(){
 console.log(this.job);//这里的this就是p这个对象，因此遵循先找对象自己的属性，再找原型属性的原则
 }
 }

 var p = new Person();
 p.sayJob();*/

/*动态原型模式*/
/*function Person(name){
 this.name = name;
 if(typeof this.sayName !='function'){
 Person.prototype.sayName = function(){
 console.log(this.name);
 }
 }
 }
 var p = new Person("cccc");
 p.sayName();

 var p1 =new Person("aaaaa");
 p1.sayName();*/


/*稳妥构造函数模式*/
/*function Person(name){
 var obj = new Object();
 obj.getName = function(){
 return name;
 }
 return obj;//加了return后，在new构造函数时，不返回默认对象实例，而返回return中的内容；
 }

 var o = new Person("niba");
 console.log(o.getName());
 console.log(o instanceof Person);
 console.log(o instanceof Object);
 console.log(typeof o);*/
/****************/

/*重点：继承，原型链*/

/*原型链基本原理*/
/*function SuperType(name,age,job){
 this.name = name;
 this.age = age;
 this.job = job;
 SuperType.prototype.sayName = function(){
 console.log(this.name);
 }
 }

 function SubType(phone){
 this.phone = phone;
 }

 SubType.prototype = new SuperType();//单纯的原型链模式无法给超类构造函数中注入参数，也就是无法改变超类的属性值

 SubType.prototype.sayPhone = function(){
 console.log(this.phone);
 }


 var s = new SubType("15952092250");
 s.sayPhone();
 s.sayName();
 console.log(s instanceof Object);
 console.log(s instanceof SuperType);
 console.log(s instanceof SubType);*/

/*借用构造函数原型链*/
/*function SuperType(name,age,job){
 this.name = name;
 this.age = age;
 this.job = job;
 SuperType.prototype.sayName = function(){
 console.log(this.name);
 }
 }

 function SubType(name,age,job,phone){
 SuperType.apply(this,arguments);
 this.phone = phone;
 }

 var sub =new SubType("kobe","37","baller","15952092250");
 console.log(sub instanceof SubType);//true
 console.log(sub instanceof SuperType);//false,知识借用，而并没有拿到超类的prototype
 console.log(sub instanceof Object);//true
 sub.sayName();//没有该方法，因为借用构造函数模式拿不到超类原型的东西*/

/*组合继承*/
/*function SuperType(name){
 this.name =name;
 this.color = ["red","yellow","blue"];
 SuperType.prototype.sayName =function(){
 console.log(this.name);
 }
 }

 function SubType(name,age){
 SuperType.apply(this,arguments);
 this.age= age;
 }
 SubType.prototype = new SuperType();
 SubType.prototype.constructor = SubType;
 SubType.prototype.sayAge = function(){
 console.log(this.age);
 }


 //组合继承是最常用的继承模式，他结合了借用构造函数和原型链的优点，可以像超类传递参数，也可以拿到超类的原型中的方法
 var sub = new SubType("niba","29");
 console.log(sub instanceof SuperType);
 console.log(sub instanceof SubType);
 sub.sayAge();
 sub.sayName();
 sub.color.push("green");
 console.log(sub.color);
 console.log(sub.constructor);
 console.log("--------------------");
 var sub1 = new SubType("nima","25");
 console.log(sub1 instanceof SuperType);
 console.log(sub1 instanceof SubType);
 sub1.sayAge();
 sub1.sayName();
 sub1.color.push("dark");
 console.log(sub1.color);
 console.log(sub1.constructor);*/

/*原型式继承*/
/*function object(o){
 function F(){

 }
 F.prototype = o;
 return new F();
 }

 var person = {
 name:'curry',
 age:'29',
 friends:["lin","kobe","tompson"],
 sayName:function(){
 console.log(this.name);
 }
 }
 var p1 = object(person);
 p1.friends.push('harden');
 console.log(p1.friends);
 console.log(person.friends);
 p1.sayName();*/

/*原型式继承2 ECMAScript5标准做法*/
/*var person = {
    name: 'curry',
    age: '29',
    friends: ["lin", "kobe", "tompson"],
    sayName: function () {
        console.log(this.name);
    }
}

var person1 = Object.create(person, {
    name: {value:"harden"
            ,configurable:false //用于定义person1的那么属性是否可以被delete，类似于Object.defineProperty()
    }
});
//person1.name = 'harden';
person1.friends.push('howard');
person1.sayName();
console.log(person1.friends);
delete person1.name;
person1.sayName();*/

/*注意点*/
/*function SuperType(){
 this.name = "nidie";
 SuperType.prototype.sayName =function(){
 console.log(this.name);
 }
 }
 var cons = new SuperType();
 function SubType(){
 //SubType.prototype =cons;//给构造函数定义prototype一定不能在构造函数中去做,因为这个cons最终指向了constructor中的prototype。
 }
 SubType.prototype =cons;
 var s = new SubType();
 s.sayName();*/

/*重点：最理想的继承方式：寄生组合式继承*/

//这种方式可以让子类在获得父类的属性和父类原型属性的同时，避免重复调用父类构造函数，以造成属性的重复
function inheritPrototype(superType,subType){
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype=prototype;
}
function SuperType(name){
    this.name = name ;
    this.colors=["red","yellow","black"];
}
SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name,age){
    SuperType.call(this,name);
    this.age =age;
}
inheritPrototype(SuperType,SubType);

SubType.prototype.sayAge =function(){
    console.log(this.age);
}
var s = new SubType("nidie","29");
s.sayAge();
s.sayName();
console.log(s.isPrototypeOf(SuperType));
console.log(s.isPrototypeOf(SubType));
console.log(s instanceof SubType);
console.log(s instanceof SuperType);




/***************/
