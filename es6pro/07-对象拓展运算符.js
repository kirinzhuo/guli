let person = {name : 'kirin',age: 15}
//let someone = person 把地址值赋给someone
let someone = { ...person} //对拷
someone.name='Helen'
console.log(person)
console.log(someone)