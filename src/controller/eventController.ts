import Event from '../model/Event';
import Comment from '../model/Comment';
import { Request, Response } from 'express';

const getall = async (req: Request, res: Response) => {
    const events = await Event.find();
    res.json(events);
}

const getone = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    res.json(event);
}

const setone = async (req: Request, res: Response) => {
    const event = new Event(req.body);
    await event.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Event saved' });
    });
}

const update = async (req: Request, res: Response) => {
    await Event.findByIdAndUpdate(req.params.id_event, req.body, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Event updated' });
    });
}

const deleteEvent = async (req: Request, res: Response) => {
    await Event.findByIdAndDelete(req.params.id_event, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Event deleted' });
    });
}

const addComment = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    const comment = new Comment(req.body);
    await comment.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        event.update(
            { _id: event._id },
            { $push: { comments: comment._id } },
        );
        event.save();
        res.status(200).json({ status: 'Comment saved' });
    });
}

const getComments = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    res.json(event.comments);
}

const getComment = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    const comment = await Comment.findById(req.params.id_comment);
    if (!comment) {
        return res.status(404).send('The comment does not exist');
    }
    res.json(comment);
}

const updateComment = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    await Comment.findByIdAndUpdate(req.params.id_comment, req.body, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Comment updated' });
    });
}

const deleteComment = async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id_event);
    if (!event) {
        return res.status(404).send('The event does not exist');
    }
    const comment = await Comment.findById(req.params.id_comment);
    if (!comment) {
        return res.status(404).send('The comment does not exist');
    }
    await Comment.findByIdAndDelete(req.params.id_comment, (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        event.update(
            { _id: event._id },
            { $pull: { comments: comment._id } },
        );
        event.save();
        res.status(200).json({ status: 'Comment deleted' });
    });
}

export default {
    getall,
    getone,
    setone,
    update,
    deleteEvent,
    addComment,
    getComments,
    getComment,
    updateComment,
    deleteComment
}