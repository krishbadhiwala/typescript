"use strict";
function person(obj) {
    console.log(typeof obj.key);
}
person({ name: "krish", age: 12, key: 123456 });
