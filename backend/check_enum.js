const User = require('./models/User');
console.log('User Role Enum Values:', User.schema.path('role').enumValues);
process.exit(0);
