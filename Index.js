

const Telegraf = require('telegraf');
const { Extra, Markup } = require('telegraf');
const fs = require('fs');

// Create a new instance of Telegraf
const bot = new Telegraf('6728550531:AAGYvCa4oJIQuL6cWk4uaXev2UhCF1Wjz2M');

// Define the chat ID of your Telegram group
const chatId = -1002096273326;

// Define the path and filename of the CSV file
const csvFilePath = 'messages.csv';

// Define the header row of the CSV file
const csvHeader = ['Message ID', 'Date', 'Sender', 'Message'];

// Define the function to generate the CSV file
function generateCsvFile(messages) {
  // Create a new array to store the rows of the CSV file
  const csvRows = [];

  // Add the header row to the CSV file
  csvRows.push(csvHeader);

  // Loop through each message and add it to the CSV file
  messages.forEach((message) => {
    // Extract the relevant information from the message object
    const messageId = message.message_id;
    const date = new Date(message.date * 1000).toLocaleString();
    const sender = message.from.username || message.from.first_name || message.from.id;
    const text = message.text || '';

    // Create a new row for the CSV file
    const csvRow = [messageId, date, sender, text];

    // Add the row to the CSV file
    csvRows.push(csvRow);
  });

  // Convert the array of rows to a CSV string
  const csvString = csvRows.map(row => row.join(',')).join('\n');

  // Write the CSV string to a file
  fs.writeFileSync(csvFilePath, csvString);
}

// Define the function to handle the /report command
async function handleReportCommand(ctx) {
  try {
    // Get the messages from the Telegram group
    const messages = await ctx.telegram.getChatHistory(chatId);

    // Generate the CSV file
    generateCsvFile(messages);

    // Send the CSV file to the user
    await ctx.replyWithDocument({ source: csvFilePath }, Extra.caption('Here is your report in CSV format:'));

    // Delete the CSV file
    fs.unlinkSync(csvFilePath);
  } catch (error) {
    console.error(error);
    ctx.reply('An error occurred while generating the report.');
  }
}

// Start the bot and listen for the /report command
bot.startPolling();
bot.command('report', handleReportCommand);

 
