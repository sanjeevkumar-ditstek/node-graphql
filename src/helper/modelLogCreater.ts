const logsCreater = (oldData: any, newData: any, ObjectSoFar: any, outputData: typeof newData): any => {
    // if (JSON.stringify(oldData) !== JSON.stringify(ObjectSoFar)) {
    //     return;
    // }
    if (Array.isArray(oldData)) {
        if (oldData.length === 0) {
            return;
        }
        newData.forEach((ele: any, index: number) => {
            if (typeof newData[index] === "object") {
                logsCreater(oldData[index], newData[index], {}, newData[index])
            } else {
                if (oldData.includes(ele)) {
                    outputData[index] = null;
                    oldData[index] = null;
                }
            }
        })
    } else {
        let keys = (Object.keys(newData) as (keyof typeof newData)[]);
        if (keys.length === 0) {
            return;
        }
        for (let key of keys) {
            if (typeof newData[`${String(key)}`] === "object") {
                if (oldData[`${String(key)}`]) {
                    logsCreater(oldData[`${String(key)}`], newData[`${String(key)}`], {}, outputData[`${String(key)}`])
                }
            } else if (Array.isArray(newData[`${String(key)}`])) {
                newData.forEach((ele: any, index: any) => {
                    if (oldData.includes(ele)) {
                        outputData[index] = null;
                        oldData[index] = null;
                    }
                });
                if (newData[`${String(key)}`] === oldData[`${String(key)}`]) {
                    outputData[`${String(key)}`] = null
                    oldData[`${String(key)}`] = null
                }
            } else {
                if (oldData[`${String(key)}`] || oldData[`${String(key)}`] !== null) {
                    if (oldData[`${String(key)}`] === newData[`${String(key)}`]) {
                        outputData[`${String(key)}`] = null;
                        oldData[`${String(key)}`] = null;
                    }

                }
            }
        }
    }
}


const createLoggerAns = (logs: any, parentKey: any): any => {
    let Obj: any = {};
    if (Array.isArray(logs)) {
        if (logs.length === 0) {
            return {};
        }
        let ansObj: any = {};
        logs.forEach((ele: any, index: number) => {
            if (typeof logs[index] === "object" && logs[index] !== null && Array.isArray(logs[index])) {
                let smallAns: any = createLoggerAns(logs[index], null);
                ansObj[`${index}`] = smallAns;
            } else if (typeof logs[index] === "object" &&  logs[index] !== null && !Array.isArray(logs[index])) {
                let smallAns: any;
                smallAns = createLoggerAns(logs[index], null)
                let Okeys = (Object.keys(smallAns) as (keyof typeof smallAns)[]);
                if (Okeys.length !== 0) {
                    ansObj[`${index}`] = smallAns
                }
            } else {
                if (logs[index] !== null) {
                    ansObj[`${index}`] = logs[index];
                }
            }
            if (parentKey !== null) {
                Obj[`${parentKey}`] = ansObj
            } else {
                Obj = ansObj
            }
        })

        return Obj;
    } else {
        let Obj: any = {};
        let keys = (Object.keys(logs) as (keyof typeof logs)[]);
        if (keys.length === 0) {
            return {};
        }
        keys.forEach((val: any, index: number) => {
            if (logs[`${val}`] !== null) {
                Obj[`${val}`] = "";
            }
        })
        for (let key of keys) {
            
            if (typeof logs[`${String(key)}`] === "object" && logs[`${String(key)}`] !== null  && Array.isArray(logs[`${String(key)}`])) {
            
            
                let smallAns: any = createLoggerAns(logs[`${String(key)}`], null);
                Obj[`${String(key)}`] = smallAns
            } else if (typeof logs[`${String(key)}`] === "object" && logs[`${String(key)}`] !== null && !Array.isArray(logs[`${String(key)}`])) {
                let smallAns: any = createLoggerAns(logs[`${String(key)}`], null);
                let Okeys = (Object.keys(smallAns) as (keyof typeof smallAns)[]);
                if (Okeys.length !== 0) {
                    Obj[`${String(key)}`] = smallAns
                }

                Obj[`${String(key)}`] = smallAns
            } else {
                if (logs[`${String(key)}`] !== null) {
                    Obj[`${String(key)}`] = logs[`${String(key)}`];
                }
            }
        }
        return Obj;
    }
}

