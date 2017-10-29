const mongoose = require('mongoose');
const Event = mongoose.model('Event');

const get = (req, res) => {
    req.checkParams('id', 'Invalid postparam').notEmpty();

    req.getValidationResult()
        .then((result)=> {
            if (!result.isEmpty()) {
                res.status(400).json(result.array());
            } else {
                Event.findById(req.params.id,(err, event)=>{
                    if(err){
                        res.status(400).json({success: false, message: "Failed to find event."})
                    }
                    res.status(200).json({success: true, data: event});
                });
            }
        });
};

const getAll = (req, res) => {
    req.checkQuery('limit', 'Invalid postparam').notEmpty();
    req.checkBody('page', 'Invalid postparam').notEmpty();

    req.getValidationResult()
        .then((result)=> {
            if (!result.isEmpty()) {
                res.status(400).json(result.array());
            } else {
                Event.find({}, (err, events) => {
                    if(err){
                        res.status(400).json({success: false, message: "Failed to get events"});
                    }
                    res.status(200).json({success: true, data: events});
                })
                    .lean()
                    .skip(Number(req.query.limit)*Number(req.query.page))
                    .limit(Number(req.query.limit));
            }
        });
};

const add = (req, res) => {
    req.checkBody('title', 'Invalid postparam').notEmpty();
    req.checkBody('description', 'Invalid postparam').notEmpty();
    req.checkBody('date', 'Invalid postparam').notEmpty();

    req.getValidationResult()
        .then((result)=> {
            if (!result.isEmpty()) {
                res.status(400).json(result.array());
            } else {
                if(req.userId){
                    new Event({
                        userId: req.userId,
                        title: req.body.title,
                        description: req.body.description,
                        date: req.body.date,
                        icon: req.body.icon
                    }).save(err => {
                        if(!err){
                          res.status(200).json({success: true});
                        }
                        res.status(400).json({success: false, message: "Adding event failed."});
                    });
                }
            }
        });
};

const change = (req, res) => {
    req.checkBody('evendId', 'Invalid postparam').notEmpty();
    req.checkBody('title', 'Invalid postparam').notEmpty();
    req.checkBody('description', 'Invalid postparam').notEmpty();
    req.checkBody('date', 'Invalid postparam').notEmpty();

    req.getValidationResult()
        .then((result)=> {
            if (!result.isEmpty()) {
                res.status(400).json(result.array());
            } else {
                Event.findByIdAndUpdate(req.body.eventId, {
                    title: {$set: req.body.title},
                    description: {$set: req.body.description},
                    date: {$set: req.body.date},
                    icon: {$set: req.body.icon}
                },(err)=>{
                    if(err){
                        res.status(400).json({success: false, message: "Change event failed."});
                    }
                    res.status(200).json({success: true});
                });
            }
        });
};

const deleteEvent = (req, res) => {
    req.checkParams('id', 'Invalid postparam').notEmpty();

    req.getValidationResult()
        .then((result)=> {
            if (!result.isEmpty()) {
                res.status(400).json(result.array());
            } else {
                Events.findByIdAndRemove(req.params.id, (err)=>{
                    if(err){
                        res.status(400).json({success: false, message: "Deleting event failed."});
                    }
                    res.status(200).json({success: true});
                });
            }
        });

};

module.exports = {
    get, getAll, add, change, deleteEvent
};