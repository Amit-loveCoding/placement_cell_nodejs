const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');

// Render login page
module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/employee/dashboard');
    }
    return res.render('login');
}

// Render signup page
module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/employee/dashboard');
    }
    return res.render('signup');
}

// Create an employee
module.exports.createEmployee = async function(req, res){
    try {
        // Find employee with the request email
        const emp = await Employee.findOne({ email: req.body.email });

        // If employee already exists, redirect back
        if (emp) {
            req.flash('error', 'User already exists!');
            console.log('User is already registered!');
            return res.redirect('back');
        }

        // If employee does not have a work email, redirect back
        const domain = req.body.email.split('@')[1];
        if (domain.toLowerCase() !== 'aurora.com') {
            req.flash('error', 'You are not authorized to signup!');
            console.log('User not authorized to signup!');
            return res.redirect('back');
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the employee with the hashed password
        await Employee.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword // Save hashed password
        });

        req.flash('success', 'Account created successfully. Login to continue.');
        return res.redirect('/employee/login');
    } catch (err) {
        console.log(`Error occurred in creating an employee: ${err}`);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('back');
    }
}

// Redirect a successful login to the dashboard
module.exports.createSession = async function(req, res){
    try {
        // Find employee by email
        const employee = await Employee.findOne({ email: req.body.email });

        if (!employee) {
            req.flash('error', 'Invalid credentials!');
            console.log('No employee found with this email.');
            return res.redirect('back');
        }

        // Compare entered password with hashed password stored in the database
        const isMatch = await bcrypt.compare(req.body.password, employee.password);

        if (!isMatch) {
            req.flash('error', 'Invalid credentials!');
            console.log('Password does not match.');
            return res.redirect('back');
        }

        // If passwords match, log the employee in and redirect to dashboard
        req.flash('success', 'Logged in successfully!');
        return res.redirect('/employee/dashboard');
    } catch (err) {
        console.log(`Error during login: ${err}`);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('back');
    }
}

// Logout the employee
module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if (err) {
            console.log(`Error in logging out: ${err}`);
            req.flash('error', 'Something went wrong. Please try again.');
            return res.redirect('back');
        }
        req.flash('success', 'You have been logged out!');
        return res.redirect('/employee/login');
    });
}
