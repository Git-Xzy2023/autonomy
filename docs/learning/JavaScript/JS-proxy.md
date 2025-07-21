# 深度学习 Proxy
## 1.介绍
MDN定义：**<font style="color:rgb(27, 27, 27);">Proxy</font>**<font style="color:rgb(27, 27, 27);"> 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。</font>

本质：修改的是程序默认行为，就形同于再变成语言层面上做修改，属于元编程（meta programming）

:::info
拓展：元编程（Meta Programming），又译 超编程，是指某类计算机程序的编写，这类计算机程序编写或者操纵其它程序（或者自身）作为他们的数据，或者在运行时完成部分本应在编译时完成的工作

:::

代码示例：

```javascript
#!/bin/bash
# metaprogram
echo '!/bin/bash' > program
for((I=1;I<1024;I++)) do
    echo 'echo $I' >> program
done
chmod +x program
```

这段程序每执行一次能帮我们生成一个名为 program 的文件，文件内容为1024行 echo ，如果我们手动来写1024行代码，效率显然低效。

**<font style="color:rgb(135, 193, 32);">元编程优点</font>**<font style="color:rgb(135, 193, 32);">：与手工编写全部代码相比，程序员可以获得更高的工作效率，或者给与程序更大的灵活度去处理新的情形而无需重新编译</font>

## 2.用法
Proxy 为构造函数，用户来生成 Proxy 实例

```javascript
var proxy = new Proxy(target,handler)
```

### 2.1.参数
**target** 表示所要拦截的目标对象（任何类型的对象，包括原生数组，函数，甚至另一个代理）

**handler** 通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为

### 2.2.handler解析
关于 handler 拦截属性，有如下：

+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">get(target,propKey,receiver)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截对象属性的读取</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">set(target,propKey,value,receiver)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截对象属性的设置</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">has(target,propKey)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 propKey in proxy 的操作，返回一个布尔值</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">deleteProperty(target,propKey)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 delete proxy[propKey] 的操作，返回一个布尔值</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">ownKeys(target)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 Object.keys(proxy)、for...in 等循环，返回一个数组</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">getOwnPropertyDescriptor(target,propKey)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 Object.getOwnPropertyDescriptor(proxy,propKey)，返回属性的描述对象</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">defineProperty(target,propKey,propDesc)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截Object.defineProperty(proxy,propKey,propDesc)，返回一个布尔值</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">preventExtensions(target)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 Object.preventExtensions(proxy)，返回一个布尔值</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">isExtensible(target)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截Object.isExtensible(proxy)，返回一个布尔值</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">setPrototypeOf(target,proto)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 Object.setPrototypeOf(proxy,proto)，返回一个布尔值</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">apply(target,object,args)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 Proxy 实例作为函数调用的操作</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">construct(target,args)：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截 Proxy 实例作为构造函数调用的操作</font>

## 3.方法介绍
### 3.1.get()
get 接收三个参数，**<font style="color:#2F4BDA;">依次为目标对象、属性名和 proxy 实例本身</font>**，最后一个参数可选

```javascript
var person = {
    name:'张三'
}

var proxy = new Proxy(person,{
    get:function(target,propkey){
        return Reflect.get(target,propKey)    
    }
})

proxy.name // '张三'
```

get 能够对数组增删改查进行拦截，下面是试下你数组读取负数的索引

```javascript
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver)
        }
    };

    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');

console.log("%c Line:37 🍯", "color:#e41a6a", arr[-1]); // c
```

:::danger
<font style="color:rgb(255, 0, 1);">注意：如果一个属性不可配置（configuration）且不可写（writable）,则 Proxy 不能修改该属性，否则会报错</font>

:::

```javascript
const target = Object.defineProperties({}, {
    foo: {
        value: 123,
        writable: false,
        configurable: false
    },
})
const handler = {
    get(target, propKey) {
        return 'abc'
    }
}
const proxy = new Proxy(target, handler);


console.log("%c Line:54 🍑", "color:#42b983", proxy.foo); 
//TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data 
//property on the proxy target but the proxy did not return its actual value 
//(expected '123' but got 'abc')
```

### 3.2.set()
set 方法用来拦截某个属性的赋值操作，可以接收四个参数，依次为**<font style="color:rgb(64, 62, 214);">目标对象、属性名、属性值、和proxy实例本身</font>**

假定 Person 对象有一个 age 属性，该属性应该是一个不大于 200 的整数，那么可以使用 Proxy 保证 get 的属性符合要求

```javascript
let validator = {
    set: function (obj, prop, value) {
        console.log("%c Line:59 🍣 obj", "color:#ffdd4d", obj);
        console.log("%c Line:59 🥚 prop", "color:#f5ce50", prop);
        console.log("%c Line:59 🍬 value", "color:#93c0a4", value);
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }
        // 对于满足条件的 age 属性以及其他属性，直接保存
        obj[prop] = value;
    }
}
let person = new Proxy({}, validator);

person.age = 100;
console.log("%c Line:78 🥛 person.age", "color:#33a5ff", person.age); // 100
console.log("%c Line:79 🥕 person.age = 'young'", "color:#7f2b82", person.age = 'young');// 报错
console.log("%c Line:81 🍐 person.age = 300", "color:#ed9ec7", person.age = 300); // 报错
```

