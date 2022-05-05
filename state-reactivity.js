// 监听obj对象所有属性
function observe(obj) {
    Object.keys(obj).forEach(key => {
        let internalValue = obj[key]
        const dep = new Dep()
        // get 与 set 钩子，监听变量读取与赋值操作
        Object.defineProperty(obj, key, {
            get() {
                dep.depend()
                return internalValue
            },
            set(newVal) {
                internalValue = newVal
                // 变量的值变化时，通过notify发出通知
                dep.notify()
            }
        })
    })
}

let activeFunc = null

class Dep{
    constructor() {
        // 存放当前变量的依赖函数（变量改变时，会调用这些函数）
        this.subscribers = new Set()
    }

    depend() {
        // 添加关联函数
        activeFunc && this.subscribers.add(activeFunc)
    }

    notify() {
        // 调用绑定的每个方法
        this.subscribers.forEach(func => func())
    }
}

// 绑定关联函数
function autorun(func) {
    activeFunc = func
    func()
    activeFunc = null
}

