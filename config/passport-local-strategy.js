const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Employee = require('../models/Employee');

// Passport Local Strategy for login
passport.use(new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async function(req, email, password, done) {
        try {
            // Find the employee by email
            const employee = await Employee.findOne({ email: email });

            // If employee not found or password doesn't match
            if (!employee) {
                console.log('Invalid email or password');
                req.flash('error', 'Invalid email/password!');
                return done(null, false); // No employee found
            }

            // Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, employee.password);
            if (!isMatch) {
                console.log('Invalid credentials');
                req.flash('error', 'Invalid email/password!');
                return done(null, false); // Incorrect password
            }

            // If everything is good, return the employee
            return done(null, employee);
        } catch (err) {
            console.log(`Error in searching for the user in db: ${err}`);
            req.flash('error', 'Something went wrong!');
            return done(err); // Return error if something went wrong
        }
    }
));

// Serialize user to store the user ID in the session
passport.serializeUser(function(employee, done) {
    done(null, employee.id);
});

// Deserialize user by finding the employee using the stored ID
passport.deserializeUser(async function(id, done) {
    try {
        // Find the employee by id
        const employee = await Employee.findById(id);
        if (!employee) {
            return done(null, false); // No employee found
        }
        return done(null, employee); // Return employee if found
    } catch (err) {
        console.log(`Error in searching for the user with the particular id: ${err}`);
        return done(err); // Return error if something went wrong
    }
});

// Middleware to check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // If authenticated, proceed to the next middleware
    }
    return res.redirect('/employee/login'); // Redirect to login if not authenticated
}

// Middleware to set the authenticated user in res.locals
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user; // Set the authenticated user to res.locals.user
    }
    next(); // Proceed to the next middleware
}

module.exports = passport;
