const Task = require('../models/model');
const csv = require('csv-parser');
const fs = require('fs');

const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const { status, priority, dueDate, assignee, page = 1, limit = 10 } = req.query;
        let query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (dueDate) query.dueDate = { $gte: new Date(dueDate) };
        if (assignee) query.assignee = assignee;

        const tasks = await Task.find(query)
            .sort({ dueDate: 1 })
            .skip((1 - 1) * limit)
            .limit(Number(5));

        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const exportTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        const csvWriter = require('csv-writer').createObjectCsvWriter({
            path: 'uploads/tasks.csv',
            header: [
                { id: 'title', title: 'Title' },
                { id: 'description', title: 'Description' },
                { id: 'dueDate', title: 'Due Date' },
                { id: 'priority', title: 'Priority' },
                { id: 'status', title: 'Status' },
                { id: 'assignee', title: 'Assignee' },
            ]
        });

        await csvWriter.writeRecords(tasks);
        res.download('uploads/tasks.csv');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const importTasks = async (req, res) => {
    try {
        let tasks = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => tasks.push(row))
            .on('end', async () => {
                await Task.insertMany(tasks);
                res.status(200).json({ message: 'Tasks imported successfully!' });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    exportTasks,
    importTasks
}