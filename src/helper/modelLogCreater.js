var logsCreater = function (oldData, newData, ObjectSoFar, outputData, keyOfObject, parentObject) {
    // if (JSON.stringify(oldData) !== JSON.stringify(ObjectSoFar)) {
    //     return;
    // }
    if (Array.isArray(oldData)) {
        if (oldData.length === 0) {
            return;
        }
        newData.forEach(function (ele, index) {
            if (typeof newData[index] === "object") {
                var ans = logsCreater(oldData[index], newData[index], {}, newData[index], index, newData);
                if (ans) {
                    if (keyOfObject !== null) {
                        parentObject["".concat(keyOfObject)] = ans;
                    }
                    else {
                        parentObject = ans;
                    }
                }
            }
            else {
                if (oldData.includes(ele)) {
                    outputData[index] = null;
                }
                if (outputData.length === index + 1) {
                    if (keyOfObject !== null) {
                        console.log(keyOfObject, outputData, "keyOfObject ......");
                        var newArray = [];
                        for (var i = 0; i <= outputData.length - 1; i++) {
                            //         if(outputData[i] !== null){
                            newArray.push(outputData[i]);
                            //         }
                        }
                        var newobj = Object.assign({}, newArray);
                        parentObject["".concat(keyOfObject)] = newobj;
                    }
                    else {
                        var newobj = Object.assign({}, outputData);
                        return newobj;
                    }
                }
            }
        });
    }
    else {
        var keys = Object.keys(newData);
        if (keys.length === 0) {
            return;
        }
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (typeof newData["".concat(String(key))] === "object") {
                if (oldData["".concat(String(key))]) {
                    var ans = logsCreater(oldData["".concat(String(key))], newData["".concat(String(key))], {}, outputData["".concat(String(key))], "".concat(String(key)), newData);
                    if (ans) {
                        if (keyOfObject !== null) {
                            parentObject["".concat(keyOfObject)] = ans;
                        }
                        else {
                            parentObject = ans;
                        }
                    }
                }
            }
            else if (Array.isArray(newData["".concat(String(key))])) {
                newData.forEach(function (ele, index) {
                    if (oldData.includes(ele)) {
                        outputData[index] = null;
                    }
                    console.log(ele, "checking element for luna");
                    if (outputData.length === index + 1) {
                        if (keyOfObject !== null) {
                            console.log(keyOfObject, outputData, "keyOfObject ......");
                            var newArray = [];
                            for (var i = 0; i <= outputData.length - 1; i++) {
                                //         if(outputData[i] !== null){
                                newArray.push(outputData[i]);
                                //         }
                            }
                            var newobj = Object.assign({}, newArray);
                            parentObject["".concat(keyOfObject)] = newobj;
                        }
                        else {
                            var newobj = Object.assign({}, outputData);
                            console.log(newobj);
                            return newobj;
                        }
                    }
                });
                if (newData["".concat(String(key))] === oldData["".concat(String(key))]) {
                    outputData["".concat(String(key))] = null;
                }
            }
            else {
                if (oldData["".concat(String(key))]) {
                    if (oldData["".concat(String(key))] === newData["".concat(String(key))]) {
                        outputData["".concat(String(key))] = null;
                    }
                }
            }
        }
    }
};
var a1 = {
    firstname: "Amarjeet",
    lastname: "singh",
    email: "amarjeet.singh@gmail.com",
    phone: "12345678"
};
var b1 = {
    firstname: "Amarjeet1",
    lastname: "singh",
    email: "amarjeet1.singh@gmail.com",
    phone: "123456789"
};
var a = {
    name: "Amarjit",
    email: "amarjeet.singh@gmail.com",
    details: {
        course: "AVON",
        build: "Nova"
    },
    aman: ["flow", "chart"]
};
var b = {
    name: "Amarjit",
    email: "amarjeet.singh1@gmail.com",
    details: {
        course: "AVON",
        build: "Nova1"
    },
    aman: ["flow", "chart1"]
};
// let result = logsCreater(a1, b1, {}, b1, null, b1);
console.log(b1, "RRRRRRRRRR");
