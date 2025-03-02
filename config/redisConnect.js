const {createClient} = require('redis')

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379', 
});

client.on('error', err => console.error('❌ Redis Client Error:', err));

(async () => {
    try {
        await client.connect();
        console.log('✅ Connected to Redis');
    } catch (err) {
        console.error('❌ Failed to connect to Redis:', err);
        process.exit(1); 
    }
})();

module.exports = client