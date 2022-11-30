const fs = require('fs');

// Totally a db, not just saving stuff in files...

function calculate_conversation_path(conversation_id) {
	return 'data/conversations/' + conversation_id + '.json';
}

function get_conversation_messages(conversation_id) {
	console.log('Fetching ' + conversation_id + ' messages.');

	const conversation_path = calculate_conversation_path(conversation_id);

	// Check if the conversation exists
	if (!fs.existsSync(conversation_path)) {
		return [];
	}

	// Return file content
	return JSON.parse(fs.readFileSync(conversation_path));
}

const conversation_message_limit = 50;

function add_message_to_conversation(conversation_id, message) {
	var messages = get_conversation_messages(conversation_id);
	message.ts = new Date().getTime();
	messages.push(message);

	// Make sure messages dont exceed max message limit
	if (messages.length > conversation_message_limit) {
		messages = messages.slice(
			messages.length - conversation_message_limit,
			messages.length
		);
	}

	fs.writeFileSync(
		calculate_conversation_path(conversation_id),
		JSON.stringify(messages)
	);
}

exports.get_conversation_messages = get_conversation_messages;
exports.add_message_to_conversation = add_message_to_conversation;
