//1、数组解构
let arr = [1,2,3]
let a = arr[0]
let b = arr[1]
let c = arr[2]
console.log(a,b,c)
//es6
let [x,y,z] =[1,2,3] 
console.log(x,y,z)

//对象解构
let user ={name: 'kirin', age : 18}
let name1=user.name
let age1 = user.age
console.log(name1,age1)
//es6
let { name , age } = user//注意：解构的变量必须和user中的属性同名
console.log(name,age)