function deleteEmptyObjects(obj: any) {
    for (var prop in obj) {
        if (typeof obj[prop] === 'object') {
            deleteEmptyObjects(obj[prop]); // Recursively check nested objects
            if (Object.keys(obj[prop]).length === 0) {
                delete obj[prop]; // Delete empty objects 
            }
        }
    }
}



// oldData to be input..
let a = {
    "basic": {
        "name_jp": "rew",
        "surname_jp": "fad",
        "surname": "ds",
        "name": "sad",
        "display_name": "rew fad (sad ds)",
        "username": "sanjeevDitsadsf",
        "password": "sanjeevDitsadsf@21",
        "confirmPassword": "sanjeevDitsadsf@21",
        "email": "sanjeevditsadsf@ds.com",
        "image": "./assets/images/uploadimage.png"
    },
    "permissions": [
        {
            "customer_id": "4881DAMhoCoEMBSzwKUbU",
            "customer_name": "\tKyoto Xpress",
            "prefecture_id": null,
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "4881DAMhoCoEMBSzwKUbU",
                "prefecture_id": null,
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "Tdew0YIQ4CiAl_CEHFA0e",
            "customer_name": "MRB",
            "prefecture_id": "od4ncvdyQQAvCa4dnZRVx",
            "prefecture_name": "the capital city (often Tokyo) area ",
            "site_id": "jres4ZTFm5ygHSSKXa5q1",
            "site_name": "Hirakawa-cho M Tower",
            "permissions": {
                "role": "Operator",
                "customer_id": "Tdew0YIQ4CiAl_CEHFA0e",
                "prefecture_id": "od4ncvdyQQAvCa4dnZRVx",
                "site_id": "jres4ZTFm5ygHSSKXa5q1",
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {}
            }
        },
        {
            "customer_id": "xboKmHmMubZqWwwlTFjyK",
            "customer_name": "Tech 4 Tokyo.",
            "prefecture_id": "cF_WwZJ2E4qkWpFvs5YDK",
            "prefecture_name": "Marubeni",
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "xboKmHmMubZqWwwlTFjyK",
                "prefecture_id": "cF_WwZJ2E4qkWpFvs5YDK",
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "622f255c080489f46842b76c",
            "customer_name": "森ビルトラスト_EN",
            "prefecture_id": null,
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "622f255c080489f46842b76c",
                "prefecture_id": null,
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": false
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": false,
                    "read": false,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {
                    "create": false,
                    "read": true,
                    "manage": false,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "iAONJJht67s5oRWw8lrpT",
            "customer_name": "Axis",
            "prefecture_id": "tw4GByvEXaT7gmKgF9W6B",
            "prefecture_name": "neox",
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "iAONJJht67s5oRWw8lrpT",
                "prefecture_id": "tw4GByvEXaT7gmKgF9W6B",
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": false
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": false,
                    "read": true,
                    "manage": false,
                    "disable": true
                },
                "customer_management": {
                    "create": false,
                    "read": true,
                    "manage": true,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "622f257f080489f46842b76d",
            "customer_name": "Tokyo International University",
            "prefecture_id": "61f3a0269e2d1708534ba856",
            "prefecture_name": "Tokyo",
            "site_id": "622f26ef080489f46842b775",
            "site_name": "Site5",
            "permissions": {
                "role": "Admin",
                "customer_id": "622f257f080489f46842b76d",
                "prefecture_id": "61f3a0269e2d1708534ba856",
                "site_id": "622f26ef080489f46842b775",
                "screen_permissions": {
                    "map": {
                        "view": false
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": false
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": false,
                    "manage": false,
                    "disable": false
                },
                "customer_management": {
                    "create": false,
                    "read": false,
                    "manage": false,
                    "disable": true
                }
            }
        }
    ]
}

// newData to be input..

let b = {
    "basic": {
        "name_jp": "rew",
        "surname_jp": "fad",
        "surname": "ds",
        "name": "sad",
        "display_name": "rew fad (sad ds)",
        "username": "sanjeevDitsadsf",
        "password": "sanjeevDitsadsf@21",
        "confirmPassword": "sanjeevDitsadsf@21",
        "email": "sanjeevditsadsf@ds.com",
        "image": "./assets/images/uploadimage.png"
    },
    "permissions": [
        {
            "customer_id": "4881DAMhoCoEMBSzwKUbU2",
            "customer_name": "\tKyoto Xpress",
            "prefecture_id": null,
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "4881DAMhoCoEMBSzwKUbU",
                "prefecture_id": null,
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "Tdew0YIQ4CiAl_CEHFA0e",
            "customer_name": "MRB",
            "prefecture_id": "od4ncvdyQQAvCa4dnZRVx",
            "prefecture_name": "the capital city (often Tokyo) area ",
            "site_id": "jres4ZTFm5ygHSSKXa5q1",
            "site_name": "Hirakawa-cho M Tower",
            "permissions": {
                "role": "Operator",
                "customer_id": "Tdew0YIQ4CiAl_CEHFA0e",
                "prefecture_id": "od4ncvdyQQAvCa4dnZRVx",
                "site_id": "jres4ZTFm5ygHSSKXa5q1",
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {}
            }
        },
        {
            "customer_id": "xboKmHmMubZqWwwlTFjyK",
            "customer_name": "Tech 4 Tokyo.",
            "prefecture_id": "cF_WwZJ2E4qkWpFvs5YDK",
            "prefecture_name": "Marubeni",
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "xboKmHmMubZqWwwlTFjyK",
                "prefecture_id": "cF_WwZJ2E4qkWpFvs5YDK",
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {
                    "create": true,
                    "read": true,
                    "manage": true,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "622f255c080489f46842b76c",
            "customer_name": "森ビルトラスト_EN",
            "prefecture_id": null,
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "622f255c080489f46842b76c",
                "prefecture_id": null,
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": false
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": false,
                    "read": false,
                    "manage": true,
                    "disable": true
                },
                "customer_management": {
                    "create": false,
                    "read": true,
                    "manage": false,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "iAONJJht67s5oRWw8lrpT",
            "customer_name": "Axis",
            "prefecture_id": "tw4GByvEXaT7gmKgF9W6B",
            "prefecture_name": "neox",
            "site_id": null,
            "permissions": {
                "role": "Admin",
                "customer_id": "iAONJJht67s5oRWw8lrpT",
                "prefecture_id": "tw4GByvEXaT7gmKgF9W6B",
                "site_id": null,
                "screen_permissions": {
                    "map": {
                        "view": true
                    },
                    "alarm_summary": {
                        "view": false
                    },
                    "alarm_logs": {
                        "view": true
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": false,
                    "read": true,
                    "manage": false,
                    "disable": true
                },
                "customer_management": {
                    "create": false,
                    "read": true,
                    "manage": true,
                    "disable": true
                }
            }
        },
        {
            "customer_id": "622f257f080489f46842b76d",
            "customer_name": "Tokyo International University",
            "prefecture_id": "61f3a0269e2d1708534ba856",
            "prefecture_name": "Tokyo",
            "site_id": "622f26ef080489f46842b775",
            "site_name": "Site5",
            "permissions": {
                "role": "Admin",
                "customer_id": "622f257f080489f46842b76d",
                "prefecture_id": "61f3a0269e2d1708534ba856",
                "site_id": "622f26ef080489f46842b775",
                "screen_permissions": {
                    "map": {
                        "view": false
                    },
                    "alarm_summary": {
                        "view": true
                    },
                    "alarm_logs": {
                        "view": false
                    },
                    "home": {
                        "view": true
                    }
                },
                "functions": {
                    "acknowledge_alarm": true
                },
                "user_management": {
                    "create": true,
                    "read": false,
                    "manage": false,
                    "disable": false
                },
                "customer_management": {
                    "create": false,
                    "read": false,
                    "manage": false,
                    "disable": true
                }
            }
        }
    ]
}

const CompareLogs = (oldData:any , newData: any) => {
    logsCreater(oldData , newData , {} , newData);
    let newDataLog = createLoggerAns(newData, "ans");
    let oldDataLog = createLoggerAns(oldData, "ans");
    deleteEmptyObjects(newDataLog);
    deleteEmptyObjects(oldDataLog);
    if(newDataLog.ans && oldDataLog.ans){
      newDataLog = newDataLog.ans
      oldDataLog = oldDataLog.ans
    }
    return [newDataLog , oldDataLog];        
} 


console.log(CompareLogs(a,b)); // ans1 ====> newData ,  ans2====> oldData