如果目标对象自身的某个属性，不可写且不可配置，那么 set 方法将不起作用

```javascript
const obj = {};
Object.defineProperty(obj, 'foo', {
    value: 'bar',
    writable: false,
})

const handler = {
    set: function (obj, prop, value, receiver) {
        console.log("%c Line:90 🍻 receiver", "color:#f5ce50", receiver);
        obj[prop] = 'baz';
    }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
console.log("%c Line:97 🍅 proxy.foo", "color:#b03734", proxy.foo); // bar
```

注意，严格模式下，set 代理如果没有返回 true , 就会报错

```javascript
'use strict';
const handler = {
    set:function(obj,prop,value,receiver){
        obj[prop] = receiver;
        // 无论有没有下面这一行，都会报错
        return false;    
    }
}
const proxy = new Proxy({},handler);
proxy.foo ='bar';
// TypeError:'set' on proxy:trap returned falsish for property 'foo'
```

### 3.3.deleProperty()
deleProperty 方法用于拦截 delete 操作，如果这个方法抛出错误或者返回 false ，当前属性就无法被 delete 命令删除

```javascript
var handler = {
    deleteProperty(target,key){
        invariant(key,'delete');
        Reflect.deleteProperty(target,key)
        return true;    
    }
}

function invariant(key,action){
    if(key[0] === '_'){
        throw new Error(`无法删除私有属性`);                    
    }
}

var target = {_prop:'foo'};
var proxy = new Proxy(target,handler);
delete proxy._prop
// Error:无法删除私有属性
```

### 3.4.取消代理
```javascript
Proxy.revocable(target,handler);
```

## 4.使用场景
Proxy 其功能非常类似于设计模式中的代理模式，常用功能如下：

+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">拦截和监视外部对对象的访问</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">降低函数或类的复杂度</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">在复杂操作前对操作进行校验或对所需资源进行管理</font>

使用 Proxy 保障数据类型的准确性

```javascript
let numericDataStore = {count:0,amount:1234,total:14};
numericDataStore = new Proxy(numericDataStore,{
    set(target,key,value,proxy){
        if(typeof value !== 'number'){
            throw Error('属性只能是 number 类型')；        
        }    
        return Reflect.set(target,key,value,proxy);
    }
})

numericDataStore.count = 'foo'
//Error:属性只能是number类型
numericDataStore.count = 333
//赋值成功
```

声明了一个私有的 apiKey ，便于 api 这个对象内部的方法调用，但不希望从外部也能够访问 api._apiKey

```javascript
let  api = {
    _apiKey:'123abc456def',
    getUsers:function(){},
    getUser:function(userId){},
    setUser:function(userId,config){}
}
const RESTRICTED = ['_apiKey'];
api = new Proxy(api,{
    get(target,key,proxy){
        if(RESTRICTED.indexOf(key)>-1){
            throw Error(`${key} 不可访问`);        
        } return Relfect.get(target,key,proxy);   
    },
    set(target,key,value,proxy){
        if(RESTRICTED.indexOf(key) > -1){
            throw Error(`${key} 不可修改`);        
        } return Relfect.get(target,key,value,proxy);
    }
})

console.log(api_apiKey)
api_apiKey = '987654321'
//上述都抛出错误
```

还能通过使用 Proxy 实现观察者模式

观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行 observable 函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数

```javascript
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj,{set});
function set(target,key,value,receiver){
    const result = Reflect.set(target,key,value,receiver);
    queuedObservers.forEach(observer => observer());
    return result
}
```

## 5.拓展
**反射（Reflect）**

MDN及描述：Reflect是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与代理处理程序的方法相同。Reflect不是一个函数对象，因此它是不可构造的定义。与大多数全局对象不同**，Reflect不是一个构造函数，所以不能通过new对其进行调用**，或者将Reflect对象作为一个函数来调用。Reflect的所有属性和方法都是静态的（就像Math对象）。

若需要再 Proxy 内部调用对象的默认行为，建议使用 Reflect ， 其是ES6 中操作对象而提供的新的API

基本特点：

+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">只要 Proxy 对象具有的代理方法，Reflect 对象全部具有，以静态方法的形式存在</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">修改某些 Object 方法的返回结果，让其变得更合理（定义不存在属性行为的时候不报错而是返回false）</font>
+ <font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">让 Object 操作都变成函数行为</font>

:::warning
<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);"> 这里我就产生了疑问，那么这和我直接操作的target对象有什么区别吗？ 有区别，如下所示：</font>

+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">返回值的不一致：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">例如Reflect.set返回一个布尔值，表示属性是否成功设置。直接操作目标设置属性会导致没有显式的返回值，隐式返回被赋的值。</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">处理这个上下文： </font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">Reflect.get接受第三个参数接收者，为了正确绑定这个上下文，特别是在访问继承的属性或访问器属性时。直接访问target[property]，不支持传递接收者，可能导致这个上下文不正确，尤其是在使用继承或访问器属性时。</font>
+ **<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);">遵循Proxy捕获器的规则：</font>**<font style="color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0);"> Proxy和Reflect对象方法一致，确保整个Proxy代理的行为一致性。</font>

:::



