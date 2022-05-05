// 虚拟DOM实现

const $ = document.querySelector.bind(document)

// 创建vdom
function h(tag, props, children) {
    return {tag, props, children}
}

// 将VNode挂载到指定的DOM节点上，让VNode在页面中可以正常显示
function mount(vnode, container){

    const {tag, props, children} = vnode
    // 创建DOM元素
    vnode.el = document.createElement(tag)

    // 给元素设置属性
    setProps(vnode.el, props)
    // 设置子元素
    setChildren(vnode.el, children)
    // 将新创建的元素添加到指定的DOM中
    container.appendChild(vnode.el)
    
    // 设置子元素
    function setChildren(el, children) {
        // 字符串，直接作为父元素的内容
        if (typeof children == 'string') {
            el.textContent = children
        } else {
            // 递归调研mount处理子元素
            children.forEach(child => mount(child, el))
        }
    }
}

// 给元素设置属性
function setProps(ele, props){
    for (const [key, value] of Object.entries(props)) {
        ele.setAttribute(key, value)
    }
}

// 将Vnode从指定DOM中移除
function unmount(vnode) {
    vnode.el.parentNode.removeChild(vnode.el)
}

// 将新VNode(n2)与旧的VNode(n1)进行对比，找出不同，并进行替换
function patch(n1, n2) {
    const el = n1.el
    n2.el = el

    if (n1.tag !== n2.tag) {
        // 如果两个节点标签类型都不相同，则直接添加新节点（n2），删除旧节点（n1）
        mount(n2, el.parentNode)
        unmount(n1)
    }else {
        // 两节点标签类型一样

        // 新节点的子节点是字符串，则替换内容并重新设置属性
        if (typeof n2.children == 'string') {
            el.textContent = n2.children
            setProps(el, n2.props)
        } else {
            // 如果子节点不是字符串，即当前同类型的新节点有不同的子节点，需要处理
            patchChildren(n1, n2)
        }
    }
}

function patchChildren(n1, n2) {
    const c1 = n1.children
    const c2 = n2.children
    // 计算出两节点公共长度
    const commonLen = Math.min(
        typeof c1 == 'string' ? 0: c1.length,
        c2.length,
    )
    
    // 通过patch方法替换相同长度的节点
    for (let i = 0; i < commonLen; i++) {
        patch(c1[i], c2[i])
    }

    // 如果就节点长，则通过unmount删除多出的子节点
    if (c1.length > commonLen) {
        for (let i = commonLen; i < c1.length; i++) {
            unmount(c1[i])
        }
    }

    // 如果新节点长，则通过mount添加多出的子节点
    if(c2.length > commonLen) {
        for (let i = commonLen; i < c2.length; i++) {
            mount(c2[i], n2.el)
        }
    }
}
