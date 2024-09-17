const mongoose = require('mongoose');
const Student = require('../models/Student');
const Interview = require('../models/Interview');
const Result = require('../models/Result');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const path = require('path'); // Import path module

// Render dashboard page
module.exports.dashboard = async function(req, res) {
    try {
        const students = await Student.find({});
        let interviews = await Interview.find({}).sort('date_of_visit');
        
        // Format interviews data
        interviews = interviews.map(interview => {
            return {
                ...interview.toObject(),
                company: interview.company.charAt(0).toUpperCase() + interview.company.slice(1).toLowerCase(),
                date_of_visit: interview.date_of_visit.toLocaleDateString() // Ensure it's a string
            };
        });

        return res.render('dashboard', {
            students: students,
            interviews: interviews
        });
    } catch (err) {
        console.error(`Error rendering dashboard: ${err}`);
        req.flash('error', 'Error loading dashboard');
        return res.redirect('back');
    }
};

// Create a Student
module.exports.createStudent = async function(req, res) {
    try {
        const student = await Student.findOne({ email: req.body.email });
        if (student) {
            req.flash('error', 'Student already exists!');
            console.log('Student already exists!');
            return res.redirect('back');
        }

        const newStudent = new Student({
            email: req.body.email,
            name: req.body.name,
            batch: req.body.batch,
            college: req.body.college,
            scores: {
                dsa: req.body.dsa,
                webd: req.body.webd,
                react: req.body.react
            }
        });

        await newStudent.save();
        req.flash('success', `Student ${newStudent.name} created successfully.`);
        return res.redirect('back');
    } catch (err) {
        console.error(`Error creating student: ${err}`);
        req.flash('error', 'Error creating student!');
        return res.redirect('back');
    }
};

// Create an Interview
module.exports.createInterview = async function(req, res) {
    try {
        const formData = {
            company: req.body.company.toUpperCase(),
            date_of_visit: new Date(req.body.date_of_visit) // Ensure it's a Date object
        };

        const interview = await Interview.findOne({ company: formData.company, date_of_visit: formData.date_of_visit });
        if (interview) {
            req.flash('error', 'Interview already exists!');
            console.log(`Interview already scheduled for ${req.body.company} on ${req.body.date_of_visit}!`);
            return res.redirect('back');
        }

        const newInterview = new Interview(formData);
        await newInterview.save();
        await Result.create({ interview: newInterview._id });

        req.flash('success', `Interview created successfully - Company: ${formData.company}, Date: ${formData.date_of_visit.toLocaleDateString()}`);
        return res.redirect('back');
    } catch (err) {
        console.error(`Error creating interview: ${err}`);
        req.flash('error', 'Error creating interview!');
        return res.redirect('back');
    }
};

// Download Report
module.exports.downloadReport = async function(req, res) {
    try {
        // Fetch results and populate related fields
        const results = await Result.find({})
            .populate('interview') // Populate interview details
            .populate({
                path: 'students.student', // Populate student field within students array
                model: 'Student' // Model to use for populating
            });

        // Check if results are available
        if (!results.length) {
            req.flash('error', 'No data available to generate the report');
            return res.redirect('back');
        }

        // Generate report data
        const data = results.flatMap(result => {
            return result.students.map(student => ({
                "Email": student.student ? student.student.email : 'N/A',
                "Name": student.student ? student.student.name : 'N/A',
                "College": student.student ? student.student.college : 'N/A',
                "Status": student.student ? student.student.status : 'N/A',
                "DSA Final Score": student.student ? student.student.scores.dsa : 'N/A',
                "Web Development Final Score": student.student ? student.student.scores.webd : 'N/A',
                "React Final Score": student.student ? student.student.scores.react : 'N/A',
                "Interview Company": result.interview ? result.interview.company : 'N/A',
                "Interview Date": result.interview && result.interview.date_of_visit instanceof Date ? result.interview.date_of_visit.toLocaleDateString() : 'N/A',
                "Interview Result": student.result || 'N/A'
            }));
        });

        // Check if data is empty
        if (!data.length) {
            req.flash('error', 'No data available to generate the report');
            return res.redirect('back');
        }

        // Generate CSV
        const csv = new ObjectsToCsv(data);
        const filePath = path.join(__dirname, '../report.csv'); // Use path module to create file path

        // Save to file
        await csv.toDisk(filePath);

        // Download the CSV file
        res.download(filePath, (err) => {
            if (err) {
                console.error(`Error sending the file: ${err}`);
                req.flash('error', 'Error downloading the report');
            } else {
                // Delete the file after download
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting the file: ${unlinkErr}`);
                    }
                });
            }
        });
    } catch (err) {
        console.error(`Error downloading report: ${err}`);
        req.flash('error', 'Error generating report');
        return res.redirect('back');
    }
};



