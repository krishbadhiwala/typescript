interface phone<t>{
    name:string,
    age:number,
    key:t
}



function person<t>(obj:phone<t>){

console.log(typeof obj.key);


}

person({name:"krish",age:12,key:123456})