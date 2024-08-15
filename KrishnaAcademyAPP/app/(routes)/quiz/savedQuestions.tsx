import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URI } from '@/utils/uri';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Define the QuestionCard component
const QuestionCard = ({ question }) => (
    <View style={styles.card}>
        <Text style={styles.questionText}>{question.question.en}</Text>
        {Object.entries(question.options).map(([key, option], index) => (
            <Text key={index} style={styles.optionText}>
                {option.en}
            </Text>
        ))}
    </View>
);

// Define the main component
const SavedQuestions = () => {
    const [questions, setQuestions] = useState([]);

 

    useEffect(() => {
        // Fetch the questions when the component mounts
        const fetchQuestions = async () => {
            const userI = await AsyncStorage.getItem("user");
            const isUser = JSON.parse(userI);
            try {
                const response = await axios.get(`${SERVER_URI}/api/v1/quiz/getUserSavedQuestion/${isUser._id}`);
                setQuestions(response.data.data.questions);
            } catch (error) {
                console.error('Error fetching saved questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <SafeAreaProvider style={styles.container}>

            <Text
            style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 20,
                textAlign: 'center',
            }}
            >Saved Questions</Text>

            <ScrollView>


            {questions.map((question, index) => (
                <QuestionCard key={index} question={question} />
            ))}
            </ScrollView>
        </SafeAreaProvider>
    );
};

// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    questionText: {
        fontSize: 16,
        textAlign:'left',
        fontWeight: 'bold',
    },

    optionText: {
        fontSize: 14,
        marginVertical: 4,
    },
});

export default SavedQuestions;