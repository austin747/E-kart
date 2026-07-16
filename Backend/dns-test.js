const dns = require('dns');

// Force Node.js to bypass your local router DNS and use Google instead
dns.setServers(['8.8.8.8', '8.8.4.4']);