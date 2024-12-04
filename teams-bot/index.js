const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const { MyBot } = require('./bot');

require('dotenv').config();

// Create the server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} connecting  to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors
adapter.onTurnError = async (context, error) => {
    console.error(`[onTurnError] ${error}`);
    await context.sendActivity('Something went wrong dude plese try again!');
};

// Create the bot
const bot = new MyBot();

// Listen for incoming requests
server.post('/api/messages', async (req, res) => {
    try {
        // Process the activity
        await adapter.processActivity(req, res, async (context) => {
            await bot.run(context);
        });
    } catch (error) {
        console.error(`[Error processing activity] ${error}`);
        res.send(500, 'Server Error');
    }
});
