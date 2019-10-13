const inquirer = require('inquirer')
const db = require('./db')

const add = async title => {
    try {
        if (!title) {
            console.log('请输入任务名！')
            return
        }
        const tasks = await db.read()
        const task = tasks.find(c => c.title === title)
        if (task) {
            console.log('任务已存在！')
            return
        }
        tasks.push({ title, done: false })
        await db.write(tasks)
    } catch (err) {
        throw err
    }
}

const clear = async () => {
    try {
        await db.write()
    } catch (err) {
        throw err
    }
}

const finish = async (tasks, task) => {
    try {
        task.done = true
        await db.write(tasks)
    } catch (err) {
        throw err
    }
}

const unFinish = async (tasks, task) => {
    try {
        task.done = false
        await db.write(tasks)
    } catch (err) {
        throw err
    }
}

const remove = async (tasks, index) => {
    try {
        tasks.splice(index, 1)
        await db.write(tasks)
    } catch (err) {
        throw err
    }
}

const editTitle = async (tasks, task, title) => {
    try {
        task.title = title
        await db.write(tasks)
    } catch (err) {
        throw err
    }
}

const doTasksAction = (answers, tasks) => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择你想操作的任务',
                choices: [
                    { name: '退出', value: -1 },
                    { name: '已完成', value: 0 },
                    { name: '未完成', value: 1 },
                    { name: '改标题', value: 2 },
                    { name: '删除', value: 3 },
                ]
            }
        ])
            .then(nextAnswers => {
                switch (nextAnswers.index) {
                    case 0:
                        finish(tasks, tasks[answers.index])
                        break
                    case 1:
                        unFinish(tasks, tasks[answers.index])
                        break
                    case 2:
                        inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'title',
                                    message: '新的标题',
                                    default: tasks[answers.index].title,
                                }
                            ])
                            .then(({ title }) => {
                                editTitle(tasks, tasks[answers.index], title)
                            })
                        break
                    case 3:
                        remove(tasks, answers.index)
                        break
                    default:
                        break
                }
            })
}

const doAction = (answers, tasks) => {
    switch (answers.index) {
        case -1:
            break
        case -2:
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: '任务名称'
                    }
                ])
                .then(({ title }) => {
                    add(title)
                })
            break
        case -3:
            clear()
            break
        default:
            doTasksAction(answers, tasks)
            break
    }
}

const printTasks = tasks => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择你想操作的任务',
                choices: [
                    { name: '退出', value: -1 },
                    { name: '+ 创建任务', value: -2 },
                    ...tasks.map((task, index) => {
                        return { name: `${ task.done ? '[x]' : '[_]' } ${index + 1} ${task.title}`, value: index }
                    }),
                    { name: '清空任务', value: -3 }]
            }
        ])
        .then(answers => {
            doAction(answers, tasks)
        })
}

const showAll = () => {
    db.read().then(printTasks)
}

module.exports = {
    add,
    clear,
    showAll
}
