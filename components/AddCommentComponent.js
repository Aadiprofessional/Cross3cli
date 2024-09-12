import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { colors } from '../styles/color';

const AddCommentComponent = ({ setComment, comment }) => {
    const [localComment, setLocalComment] = useState(comment || '');

    const handleCommentChange = (text) => {
        if (text.length <= 500) {
            setLocalComment(text);
        } else {
            Alert.alert('Character Limit Exceeded', 'You can only add up to 500 characters.');
        }
    };

    const handleAddComment = () => {
        if (localComment.length > 0) {
            setComment(localComment); // Update the comment in the parent
        } else {
            Alert.alert('Empty Comment', 'Please add a comment before submitting.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                multiline
                placeholder="Add your comment..."
                placeholderTextColor="#000" // Black placeholder text color
                value={localComment}
                onChangeText={handleCommentChange}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.button}>
                <Text style={styles.buttonText}>Add Comment</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#FFF',
    },
    textInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#000', // Black text color
        textAlignVertical: 'top', // Start text from the top
        flexWrap: 'wrap', // Ensure text wraps to the next line
    },
    button: {
        backgroundColor: colors.main, // Button color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF', // Button text color
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
    },
});

export default AddCommentComponent;
