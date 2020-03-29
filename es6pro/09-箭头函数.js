//传统方法
let arr = ["10", "5", "40", "25", "1000"]
arr1 = arr.sort()
console.log(arr1)

//上面的代码没有按照数值的大小对数字进行排序，
//要实现这一点，就必须使用一个排序函数
arr2 = arr.sort(function(a,b){
    return a - b
})
console.log(arr2)

//ES6
// 当箭头函数没有参数或者有多个参数，要用 () 括起来。
// 当箭头函数函数体有多行语句，用 {} 包裹起来，表示代码块，
arr2 = arr.sort((a,b) => {
    return a - b
})
//ES6 
// 当只有一行语句，并且需要返回结果时，可以省略 {} , 结果会自动返回。
arr2 = arr.sort((a,b) => a - b)