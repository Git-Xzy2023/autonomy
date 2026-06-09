# 1.类型保护
类型保护是 TypeScript 中的一种机制，用于在运行时缩小变量的类型范围，从而更精确地进行类型检查。类型保护可以通过很多种方式实现。包括使用 `typeof` 、`instanceof` 、用户自定义的类型保护函数等。

## 1.1.使用 `typeof` 类型保护
`typeof` 操作符可以用来判断一个变量的类型，它对于判断基本类型（如字符串、数字、布尔值）非常有用。

示例：

```typescript
function padLeft(value:string,padding:number | string){
  if(typeof padding == 'number'){
    return Array(padding + 1).join(" ") + value
  }
  if(typeof padding === 'string'){
    return padding + value;
  }
  throw new Error(`Expected number or string, but got ${typeof padding}.`)
}
```

在这个示例中，typeof 操作符用于检查 padding 变量的类型，并根据不同的类型执行不同的操作。



## 1.2.使用 `instanceof` 类型保护
`instanceof` 操作符可以用来判断一个对象是否是某个类的实例。它对判断复杂对象类型（如类实例）非常有用。

示例：

```typescript
class Bird {
  fly(){
    console,log('Flying')
  }
}
class Fish {
  swim(){
    console.log('Swimming');
  }
}
function move(animal:Bird | Fish){
  if(animal instanceof Bird){
    animal.fly();
  }else if (animal instanceof Fish){
    animal.swim();
}

const bird = new Bird();
const fish = new Fish();

move(bird); // Flying
move(fish); // Swimming
```

在这个示例中，instanceof 操作符用于检查 animal 变量的类型，并根据不同的类型执行相应方法。

## 1.3.使用 `in` 操作符类型保护
in 操作符可以用来检查对象是否具有某个属性。

示例：

```typescript
interface Bird {
  fly():void;
  layEggs():void;
}

interface Fish {
  swim():void;
  layEggs():void;
}

fucntion getPet():Bird | Fish {
  // 返回一个 Bird 或 Fish 实例
}

let pet = getPet();
if('fly' in pet){
  pet.fly();
}else{
  pet.swim();
}
```

在这个示例中，`in` 操作符用于检查 pet 对象是否具有 fly 方法，并根据结果调用不同的方法。

## 1.4.自定义类型保护函数
你可以定义自定义的类型保护函数，通过这种方式，可以实现更复杂的类型检查逻辑。

示例：

```typescript
interface Bird {
  fly():void;
  layEggs():void;
}

interface Fish {
  swim():void;
  layEggs():void;
}

function isBird(pet:Bird | Fish): pet is Bird {
  return (pet as Bird).fly !== undefined;
}

function move(pet:Bird | Fish){
  if(isBird(pet)){
    pet.fly();
  } else {
    pet.swim();
  }
}

const bird:Bird = {
  fly(){console.log('Flying')},
  layEggs(){console.log('Laying eggs')}
}

const  fish:Fish = {
  swim(){console.log('Swimming')},
  layEggs(){console.log('Laying eggs')}
}

move(bird); // Flying
move(fish); // Fish
```

在这个示例中，isBird 函数通过检查 pet 对象是否具有 fly 方法来确定其类型，并使用 pet is Bird 语法声明类型保护。这使得在 move 函数中可以安全地调用 pet.fly 方法。

## 1.5.`null`和 `undefined` 类型保护
在处理 `null` 和 `undefined` 时，类型保护也非常有用。

示例：

```typescript
function getValue(x:string | null | undefined):string{
  if(x == null){
    return 'default';
  }
  return x;
}

console.log(getValue(null)); // default
console.log(getValue(undefined)); // default
```

# 2.类型推导 infer
infer 关键字是 TypeScript 2.8 引入的一部分，用于在条件类型中推断类型。它允许你在类型检查过程中提取和捕获某些类型信息，从而实现更灵活和动态的类型推推断。

**基本语法**

infer 关键字通常与条件类型一起使用，用于从复杂类型中提取子类型。

示例：

```typescript
type ReturnType<T> = T extends (...args:any[]) => infer R ? R:any;

function exampleFunction(): string {
  return "Hello,Typescript!"
}

type ExampleReturnType = ReturnType<typeof exampleFunction>;
// ExampleReturnType 的类型是 string
```

在这个示例中，ReturnType 是一个条件类型，用于提取函数类型的返回类型：

+ `T extends (...args:any[]) => infer R`: 表示如果 `T` 是一个函数类型，则使用 `infer R` 推断其返回类型 `R`。
+ `? R:any`: 如果推断成功，`ReturnType` 的结果类型为 `R`, 否则为any。

**更多示例**

## **提取数组元素类型**
我们可以使用 `infor` 从数组类型中提取元素类型

```typescript
type ElementType<T> = T extends (infor U)[] ? U : T;

type StringArray = string[];
type NumberArray = number[];
type MixedArray = (string | number)[];

type StringElement = ElementType<StringArray>; // string
type NumberElement = ElementType<NumberArray>; // number
type MixedElement = ElementType<MixedArray>; // number | string
```

在这个示例中，ElementType 类型用于提取数组的元素类型：

+ ` T extends (infor U)[]` ： 表示如果 T 是一个数组类型，则使用 infor U 提取其元素类型 U。
+ `? U : T`：如果 T 是数组类型，结果类型为 U , 否则为 T。

## **提取元组中的第一个元素类型**
使用 infer 从元祖类型中提取第一个元素的类型。

```typescript
type First<T> = T extends [infer U, ...any[]] ? U : never;

type Tuple1 = [string,number,boolean];
type Tuple2 = [number,boolean];

type FirstElement1 = First<Tuole1>; // string
type FirstElement2 = First<Tuole2>; // number
```

在这个示例中，First 类型用于提取元组的第一个元素类型：

+ `T extends [infer U, ...any[]]`：表示如果 `T` 是一个包含至少一个元素的元组类型，则使用 `infer U`提取其第一个元素的类型 `U`。
+ `? U : never` : 如果 `T` 是元组类型，结果类型为 `U` , 否则为 `never`

## **提取函数参数类型**
我们可以使用 infer 从函数类型中提取参数类型

```typescript
type Parameters<T> = T extends (...args:infer P) => any ? P : never;

function exampleFunction(arg1:string,arg2:number):void {}

type ExampleParameters = Parameters<typeof exampleFunction>;
// ExampleParameters 的类型是 [string,number]
```

