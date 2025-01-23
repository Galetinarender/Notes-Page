const express = require('express')
const router = express.Router()
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//Route 1: Get All the Notes using: GET "/api/notes/getuser" . login required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes)       
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})


//Route 2: Add a new Note using: POST "/api/notes/addnode" . login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({ min : 3}),
    body('description','Description must be atleast 5 characters').isLength({ min : 5})
],async(req,res)=>{
    try {
        
        const {title,description,tag} = req.body;
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({erros: errors.array()});
        }
        //create a note Object
        const note = new Notes({
            title,description,tag,user: req.user.id   
        })
        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})

//Route 3: Update a Note using: PUT "/api/notes/updatenode/:id" . login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    try {
        
        const {title,description,tag} = req.body;
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({erros: errors.array()});
        }
        //create a new note Object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated
        var note =await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found")
        }

        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})

//Route 4: Delete a Note using: DELETE "/api/notes/deletenode/:id" . login required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
        
        const {title,description,tag} = req.body;
        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({erros: errors.array()});
        }

        //Find the note to be deleted
        var note =await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found")
        }

        //Allow deletion only if user owns this Note
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); 
    }
})

module.exports = router